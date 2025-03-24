"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Play, Volume2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Add the import for saveScore
import { saveScore } from "@/lib/score-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function SequenceRecallGame() {
  const [sequence, setSequence] = useState([])
  const [userSequence, setUserSequence] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState("")
  const [isUserTurn, setIsUserTurn] = useState(false)

  // Add state for the save dialog
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [playerName, setPlayerName] = useState("")

  const colors = [
    { id: 0, color: "#FF5252", sound: 329.63 }, // Red - E4
    { id: 1, color: "#4CAF50", sound: 392.0 }, // Green - G4
    { id: 2, color: "#536DFE", sound: 440.0 }, // Blue - A4
    { id: 3, color: "#FFD600", sound: 523.25 }, // Yellow - C5
  ]

  const audioContext = useRef(null)

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== "undefined") {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  // Update the startGame function to reset the dialog state
  const startGame = () => {
    setSequence([])
    setUserSequence([])
    setLevel(1)
    setScore(0)
    setGameOver(false)
    setMessage("")
    setShowSaveDialog(false)
    setPlayerName("")
    generateSequence(1)
  }

  // Generate a new sequence for the current level
  const generateSequence = (currentLevel) => {
    const newSequence = [...sequence]
    // Add a new random color to the sequence
    newSequence.push(Math.floor(Math.random() * 4))
    setSequence(newSequence)
    setIsPlaying(true)
    playSequence(newSequence)
  }

  // Play the sequence for the user to observe
  const playSequence = async (seq) => {
    setIsUserTurn(false)
    setMessage("Watch the sequence...")

    // Play each color in the sequence with a delay
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          highlightColor(seq[i])
          resolve()
        }, 800)
      })

      // Pause between highlights
      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    // After playing the sequence, it's the user's turn
    setIsUserTurn(true)
    setUserSequence([])
    setMessage("Your turn! Repeat the sequence")
  }

  // Highlight a color and play its sound
  const highlightColor = (colorId) => {
    // Play the sound
    playSound(colors[colorId].sound)

    // Create a flash effect for the color
    const colorElement = document.getElementById(`color-${colorId}`)
    if (colorElement) {
      colorElement.classList.add("opacity-100")
      colorElement.classList.add("scale-105")

      setTimeout(() => {
        colorElement.classList.remove("opacity-100")
        colorElement.classList.remove("scale-105")
      }, 300)
    }
  }

  // Play a sound with the given frequency
  const playSound = (frequency) => {
    if (!audioContext.current) return

    const oscillator = audioContext.current.createOscillator()
    const gainNode = audioContext.current.createGain()

    oscillator.type = "sine"
    oscillator.frequency.value = frequency
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.current.destination)

    gainNode.gain.value = 0.3
    oscillator.start()

    setTimeout(() => {
      oscillator.stop()
    }, 300)
  }

  // Handle user clicking a color
  const handleColorClick = (colorId) => {
    if (!isUserTurn || gameOver) return

    highlightColor(colorId)

    const newUserSequence = [...userSequence, colorId]
    setUserSequence(newUserSequence)

    // Check if the user's sequence matches the game sequence so far
    const isCorrect = newUserSequence.every((id, index) => id === sequence[index])

    if (!isCorrect) {
      // User made a mistake
      setGameOver(true)
      setMessage(`Game Over! Your score: ${score}`)
      return
    }

    // Check if the user completed the sequence
    if (newUserSequence.length === sequence.length) {
      // User successfully completed the sequence
      const newScore = score + level
      setScore(newScore)
      setLevel(level + 1)
      setMessage(`Level ${level} complete! +${level} points`)

      // Start the next level after a delay
      setTimeout(() => {
        generateSequence(level + 1)
      }, 1500)
    }
  }

  // Replay the current sequence
  const replaySequence = () => {
    if (isUserTurn && !gameOver) {
      setUserSequence([])
      playSequence(sequence)
    }
  }

  // Add a function to save the score
  const handleSaveScore = () => {
    if (!playerName.trim()) return

    // Save the score to localStorage
    saveScore({
      playerName: playerName.trim(),
      game: "Color Sequence",
      score: score,
      level: level,
    })

    // Close the dialog
    setShowSaveDialog(false)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Color Sequence
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={startGame}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="text-sm text-blue-600 mb-1">Level</div>
          <div className="text-2xl font-bold text-blue-700">{level}</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="text-sm text-blue-600 mb-1">Score</div>
          <div className="text-2xl font-bold text-blue-700">{score}</div>
        </div>
      </div>

      {message && (
        <Alert className="mb-6 bg-white border-blue-100">
          <AlertDescription className="text-blue-700">{message}</AlertDescription>
        </Alert>
      )}

      {sequence.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-6 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">How to Play</h2>
          <p className="text-center mb-6 text-slate-700">
            Watch the sequence of colors and sounds, then repeat it in the same order. Each level adds one more step to
            remember!
          </p>
          <Button
            onClick={startGame}
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
          >
            <Play className="h-4 w-4" />
            Start Game
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {colors.map((color) => (
              <div
                key={color.id}
                id={`color-${color.id}`}
                className="h-32 sm:h-40 rounded-lg cursor-pointer opacity-60 transition-all duration-300 transform shadow-md hover:shadow-lg"
                style={{ backgroundColor: color.color }}
                onClick={() => handleColorClick(color.id)}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-6">
            {isUserTurn && (
              <Button
                variant="outline"
                onClick={replaySequence}
                className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Volume2 className="h-4 w-4" />
                Replay Sequence
              </Button>
            )}
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-blue-600 mb-2">
              <span>Sequence Progress</span>
              <span>
                {userSequence.length} / {sequence.length} steps
              </span>
            </div>
            <Progress
              value={(userSequence.length / sequence.length) * 100}
              className="h-2 bg-blue-100"
              indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
            />
          </div>
        </>
      )}

      {gameOver && (
        <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Game Over!</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-700">Final Level:</span>
                <span className="font-bold text-blue-700">{level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Final Score:</span>
                <span className="font-bold text-blue-700">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Longest Sequence:</span>
                <span className="font-bold text-blue-700">{sequence.length}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={startGame}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
              >
                Play Again
              </Button>
              <Button variant="outline" asChild className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                <Link href="/">Home</Link>
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setShowSaveDialog(true)}>
                Save Score
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add the save score dialog */}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Sequence Length</Label>
              <div className="col-span-3">{sequence.length}</div>
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

