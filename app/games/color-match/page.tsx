"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { saveScore } from "@/lib/score-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ColorMatchGame() {
  const [colors, setColors] = useState([])
  const [targetColor, setTargetColor] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState("")
  const [level, setLevel] = useState(1)
  const [feedback, setFeedback] = useState(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [playerName, setPlayerName] = useState("")

  // Color palette
  const colorPalette = [
    { name: "Red", value: "#FF5252" },
    { name: "Blue", value: "#536DFE" },
    { name: "Green", value: "#4CAF50" },
    { name: "Yellow", value: "#FFD600" },
    { name: "Purple", value: "#9C27B0" },
    { name: "Orange", value: "#FF9800" },
    { name: "Pink", value: "#FF4081" },
    { name: "Teal", value: "#009688" },
  ]

  // Start a new game
  const startGame = () => {
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTimeLeft(60)
    setGameActive(true)
    setGameOver(false)
    setLevel(1)
    setMessage("Match the color name with the correct color!")
    setFeedback(null)
    setShowSaveDialog(false)
    setPlayerName("")

    generateNewRound()

    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setGameActive(false)
          setGameOver(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }

  // Generate a new round of colors
  const generateNewRound = () => {
    // Determine how many colors to show based on level
    const numColors = Math.min(3 + Math.floor(level / 2), colorPalette.length)

    // Get a subset of colors
    const shuffledColors = [...colorPalette].sort(() => 0.5 - Math.random()).slice(0, numColors)

    // Select a target color
    const target = shuffledColors[Math.floor(Math.random() * shuffledColors.length)]

    // For higher levels, sometimes show color names that don't match their display color
    const colorOptions = shuffledColors.map((color) => {
      // At higher levels, introduce more mismatches
      const shouldMismatch = Math.random() < level * 0.1 && level > 2

      if (shouldMismatch) {
        // Get a different color for the display
        const otherColors = colorPalette.filter((c) => c.name !== color.name)
        const displayColor = otherColors[Math.floor(Math.random() * otherColors.length)]

        return {
          name: color.name,
          displayValue: displayColor.value,
          matches: false,
        }
      }

      return {
        name: color.name,
        displayValue: color.value,
        matches: true,
      }
    })

    setColors(colorOptions)
    setTargetColor(target)
  }

  // Handle color selection
  const handleColorSelect = (selectedColor) => {
    if (!gameActive) return

    const isCorrect = selectedColor.name === targetColor.name && selectedColor.matches

    if (isCorrect) {
      // Correct match
      const newScore = score + 10 * level
      setScore(newScore)

      const newStreak = streak + 1
      setStreak(newStreak)

      if (newStreak > bestStreak) {
        setBestStreak(newStreak)
      }

      setFeedback({ correct: true, message: "Correct!" })

      // Level up every 5 correct answers
      if (newScore % (50 * level) === 0) {
        setLevel((prevLevel) => prevLevel + 1)
        setMessage(`Level up! Now at level ${level + 1}`)
      }
    } else {
      // Incorrect match
      setStreak(0)
      setFeedback({ correct: false, message: "Wrong!" })
    }

    // Short delay before next round
    setTimeout(() => {
      generateNewRound()
      setFeedback(null)
    }, 1000)
  }

  const handleSaveScore = () => {
    if (!playerName.trim()) return

    // Save the score to localStorage
    saveScore({
      playerName: playerName.trim(),
      game: "Color Match",
      score: score,
      level: level,
    })

    // Close the dialog
    setShowSaveDialog(false)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Color Match
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={startGame}
          className="border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
          <div className="text-sm text-purple-600 mb-1">Score</div>
          <div className="text-2xl font-bold text-purple-700">{score}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
          <div className="text-sm text-purple-600 mb-1">Time Left</div>
          <div className="text-2xl font-bold text-purple-700">{timeLeft}s</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-purple-600">
          Level: <span className="font-bold text-purple-700">{level}</span>
        </div>
        <div className="text-sm text-purple-600">
          Streak: <span className="font-bold text-purple-700">{streak}</span> | Best:{" "}
          <span className="font-bold text-purple-700">{bestStreak}</span>
        </div>
      </div>

      <div className="mb-4">
        <Progress
          value={(timeLeft / 60) * 100}
          className="h-2 bg-purple-100"
          indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
        />
      </div>

      {message && (
        <div className="bg-white border border-purple-100 rounded-lg p-4 mb-6 text-center text-purple-700">
          {message}
        </div>
      )}

      {!gameActive && !gameOver && (
        <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mb-6 border border-purple-100">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">How to Play</h2>
          <p className="text-center mb-6 text-slate-700">
            Match the target color name with the correct color block. Be careful - sometimes the color name and the
            displayed color don't match!
          </p>
          <Button
            onClick={startGame}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
          >
            Start Game
          </Button>
        </div>
      )}

      {gameActive && targetColor && (
        <div className="flex flex-col items-center">
          <div className="mb-8 text-center">
            <div className="text-lg text-slate-700 mb-2">Find the color:</div>
            <div className="text-3xl font-bold text-purple-700">{targetColor.name}</div>
          </div>

          {feedback && (
            <div
              className={`mb-6 py-2 px-4 rounded-full ${
                feedback.correct
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              } flex items-center justify-center`}
            >
              {feedback.correct ? <Check className="mr-2 h-5 w-5" /> : <X className="mr-2 h-5 w-5" />}
              {feedback.message}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
            {colors.map((color, index) => (
              <button
                key={index}
                className="h-24 rounded-lg shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                style={{ backgroundColor: color.displayValue }}
                onClick={() => handleColorSelect(color)}
                disabled={!!feedback}
              />
            ))}
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 bg-purple-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Game Over!</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-700">Final Score:</span>
                <span className="font-bold text-purple-700">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Best Streak:</span>
                <span className="font-bold text-purple-700">{bestStreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Level Reached:</span>
                <span className="font-bold text-purple-700">{level}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={startGame}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
              >
                Play Again
              </Button>
              <Button variant="outline" asChild className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50">
                <Link href="/">Home</Link>
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setShowSaveDialog(true)}>
                Save Score
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Score</DialogTitle>
            <DialogDescription>Enter your name to save your score to the leaderboard.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Score</Label>
              <div className="col-span-3 font-bold">{score}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Level</Label>
              <div className="col-span-3">{level}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveScore}>Save Score</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

