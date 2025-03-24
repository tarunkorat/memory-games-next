"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Home, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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

export default function MemoryMatchGame() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isActive, setIsActive] = useState(false)

  // Add state for the save dialog
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [playerName, setPlayerName] = useState("")

  // Colors for the memory cards
  const colors = [
    "#FF5252", // Red
    "#536DFE", // Blue
    "#4CAF50", // Green
    "#FFD600", // Yellow
    "#9C27B0", // Purple
    "#FF9800", // Orange
    "#FF4081", // Pink
    "#009688", // Teal
  ]

  // Initialize the game
  useEffect(() => {
    initializeGame()
  }, [])

  // Timer effect
  useEffect(() => {
    let interval = null

    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    } else if (!isActive && timer !== 0) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive, timer])

  // Check if game is over
  useEffect(() => {
    if (matched.length > 0 && matched.length === colors.length * 2) {
      setIsActive(false)
      setGameOver(true)
    }
  }, [matched])

  // Update the initializeGame function to reset the dialog state
  const initializeGame = () => {
    // Create pairs of cards with colors
    const cardPairs = [...colors, ...colors]
      .map((color, index) => ({
        id: index,
        color,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5) // Shuffle the cards

    setCards(cardPairs)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameOver(false)
    setTimer(0)
    setIsActive(true)
    setShowSaveDialog(false)
    setPlayerName("")
  }

  // Handle card click
  const handleCardClick = (id) => {
    // Don't allow clicking if two cards are already flipped or the card is already matched
    if (flipped.length === 2 || matched.includes(id)) return

    // Start the timer on first move
    if (moves === 0) {
      setIsActive(true)
    }

    // Add the card to flipped cards
    setFlipped([...flipped, id])

    // If this is the second card flipped
    if (flipped.length === 1) {
      setMoves((moves) => moves + 1)

      // Get the first and second card
      const firstCardId = flipped[0]
      const secondCardId = id
      const firstCard = cards.find((card) => card.id === firstCardId)
      const secondCard = cards.find((card) => card.id === secondCardId)

      // Check if the cards match
      if (firstCard.color === secondCard.color) {
        setMatched([...matched, firstCardId, secondCardId])
        setFlipped([])
      } else {
        // If they don't match, flip them back after a delay
        setTimeout(() => {
          setFlipped([])
        }, 1000)
      }
    }
  }

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Add a function to save the score
  const handleSaveScore = () => {
    if (!playerName.trim()) return

    // Calculate score based on moves and time
    const calculatedScore = Math.max(500 - moves * 10 - timer * 2, 100)

    // Save the score to localStorage
    saveScore({
      playerName: playerName.trim(),
      game: "Memory Grid",
      score: calculatedScore,
      level: Math.floor(colors.length / 2),
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
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
          Memory Grid
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={initializeGame}
          className="border-green-200 text-green-600 hover:bg-green-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-100">
          <div className="text-sm text-green-600 mb-1">Moves</div>
          <div className="text-2xl font-bold text-green-700">{moves}</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-100">
          <div className="text-sm text-green-600 mb-1">Time</div>
          <div className="text-2xl font-bold text-green-700">{formatTime(timer)}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-green-600 mb-2">
          <span>Progress</span>
          <span>
            {matched.length / 2} / {colors.length} pairs
          </span>
        </div>
        <Progress
          value={(matched.length / (colors.length * 2)) * 100}
          className="h-2 bg-green-100"
          indicatorClassName="bg-gradient-to-r from-green-500 to-teal-500"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`aspect-square cursor-pointer transition-all duration-300 transform ${
              flipped.includes(card.id) || matched.includes(card.id) ? "rotate-y-180" : ""
            }`}
            onClick={() => !flipped.includes(card.id) && !matched.includes(card.id) && handleCardClick(card.id)}
          >
            <Card
              className={`w-full h-full flex items-center justify-center ${
                flipped.includes(card.id) || matched.includes(card.id)
                  ? ""
                  : "bg-gradient-to-r from-green-500 to-teal-500"
              } ${matched.includes(card.id) ? "border-green-300" : ""} shadow-md hover:shadow-lg transition-shadow`}
            >
              {flipped.includes(card.id) || matched.includes(card.id) ? (
                <div className="w-full h-full rounded-md" style={{ backgroundColor: card.color }}></div>
              ) : (
                ""
              )}
            </Card>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-green-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Game Complete!</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-700">Total Moves:</span>
                <span className="font-bold text-green-700">{moves}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Time Taken:</span>
                <span className="font-bold text-green-700">{formatTime(timer)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Pairs Found:</span>
                <span className="font-bold text-green-700">
                  {matched.length / 2} / {colors.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Score:</span>
                <span className="font-bold text-green-700">{Math.max(500 - moves * 10 - timer * 2, 100)}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={initializeGame}
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90 transition-opacity"
              >
                Play Again
              </Button>
              <Button variant="outline" asChild className="flex-1 border-green-200 text-green-600 hover:bg-green-50">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
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
              <div className="col-span-3 font-bold">{Math.max(500 - moves * 10 - timer * 2, 100)}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Moves</Label>
              <div className="col-span-3">{moves}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Time</Label>
              <div className="col-span-3">{formatTime(timer)}</div>
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

