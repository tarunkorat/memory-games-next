"use client"

import { useState } from "react"
import Link from "next/link"
import { Grid3X3, Clock, Layers, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function GamesDashboard() {
  const [activeTab, setActiveTab] = useState("all")

  const games = [
    {
      id: "color-match",
      title: "Color Match",
      description: "Match colors to test your visual memory and attention",
      icon: <Palette className="h-8 w-8" />,
      difficulty: "Easy",
      category: "visual",
      path: "/games/color-match",
      color: "bg-gradient-to-br from-pink-400 to-purple-500",
      textColor: "text-white",
    },
    {
      id: "sequence-recall",
      title: "Color Sequence",
      description: "Remember and repeat sequences of colors and sounds",
      icon: <Layers className="h-8 w-8" />,
      difficulty: "Medium",
      category: "auditory",
      path: "/games/sequence-recall",
      color: "bg-gradient-to-br from-blue-400 to-indigo-500",
      textColor: "text-white",
    },
    {
      id: "memory-grid",
      title: "Memory Grid",
      description: "Find matching pairs of colored cards",
      icon: <Grid3X3 className="h-8 w-8" />,
      difficulty: "Medium",
      category: "visual",
      path: "/games/memory-match",
      color: "bg-gradient-to-br from-green-400 to-teal-500",
      textColor: "text-white",
    },
    {
      id: "speed-match",
      title: "Speed Match",
      description: "Quickly identify if the current color matches the previous one",
      icon: <Clock className="h-8 w-8" />,
      difficulty: "Hard",
      category: "speed",
      path: "/games/speed-match",
      color: "bg-gradient-to-br from-orange-400 to-red-500",
      textColor: "text-white",
    },
  ]

  const filteredGames = activeTab === "all" ? games : games.filter((game) => game.category === activeTab)

  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="bg-purple-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              All Games
            </TabsTrigger>
            <TabsTrigger value="visual" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Visual
            </TabsTrigger>
            <TabsTrigger value="auditory" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Auditory
            </TabsTrigger>
            <TabsTrigger value="speed" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Speed
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredGames.map((game) => (
              <Card
                key={game.id}
                className="flex flex-col overflow-hidden transition-all hover:shadow-lg border-0 shadow-sm"
              >
                <CardHeader className={`pb-2 ${game.color} ${game.textColor}`}>
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-white/20 text-white">{game.icon}</div>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                      {game.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{game.title}</CardTitle>
                  <CardDescription className="text-white/80">{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="w-full h-32 bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=128&width=256&text=${game.title}`}
                      alt={`${game.title} preview`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-white p-4">
                  <Button asChild className={`w-full ${game.color} hover:opacity-90 transition-opacity`}>
                    <Link href={game.path}>Play Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

