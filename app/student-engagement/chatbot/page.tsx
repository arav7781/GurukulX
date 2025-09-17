"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Bot, Brain, Sparkles, Lightbulb, Zap, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function QuestionPaperGenerator() {
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState("mathematics")
  const [thinkingMode, setThinkingMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerate = async () => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      toast({
        title: "Empty input",
        description: "Please enter a valid query for question paper generation.",
        variant: "destructive",
      })
      return
    }

    if (!subject) {
      toast({
        title: "No subject selected",
        description: "Please select an academic subject.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you'd make an API call here
      // For now, we'll simulate a delay and redirect
      setTimeout(() => {
        // Store the query parameters in localStorage to pass to the editor page
        localStorage.setItem("paperQuery", trimmedQuery)
        localStorage.setItem("paperSubject", subject)
        localStorage.setItem("paperThinkingMode", thinkingMode.toString())

        // Redirect to the editor page
        router.push("/student-engagement/chatbot/editor")
      }, 1000)
    } catch (error) {
      console.error("Error generating question paper:", error)
      toast({
        title: "Error",
        description: `Failed to generate question paper: ${(error as Error).message}`,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const sampleQueries = [
    {
      text: "Generate a question paper for Calculus with 10 questions",
      subject: "mathematics",
    },
    {
      text: "Create a set of exam questions for Organic Chemistry",
      subject: "chemistry",
    },
    {
      text: "Design a question paper for Modern Indian History",
      subject: "history",
    },
    {
      text: "Prepare a question paper for Quantum Mechanics",
      subject: "physics",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 103, 31, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 103, 31, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 103, 31, 0); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-border {
          animation: pulse 2s infinite;
        }
        .tricolor-gradient {
          background: linear-gradient(135deg, #ff671f 0%, #ffffff 35%, #ffffff 65%, #046a38 100%);
        }
        .saffron-gradient {
          background: linear-gradient(135deg, #ff671f, #ff9933);
        }
        .green-gradient {
          background: linear-gradient(135deg, #046a38, #138808);
        }
        .tricolor-border {
          position: relative;
          border-radius: 0.75rem;
          padding: 2px;
          background: linear-gradient(90deg, #ff671f 0%, #ffffff 35%, #ffffff 65%, #046a38 100%);
        }
        .glass-card {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(4, 106, 56, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .chakra-wheel {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 2px solid #000080;
          border-radius: 50%;
          top: 20px;
          right: 20px;
          opacity: 0.1;
        }
        .chakra-wheel::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          background: #000080;
          border-radius: 50%;
        }
        .chakra-spoke {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 38px;
          height: 1px;
          background: #000080;
          transform-origin: 0 0;
        }
        .chakra-spoke:nth-child(1) { transform: translate(-50%, -50%) rotate(0deg); }
        .chakra-spoke:nth-child(2) { transform: translate(-50%, -50%) rotate(15deg); }
        .chakra-spoke:nth-child(3) { transform: translate(-50%, -50%) rotate(30deg); }
        .chakra-spoke:nth-child(4) { transform: translate(-50%, -50%) rotate(45deg); }
        .chakra-spoke:nth-child(5) { transform: translate(-50%, -50%) rotate(60deg); }
        .chakra-spoke:nth-child(6) { transform: translate(-50%, -50%) rotate(75deg); }
        .chakra-spoke:nth-child(7) { transform: translate(-50%, -50%) rotate(90deg); }
        .chakra-spoke:nth-child(8) { transform: translate(-50%, -50%) rotate(105deg); }
        .chakra-spoke:nth-child(9) { transform: translate(-50%, -50%) rotate(120deg); }
        .chakra-spoke:nth-child(10) { transform: translate(-50%, -50%) rotate(135deg); }
        .chakra-spoke:nth-child(11) { transform: translate(-50%, -50%) rotate(150deg); }
        .chakra-spoke:nth-child(12) { transform: translate(-50%, -50%) rotate(165deg); }
        .gradient-text {
          background: linear-gradient(135deg, #ff671f, #046a38);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Indian Flag inspired decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Saffron decorative element */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[30%] bg-gradient-to-r from-orange-500/20 to-orange-400/10 rounded-full blur-[100px]" />
        {/* Green decorative element */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[30%] bg-gradient-to-r from-green-600/20 to-green-500/10 rounded-full blur-[100px]" />
        {/* White central area enhancement */}
        <div className="absolute top-[30%] left-[25%] w-[50%] h-[40%] bg-white/30 rounded-full blur-[80px]" />
        
        {/* Subtle Ashoka Chakra in background */}
        <div className="chakra-wheel">
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
          <div className="chakra-spoke"></div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Question Paper Generator</span> 
            <span className="text-gray-700 ml-2">(Beta)</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Create and edit professional question papers with advanced mathematical notations and AI assistance
            <span className="text-gray-600"> - some editor features are under testing</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <div className="tricolor-border">
            <Card className="glass-card border-0">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50 rounded-t-xl">
                <CardTitle className="text-gray-800 flex items-center text-xl">
                  <Sparkles className="mr-2 h-6 w-6 text-orange-600" />
                  Generate Question Paper
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your requirements to generate a comprehensive question paper.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="text-black">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Subject</label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className=" text-black w-full bg-white border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-black">
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="computer_science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Query</label>
                  <Input
                    placeholder="Type your question paper requirements..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="bg-white border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-gray-800 placeholder:text-gray-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-700">AI Thinking Mode</p>
                    <p className="text-xs text-gray-500">Show AI reasoning process (Coming Soon)</p>
                  </div>
                  <Button
                    disabled
                    variant="outline"
                    size="sm"
                    className="cursor-not-allowed opacity-50 border-gray-300 text-gray-500"
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    Soon
                  </Button>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !query.trim()}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Generating Question Paper...
                    </>
                  ) : (
                    <>
                      <Bot className="h-5 w-5 mr-2" />
                      Generate Question Paper
                    </>
                  )}
                </Button>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-green-50 to-orange-50 rounded-b-xl p-6">
                <div className="w-full">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-orange-600" />
                    Sample Queries
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {sampleQueries.map((sample, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-4 border-2 border-gray-200 bg-white text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-green-50 hover:border-orange-300 hover:text-gray-800 transition-all duration-200 group"
                        onClick={() => {
                          setQuery(sample.text)
                          setSubject(sample.subject)
                        }}
                      >
                        <div className="flex items-start w-full">
                          <Zap className="h-4 w-4 mr-3 text-green-600 mt-0.5 group-hover:text-orange-600 transition-colors" />
                          <span className="text-sm leading-relaxed">{sample.text}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 flex items-center justify-center text-lg">
            <ArrowRight className="h-5 w-5 mr-2 text-orange-600" />
            After generation, you'll be taken to the advanced editor page
          </p>
        </motion.div>
      </div>
    </div>
  )
}