"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Trophy, Medal, Award, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getTopScores, type LeaderboardEntry, initializeWithFakeData } from "@/lib/score-utils"

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("all")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Initialize with fake data if no scores exist
    initializeWithFakeData()

    // Load scores based on the active tab
    const game = activeTab === "all" ? undefined : activeTab
    const scores = getTopScores(game, 10)
    setLeaderboard(scores)
  }, [activeTab])

  // Get the top 3 and remaining entries
  const topThree = leaderboard.slice(0, 3)
  const remaining = leaderboard.slice(3, 10)

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get color based on game
  const getGameColor = (game: string) => {
    switch (game) {
      case "Color Match":
        return "from-pink-400 to-purple-500"
      case "Color Sequence":
        return "from-blue-400 to-indigo-500"
      case "Memory Grid":
        return "from-green-400 to-teal-500"
      case "Speed Match":
        return "from-orange-400 to-red-500"
      case "Word Memory":
        return "from-violet-400 to-indigo-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            <Trophy className="inline-block mr-2 h-6 w-6 text-yellow-500" />
            Leaderboard
          </CardTitle>
          <Tabs defaultValue="all" className="w-fit" onValueChange={setActiveTab}>
            <TabsList className="bg-purple-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                All Games
              </TabsTrigger>
              <TabsTrigger
                value="Color Match"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Color Match
              </TabsTrigger>
              <TabsTrigger
                value="Memory Grid"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Memory Grid
              </TabsTrigger>
              <TabsTrigger
                value="Word Memory"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Word Memory
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No scores yet. Play some games!</div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="flex justify-center items-end mb-8 mt-4 gap-4">
              {/* Second Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center">
                  <Avatar className="h-16 w-16 border-2 border-silver shadow-lg bg-gradient-to-br from-gray-300 to-gray-400">
                    <AvatarFallback className="text-white text-xl">
                      {getInitials(topThree[1].playerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2 text-center">
                    <div className="font-semibold text-sm truncate max-w-[80px]">{topThree[1].playerName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[80px]">{topThree[1].game}</div>
                    <div className="font-bold text-gray-700">{topThree[1].score}</div>
                    <Medal className="h-6 w-6 mx-auto mt-1 text-gray-400" />
                  </div>
                  <div className="h-20 w-20 bg-gradient-to-t from-gray-200 to-gray-300 rounded-t-lg mt-2 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                </div>
              )}

              {/* First Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center -mb-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-gold shadow-lg bg-gradient-to-br from-yellow-300 to-yellow-500">
                      <AvatarFallback className="text-white text-2xl">
                        {getInitials(topThree[0].playerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-semibold truncate max-w-[100px]">{topThree[0].playerName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[100px]">{topThree[0].game}</div>
                    <div className="font-bold text-gray-700 text-lg">{topThree[0].score}</div>
                    <div className="flex justify-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                  <div className="h-28 w-28 bg-gradient-to-t from-yellow-200 to-yellow-300 rounded-t-lg mt-2 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center">
                  <Avatar className="h-14 w-14 border-2 border-bronze shadow-lg bg-gradient-to-br from-amber-600 to-amber-700">
                    <AvatarFallback className="text-white text-lg">
                      {getInitials(topThree[2].playerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2 text-center">
                    <div className="font-semibold text-sm truncate max-w-[80px]">{topThree[2].playerName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[80px]">{topThree[2].game}</div>
                    <div className="font-bold text-gray-700">{topThree[2].score}</div>
                    <Award className="h-5 w-5 mx-auto mt-1 text-amber-700" />
                  </div>
                  <div className="h-16 w-16 bg-gradient-to-t from-amber-200 to-amber-300 rounded-t-lg mt-2 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                </div>
              )}
            </div>

            {/* Remaining Top 10 */}
            <div className="space-y-2 mt-8">
              {remaining.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center font-bold text-white bg-gradient-to-br rounded-full mr-3 text-sm"
                    style={
                      {
                        background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                        "--tw-gradient-from": "#a855f7",
                        "--tw-gradient-to": "#3b82f6",
                        "--tw-gradient-stops": "var(--tw-gradient-from), var(--tw-gradient-to)",
                      } as React.CSSProperties
                    }
                  >
                    {entry.rank}
                  </div>
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className={`bg-gradient-to-br ${getGameColor(entry.game)} text-white`}>
                      {getInitials(entry.playerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{entry.playerName}</div>
                    <div className="text-xs text-gray-500">{entry.game}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{entry.score}</div>
                    <div className="text-xs text-gray-500">{entry.level ? `Level ${entry.level}` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

