"use client"

import { useState, useEffect } from "react"
import mermaid from "mermaid"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, Download, Loader2, Copy, Zap, Info, GitBranch, ArrowRight, Diamond } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { saveAs } from "file-saver"
import { GradientText } from "@/components/ui/gradient-text"

// Default flowchart diagram
const DEFAULT_DIAGRAM = `flowchart TD
  A["🚀 Start Your Journey"] --> B{"🤔 Choose Your Path"}
  B -->|💡 Create| C["✨ Build Something Amazing"]
  B -->|🎯 Learn| D["📚 Explore New Ideas"]
  C --> E["🎉 Success!"]
  D --> E
  E --> F["🔄 Keep Growing"]
  style A fill:#c7d2fe,stroke:#6366f1,stroke-width:2px
  style B fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
  style C fill:#d1fae5,stroke:#10b981,stroke-width:2px
  style D fill:#d1fae5,stroke:#10b981,stroke-width:2px
  style E fill:#ddd6fe,stroke:#8b5cf6,stroke-width:2px
  style F fill:#ddd6fe,stroke:#8b5cf6,stroke-width:2px`

export default function FlowchartGenerator() {
  const [prompt, setPrompt] = useState("")
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_DIAGRAM)
  const [isGenerating, setIsGenerating] = useState(false)
  const [renderedSvg, setRenderedSvg] = useState("")
  const [error, setError] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
      flowchart: {
        curve: "basis",
        useMaxWidth: true,
      },
    })
    renderDiagram(mermaidCode)
  }, [])

  const renderDiagram = async (code: string) => {
    if (!code.trim()) {
      setRenderedSvg("")
      setError("")
      setShowDiagram(false)
      return
    }

    try {
      setError("")
      setIsAnimating(true)
      setShowDiagram(false)

      // Add a delay for the animation effect
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const { svg } = await mermaid.render("diagram", code)
      setRenderedSvg(svg)

      // Trigger the diagram appearance animation
      setTimeout(() => {
        setIsAnimating(false)
        setShowDiagram(true)
      }, 500)
    } catch (err) {
      console.error("Mermaid rendering error:", err)
      setError(err instanceof Error ? err.message : "Failed to render diagram. Please check the Mermaid code syntax.")
      setRenderedSvg("")
      setIsAnimating(false)
      setShowDiagram(false)
      toast({
        title: "Render Error",
        description: "Invalid Mermaid code. Please ensure the syntax is correct (e.g., use 'flowchart', not 'graph', and proper node syntax like ID[Label]).",
        variant: "destructive",
      })
    }
  }

  const generateDiagram = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of the diagram you want to create",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/flowchart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate diagram")
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setMermaidCode(data.diagram)
      await renderDiagram(data.diagram)
      toast({
        title: "Diagram generated",
        description: "Your diagram has been generated successfully using Groq Llama 3.3",
      })
    } catch (error) {
      console.error("Error generating diagram:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate diagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCodeChange = (newCode: string) => {
    setMermaidCode(newCode)
    renderDiagram(newCode)
  }

  const exportPng = () => {
    if (!renderedSvg) {
      toast({
        title: "No diagram to export",
        description: "Please generate or create a valid diagram first",
        variant: "destructive",
      })
      return
    }

    try {
      // Create SVG blob and parse dimensions
      const svgBlob = new Blob([renderedSvg], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)

      // Create a temporary container to measure SVG dimensions
      const tempDiv = document.createElement("div")
      tempDiv.style.position = "absolute"
      tempDiv.style.visibility = "hidden"
      tempDiv.innerHTML = renderedSvg
      document.body.appendChild(tempDiv)

      const svgElement = tempDiv.querySelector("svg")
      const width = svgElement?.getAttribute("width") || "800"
      const height = svgElement?.getAttribute("height") || "600"
      document.body.removeChild(tempDiv)

      // Create an image element
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        try {
          // Create canvas with SVG dimensions
          const canvas = document.createElement("canvas")
          canvas.width = parseInt(width)
          canvas.height = parseInt(height)
          const ctx = canvas.getContext("2d")
          
          if (!ctx) {
            throw new Error("Failed to get canvas context")
          }

          // Draw SVG image on canvas
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Convert to PNG and download
          canvas.toBlob((blob) => {
            if (blob) {
              const filename = `flowchart-${Date.now()}.png`
              saveAs(blob, filename)
              toast({
                title: "Export successful",
                description: `Saved as ${filename}`,
              })
            }
            URL.revokeObjectURL(url)
          }, "image/png")
        } catch (error) {
          console.error("Error during PNG conversion:", error)
          toast({
            title: "Export failed",
            description: "Failed to export PNG. Please try again.",
            variant: "destructive",
          })
          URL.revokeObjectURL(url)
        }
      }

      img.onerror = () => {
        console.error("Failed to load SVG image")
        toast({
          title: "Export failed",
          description: "Failed to load diagram for export. Please try again.",
          variant: "destructive",
        })
        URL.revokeObjectURL(url)
      }

      img.src = url
    } catch (error) {
      console.error("Error preparing PNG export:", error)
      toast({
        title: "Export failed",
        description: "An error occurred while preparing the export. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(mermaidCode)
    toast({
      title: "Code copied",
      description: "Mermaid code copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-300 backdrop-blur-xl bg-gray-50/80 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-center text-black">
                <GradientText className="text-black">GX Flowchart Generator</GradientText>
                <span className="text-blue-500"> (Beta)</span>
              </h1>
              <p className="text-sm text-black">Powered by GurukulX-1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportPng}
              variant="outline"
              className="bg-gray-50/80 border-gray-300 text-black hover:bg-gray-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* AI Prompt Section */}
            <div className="bg-gray-50/80 backdrop-blur-xl border border-gray-300 rounded-xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                AI Prompt
              </h2>
              <div className="space-y-4">
                <Input
                  placeholder="Describe your flowchart (e.g., user registration process, software development workflow...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-50/80 border-gray-300 text-black placeholder-gray-400 focus:border-blue-400"
                />
                <Button
                  onClick={generateDiagram}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating with GurukulX...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Flowchart
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Code Editor Section */}
            <div className="bg-gray-50/80 backdrop-blur-xl border border-gray-300 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                  Mermaid Code
                </h2>
                <Button
                  onClick={copyCode}
                  variant="outline"
                  size="sm"
                  className="bg-gray-50/80 border-gray-300 text-black hover:bg-gray-100"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={mermaidCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Enter your Mermaid code here..."
                className="min-h-[400px] font-mono text-sm bg-gray-50/80 border-gray-300 text-black placeholder-gray-400 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-gray-50/80 backdrop-blur-xl border border-gray-300 rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
              Flowchart Preview
            </h2>
            <div className="bg-gray-50/90 border border-gray-300 rounded-lg p-6 min-h-[600px] flex items-center justify-center relative overflow-hidden">
              {/* Futuristic Loading Animation */}
              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="w-32 h-32 border-4 border-transparent border-t-blue-400 border-r-indigo-400 rounded-full animate-spin"></div>
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-4 w-24 h-24 border-2 border-transparent border-t-blue-400 border-l-indigo-400 rounded-full animate-spin animate-reverse"></div>
                    {/* Center glowing dot */}
                    <div className="absolute inset-1/2 w-4 h-4 -ml-2 -mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                    {/* Scanning lines */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rotate-90">
                      <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse delay-300"></div>
                    </div>
                    {/* Floating particles */}
                    <div className="absolute -inset-8">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                          style={{
                            left: `${20 + i * 10}%`,
                            top: `${30 + i * 5}%`,
                            animationDelay: `${i * 200}ms`,
                            animationDuration: "2s",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  {/* Loading text */}
                  <div className="absolute bottom-20 text-center">
                    <div className="text-blue-400 font-mono text-sm mb-2 animate-pulse">Rendering Flowchart...</div>
                    <div className="flex space-x-1 justify-center">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 200}ms` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isAnimating && (
                <div className="text-center animate-fadeIn">
                  <div className="text-red-400 mb-2">⚠️ Render Error</div>
                  <pre className="text-red-500 text-sm bg-red-50/20 p-4 rounded border border-red-300 max-w-md">
                    {error}
                  </pre>
                </div>
              )}

              {/* Rendered Diagram with Staggered Animation */}
              {renderedSvg && showDiagram && !error && (
                <div className="w-full h-full flex items-center justify-center overflow-auto animate-slideInUp">
                  <div className="diagram-container" dangerouslySetInnerHTML={{ __html: renderedSvg }} />
                </div>
              )}

              {/* Empty State */}
              {!renderedSvg && !error && !isAnimating && (
                <div className="text-gray-600 text-center animate-fadeIn">
                  <div className="text-4xl mb-4 animate-bounce">📊</div>
                  <p className="text-black">Your flowchart will appear here</p>
                  <div className="mt-4 text-xs text-black">Generate or edit code to see the magic happen</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50/80 backdrop-blur-xl border border-gray-300 rounded-xl p-6 shadow-2xl mb-6">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-black mr-3" />
            <h2 className="text-xl font-semibold text-black">About Flowcharts</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-black leading-relaxed">
                Flowcharts are visual representations of processes, workflows, or algorithms. They use standardized symbols to show the sequence of steps, decision points, and flow of control, making complex processes easy to understand and communicate.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                  <GitBranch className="h-8 w-8 text-black mb-2" />
                  <h3 className="font-semibold text-black mb-1">Process Steps</h3>
                  <p className="text-sm text-black">Sequential actions or operations</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                  <Diamond className="h-8 w-8 text-black mb-2" />
                  <h3 className="font-semibold text-black mb-1">Decision Points</h3>
                  <p className="text-sm text-black">Conditional branches and choices</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                  <ArrowRight className="h-8 w-8 text-black mb-2" />
                  <h3 className="font-semibold text-black mb-1">Flow Direction</h3>
                  <p className="text-sm text-black">Sequence and connections</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <h3 className="font-semibold text-black mb-3">Common Use Cases:</h3>
              <ul className="space-y-2 text-black">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Business process mapping
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Software development workflows
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Algorithm visualization
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Decision trees
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  User journey mapping
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Quality control processes
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-gray-50/80 backdrop-blur-xl border border-gray-300 rounded-xl p-6 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-black mb-2">
              <GradientText>⚡ Ultra-Fast AI-Powered Flowchart Generation</GradientText>
            </h3>
            <p className="text-black mb-4">
              Create professional flowcharts instantly using GurukulX's model. Simply describe your process, and watch as AI generates beautiful Mermaid diagrams with enhanced styling.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center text-black">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                GurukulX-1.0
              </div>
              <div className="flex items-center text-black">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                Real-time Preview
              </div>
              <div className="flex items-center text-black">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                PNG Export
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 1s ease-out;
        }
        .animate-reverse {
          animation-direction: reverse;
        }
        /* Staggered animation for flowchart elements */
        .diagram-container svg g[id*="flowchart"] {
          animation: slideInUp 0.6s ease-out;
        }
        .diagram-container svg g[id*="flowchart"]:nth-child(1) {
          animation-delay: 0.1s;
        }
        .diagram-container svg g[id*="flowchart"]:nth-child(2) {
          animation-delay: 0.2s;
        }
        .diagram-container svg g[id*="flowchart"]:nth-child(3) {
          animation-delay: 0.3s;
        }
        .diagram-container svg g[id*="flowchart"]:nth-child(4) {
          animation-delay: 0.4s;
        }
        /* Glowing effect for flowchart elements */
        .diagram-container svg rect,
        .diagram-container svg polygon,
        .diagram-container svg circle {
          filter: drop-shadow(0 0 6px rgba(79, 70, 229, 0.3));
        }
        .diagram-container svg path[stroke] {
          filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));
        }
      `}</style>
    </div>
  )
}