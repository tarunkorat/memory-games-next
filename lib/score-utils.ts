export interface GameScore {
  id: string
  playerName: string
  game: string
  score: number
  level?: number
  date: number // timestamp
}

export interface LeaderboardEntry extends GameScore {
  rank: number
}

const STORAGE_KEY = "colorboost-leaderboard"

// Get all scores from localStorage
export function getAllScores(): GameScore[] {
  if (typeof window === "undefined") return []

  const storedScores = localStorage.getItem(STORAGE_KEY)
  if (!storedScores) return []

  try {
    return JSON.parse(storedScores)
  } catch (e) {
    console.error("Error parsing scores from localStorage", e)
    return []
  }
}

// Save a new score
export function saveScore(score: Omit<GameScore, "id" | "date">): GameScore {
  const newScore: GameScore = {
    ...score,
    id: generateId(),
    date: Date.now(),
  }

  const scores = getAllScores()
  scores.push(newScore)

  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score)

  // Store back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))

  return newScore
}

// Get top scores for a specific game or all games
export function getTopScores(game?: string, limit = 10): LeaderboardEntry[] {
  const scores = getAllScores()

  // Filter by game if specified
  const filteredScores = game ? scores.filter((score) => score.game === game) : scores

  // Sort by score (highest first)
  const sortedScores = [...filteredScores].sort((a, b) => b.score - a.score)

  // Take only the top N scores
  return sortedScores.slice(0, limit).map((score, index) => ({
    ...score,
    rank: index + 1,
  }))
}

// Generate a random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Add some fake initial data if no scores exist
export function initializeWithFakeData() {
  if (getAllScores().length > 0) return

  const games = ["Color Match", "Memory Grid", "Color Sequence", "Speed Match", "Word Memory"]
  const names = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Quinn",
    "Avery",
    "Cameron",
    "Dakota",
    "Jamie",
    "Skyler",
    "Reese",
    "Finley",
    "Emerson",
  ]

  const fakeScores: Omit<GameScore, "id" | "date">[] = []

  // Generate 20 fake scores
  for (let i = 0; i < 20; i++) {
    const game = games[Math.floor(Math.random() * games.length)]
    const name = names[Math.floor(Math.random() * names.length)]
    const baseScore = Math.floor(Math.random() * 500) + 100
    const level = Math.floor(Math.random() * 10) + 1

    fakeScores.push({
      playerName: name,
      game,
      score: baseScore,
      level,
    })
  }

  // Add some very high scores for the top positions
  fakeScores.push({ playerName: "Memory Master", game: "Memory Grid", score: 950, level: 12 })
  fakeScores.push({ playerName: "ColorGenius", game: "Color Match", score: 920, level: 11 })
  fakeScores.push({ playerName: "BrainWizard", game: "Word Memory", score: 880, level: 10 })

  // Save all fake scores
  fakeScores.forEach((score) => saveScore(score))
}

