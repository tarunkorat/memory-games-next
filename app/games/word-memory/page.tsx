"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { saveScore } from "@/lib/score-utils"

export default function WordMemoryGame() {
  const [words, setWords] = useState([])
  const [userInput, setUserInput] = useState("")
  const [phase, setPhase] = useState("start") // start, memorize, recall, results
  const [timer, setTimer] = useState(0)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [message, setMessage] = useState("")
  const [recalledWords, setRecalledWords] = useState([])
  const [correctWords, setCorrectWords] = useState([])
  const [incorrectWords, setIncorrectWords] = useState([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [playerName, setPlayerName] = useState("")

  // Word lists by difficulty
  const wordLists = {
    easy: [
      "apple",
      "book",
      "cat",
      "dog",
      "egg",
      "fish",
      "game",
      "hat",
      "ice",
      "jump",
      "kite",
      "lamp",
      "moon",
      "note",
      "orange",
      "pen",
      "queen",
      "rain",
      "sun",
      "tree",
      "umbrella",
      "van",
      "water",
      "box",
      "yellow",
      "zebra",
      "air",
      "ball",
      "car",
      "door",
    ],
    medium: [
      "airplane",
      "birthday",
      "computer",
      "dinosaur",
      "elephant",
      "furniture",
      "giraffe",
      "hospital",
      "internet",
      "jewelry",
      "kangaroo",
      "language",
      "mountain",
      "notebook",
      "octopus",
      "penguin",
      "question",
      "rainbow",
      "sandwich",
      "telephone",
      "universe",
      "vacation",
      "waterfall",
      "xylophone",
    ],
    hard: [
      "algorithm",
      "biography",
      "chemistry",
      "democracy",
      "evolution",
      "frequency",
      "geography",
      "hypothesis",
      "innovation",
      "journalism",
      "knowledge",
      "laboratory",
      "mechanism",
      "nutrition",
      "obligation",
      "philosophy",
      "qualification",
      "revolution",
      "statistics",
      "technology",
      "university",
      "vocabulary",
      "wilderness",
      "zoology",
    ],
  }

  // Start a new game
  const startGame = () => {
    setPhase("memorize")
    setLevel(1)
    setScore(0)
    generateWordList(1)
    setTimer(30) // 30 seconds to memorize
    setMessage("Memorize these words!")

    // Start the timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval)
          setPhase("recall")
          setMessage("Now recall as many words as you can!")
          setRecalledWords([])
          setCorrectWords([])
          setIncorrectWords([])
          return 60 // 60 seconds to recall
        }
        return prevTimer - 1
      })
    }, 1000)
  }

  // Generate a list of words for the current level
  const generateWordList = (currentLevel) => {
    let difficulty = "easy"
    if (currentLevel > 3) difficulty = "medium"
    if (currentLevel > 6) difficulty = "hard"

    // Number of words increases with level
    const wordCount = 3 + currentLevel

    // Get random words from the appropriate list
    const shuffled = [...wordLists[difficulty]].sort(() => 0.5 - Math.random())
    const selectedWords = shuffled.slice(0, wordCount)

    setWords(selectedWords)
  }

  // Handle user submitting a word
  const handleSubmitWord = (e) => {
    e.preventDefault()

    if (!userInput.trim()) return

    // Add the word to recalled words
    const newWord = userInput.trim().toLowerCase()

    // Check if the word has already been recalled
    if (recalledWords.includes(newWord)) {
      setMessage("You already entered that word!")
      setUserInput("")
      return
    }

    setRecalledWords([...recalledWords, newWord])

    // Check if the word was in the original list
    if (words.includes(newWord)) {
      setCorrectWords([...correctWords, newWord])
    } else {
      setIncorrectWords([...incorrectWords, newWord])
    }

    setUserInput("")
  }

  // End the recall phase and show results
  const endRecall = () => {
    setPhase("results")

    // Calculate score: +1 for each correct word, -0.5 for each incorrect word
    const newScore = correctWords.length - incorrectWords.length * 0.5
    const finalScore = score + Math.max(0, newScore)
    setScore(finalScore)

    // Determine if player advances to next level
    const recallPercentage = (correctWords.length / words.length) * 100

    if (recallPercentage >= 70) {
      setMessage(`Great job! You recalled ${correctWords.length} out of ${words.length} words correctly!`)
      setLevel(level + 1)
    } else {
      setMessage(`You recalled ${correctWords.length} out of ${words.length} words correctly. Try again!`)
      // Show save score dialog when game is effectively over
      setShowSaveDialog(true)
    }
  }

  // Save score to localStorage
  const handleSaveScore = () => {
    if (!playerName.trim()) return

    // Save the score to localStorage
    saveScore({
      playerName: playerName.trim(),
      game: "Word Memory",
      score: Math.round(score),
      level: level,
    })

    // Close the dialog
    setShowSaveDialog(false)
  }

  // Timer effect for recall phase
  useEffect(() => {
    if (phase === "recall") {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval)
            endRecall()
            return 0
          }
          return prevTimer - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [phase])

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Word Memory</h1>
        <Button variant="outline" size="sm" onClick={() => setPhase("start")}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Level</div>
          <div className="text-2xl font-bold">{level}</div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Score</div>
          <div className="text-2xl font-bold">{score}</div>
        </div>
      </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {phase === "start" && (
        <div className="flex flex-col items-center justify-center p-12 bg-muted rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">How to Play</h2>
          <p className="text-center mb-6">
            You'll be shown a list of words to memorize. After the time is up, try to recall as many words as possible!
          </p>
          <Button onClick={startGame} size="lg">
            Start Game
          </Button>
        </div>
      )}

      {phase === "memorize" && (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Memorization Time</span>
              <span>{formatTime(timer)}</span>
            </div>
            <Progress value={(timer / 30) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {words.map((word, index) => (
              <Card key={index} className="bg-primary/10">
                <CardContent className="p-4 flex items-center justify-center">
                  <span className="text-lg font-medium">{word}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {phase === "recall" && (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Recall Time</span>
              <span>{formatTime(timer)}</span>
            </div>
            <Progress value={(timer / 60) * 100} className="h-2" />
          </div>

          <form onSubmit={handleSubmitWord} className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a word you remember..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Add</Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Correct Words ({correctWords.length})
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 min-h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {correctWords.map((word, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <X className="h-4 w-4 text-red-500 mr-2" />
                Incorrect Words ({incorrectWords.length})
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 min-h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {incorrectWords.map((word, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button onClick={endRecall} className="w-full">
            I'm Done Recalling
          </Button>
        </>
      )}

      {phase === "results" && (
        <div className="bg-muted rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>Words to Memorize:</span>
              <span className="font-bold">{words.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Words Correctly Recalled:</span>
              <span className="font-bold text-green-600">{correctWords.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Incorrect Words:</span>
              <span className="font-bold text-red-600">{incorrectWords.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Recall Percentage:</span>
              <span className="font-bold">{Math.round((correctWords.length / words.length) * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Points Earned:</span>
              <span className="font-bold">{Math.max(0, correctWords.length - incorrectWords.length * 0.5)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Original Words</h3>
              <div className="bg-background border rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {words.map((word, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-sm ${
                        correctWords.includes(word) ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Your Recalled Words</h3>
              <div className="bg-background border rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {recalledWords.map((word, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-sm ${
                        words.includes(word) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={startGame} className="flex-1">
              {level > 1 ? `Continue to Level ${level}` : "Try Again"}
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowSaveDialog(true)}>
              Save Score
            </Button>
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
              <div className="col-span-3 font-bold">{Math.round(score)}</div>
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

