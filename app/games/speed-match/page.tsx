"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Clock, Target, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export default function SpeedMatchGame() {
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState("")
  const [lastResponse, setLastResponse] = useState(null)

  const timerRef = useRef(null)

  // Add state for the save dialog
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [playerName, setPlayerName] = useState("")

  // Colors for the cards
  const colors = [
    { name: "Red", value: "#FF5252" },
    { name: "Blue", value: "#536DFE" },
    { name: "Green", value: "#4CAF50" },
    { name: "Yellow", value: "#FFD600" },
    { name: "Purple", value: "#9C27B0" },
    { name: "Orange", value: "#FF9800" },
  ]

  // Start a new game
  const startGame = () => {
    // Generate a sequence of cards
    const newCards = generateCards(40)

    setCards(newCards)
    setCurrentCardIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTimeLeft(60)
    setGameActive(true)
    setGameOver(false)
    setMessage("Does the current color match the previous one?")
    setLastResponse(null)
    setShowSaveDialog(false)
    setPlayerName("")

    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current)
          setGameActive(false)
          setGameOver(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  // Generate a sequence of cards
  const generateCards = (count) => {
    const cards = []

    // First card is random
    const firstColor = colors[Math.floor(Math.random() * colors.length)]
    cards.push({
      color: firstColor,
      matches: false, // First card doesn't match anything
    })

    // Generate the rest of the cards
    for (let i = 1; i < count; i++) {
      // 40% chance the card matches the previous one
      const matches = Math.random() < 0.4

      if (matches) {
        // Same color as previous card
        cards.push({
          color: cards[i - 1].color,
          matches: true,
        })
      } else {
        // Different color than previous card
        let newColor
        do {
          newColor = colors[Math.floor(Math.random() * colors.length)]
        } while (newColor.name === cards[i - 1].color.name)

        cards.push({
          color: newColor,
          matches: false,
        })
      }
    }

    return cards
  }

  // Handle user response (match or no match)
  const handleResponse = (isMatch) => {
    if (!gameActive || currentCardIndex === 0) return

    const currentCard = cards[currentCardIndex]
    const isCorrect = (isMatch && currentCard.matches) || (!isMatch && !currentCard.matches)

    setLastResponse({
      isCorrect,
      isMatch,
    })

    if (isCorrect) {
      // Correct answer
      setScore(score + 10)
      setStreak(streak + 1)
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1)
      }
    } else {
      // Incorrect answer
      setStreak(0)
    }

    // Move to the next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      // Generate more cards if we're running out
      const newCards = [...cards, ...generateCards(20)]
      setCards(newCards)
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Add a function to save the score
  const handleSaveScore = () => {
    if (!playerName.trim()) return

    // Save the score to localStorage
    saveScore({
      playerName: playerName.trim(),
      game: "Speed Match",
      score: score,
      level: Math.floor(bestStreak / 5) + 1,
    })

    // Close the dialog
    setShowSaveDialog(false)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
          Speed Match
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={startGame}
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
          <div className="text-sm text-orange-600 mb-1">Score</div>
          <div className="text-2xl font-bold text-orange-700">{score}</div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
          <div className="text-sm text-orange-600 mb-1">Time Left</div>
          <div className="text-2xl font-bold flex items-center text-orange-700">
            <Clock className="mr-2 h-5 w-5" />
            {timeLeft}s
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-orange-600">
          Current Streak: <span className="font-bold text-orange-700">{streak}</span>
        </div>
        <div className="text-sm text-orange-600">
          Best Streak: <span className="font-bold text-orange-700">{bestStreak}</span>
        </div>
      </div>

      <div className="mb-4">
        <Progress
          value={(timeLeft / 60) * 100}
          className="h-2 bg-orange-100"
          indicatorClassName="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>

      {message && (
        <Alert className="mb-6 bg-white border-orange-100">
          <AlertDescription className="text-orange-700">{message}</AlertDescription>
        </Alert>
      )}

      {!gameActive && !gameOver && (
        <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg mb-6 border border-orange-100">
          <h2 className="text-xl font-semibold mb-4 text-orange-700">How to Play</h2>
          <p className="text-center mb-6 text-slate-700">
            Quickly decide if the current color matches the previous one. Press "Match" if it's the same color, or "No
            Match" if it's different.
          </p>
          <Button
            onClick={startGame}
            size="lg"
            className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90 transition-opacity"
          >
            <Target className="h-4 w-4" />
            Start Game
          </Button>
        </div>
      )}

      {gameActive && (
        <div className="flex flex-col items-center">
          <div className="flex justify-center gap-12 mb-8">
            {currentCardIndex > 0 && (
              <Card className="relative border-0 shadow-md overflow-hidden">
                <CardContent className="flex items-center justify-center p-6 opacity-50">
                  <div
                    className="w-24 h-24 rounded-md"
                    style={{ backgroundColor: cards[currentCardIndex - 1].color.value }}
                  ></div>
                  <div className="absolute top-2 left-2 text-xs font-medium text-white bg-black/30 px-2 py-1 rounded">
                    Previous
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-2 border-orange-400 shadow-md overflow-hidden">
              <CardContent className="flex items-center justify-center p-6">
                <div
                  className="w-24 h-24 rounded-md"
                  style={{ backgroundColor: cards[currentCardIndex].color.value }}
                ></div>
                <div className="absolute top-2 left-2 text-xs font-medium text-white bg-orange-500 px-2 py-1 rounded">
                  Current
                </div>
              </CardContent>
            </Card>
          </div>

          {lastResponse && (
            <div
              className={`mb-6 py-2 px-4 rounded-full ${
                lastResponse.isCorrect
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              } flex items-center justify-center`}
            >
              {lastResponse.isCorrect ? <Check className="mr-2 h-5 w-5" /> : <X className="mr-2 h-5 w-5" />}
              {lastResponse.isCorrect ? "Correct!" : "Wrong!"}
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <Button
              variant="outline"
              size="lg"
              className="w-32 border-green-500 hover:bg-green-50 text-green-600"
              onClick={() => handleResponse(true)}
            >
              <Check className="mr-2 h-5 w-5" />
              Match
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-32 border-red-500 hover:bg-red-50 text-red-600"
              onClick={() => handleResponse(false)}
            >
              <X className="mr-2 h-5 w-5" />
              No Match
            </Button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 bg-orange-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-orange-700">Game Over!</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-700">Final Score:</span>
                <span className="font-bold text-orange-700">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Best Streak:</span>
                <span className="font-bold text-orange-700">{bestStreak}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={startGame}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90 transition-opacity"
              >
                Play Again
              </Button>
              <Button variant="outline" asChild className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50">
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
              <Label className="text-right">Best Streak</Label>
              <div className="col-span-3">{bestStreak}</div>
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

