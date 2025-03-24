import Link from "next/link"
import { ArrowRight, Brain, Zap, Trophy, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GamesDashboard from "@/components/games-dashboard"
import Leaderboard from "@/components/leaderboard"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-blue-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-purple-600">
            <Brain className="h-6 w-6" />
            <span className="font-bold text-xl">ColorBoost</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                Features
              </Button>
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                Pricing
              </Button>
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                About
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" size="sm">
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-100 via-blue-50 to-pink-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-600 font-medium">
                  Boost Your Memory
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500">
                  Train Your Brain with Fun Color Games
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-700 md:text-xl">
                  Improve your cognitive abilities with our colorful memory games. Match colors, remember patterns, and
                  have fun!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="gap-1 bg-purple-600 hover:bg-purple-700">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-1">
              <div>
                <div className="flex flex-col items-start justify-center space-y-4 mb-8">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                    Featured Games
                  </h2>
                  <p className="max-w-[700px] text-slate-700 md:text-xl">
                    Choose from our collection of colorful memory-boosting games designed to improve different cognitive
                    skills.
                  </p>
                </div>
                <GamesDashboard />
              </div>

              <div>
                <div className="flex flex-col items-start justify-center space-y-4 mb-8">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                    Top Players
                  </h2>
                  <p className="max-w-[700px] text-slate-700 md:text-xl">
                    See who's leading the pack with the highest scores across all our brain-training games.
                  </p>
                </div>
                <Leaderboard />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-stretch">
              <Card className="flex flex-col border-purple-100 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <Zap className="h-10 w-10 text-purple-500 mb-2" />
                  <CardTitle className="text-purple-700">Improve Memory</CardTitle>
                  <CardDescription className="text-slate-600">
                    Enhance your short-term and long-term memory through regular practice.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-slate-700">
                    Our games are designed to target different memory systems in your brain, helping you remember more
                    effectively.
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col border-blue-100 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <Trophy className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle className="text-blue-700">Track Progress</CardTitle>
                  <CardDescription className="text-slate-600">
                    Monitor your improvement with detailed statistics and performance metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-slate-700">
                    See how your memory skills improve over time with our comprehensive tracking system.
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col border-pink-100 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-pink-500 mb-2" />
                  <CardTitle className="text-pink-700">Personalized Training</CardTitle>
                  <CardDescription className="text-slate-600">
                    Get customized game recommendations based on your performance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-slate-700">
                    Our adaptive system adjusts difficulty levels to match your current abilities and help you improve
                    faster.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0 bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-slate-600 md:text-left">
            © 2025 ColorBoost. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-slate-600 hover:text-purple-600 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-slate-600 hover:text-purple-600 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-slate-600 hover:text-purple-600 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

