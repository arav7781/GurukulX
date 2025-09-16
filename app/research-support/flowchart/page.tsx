import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, Download, Loader2, Copy, Zap, Info, GitBranch, ArrowRight, Diamond } from "lucide-react"

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

const GradientText = ({ children }) => (
  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
    {children}
  </span>
)

const showToast = (title, description, variant = "default") => {
  console.log(`Toast: ${title} - ${description}`)
  // Simple alert fallback since we don't have toast component
  if (variant === "destructive") {
    alert(`Error: ${title}\n${description}`)
  } else {
    alert(`${title}\n${description}`)
  }
}

export default function FlowchartGenerator() {
  const [prompt, setPrompt] = useState("")
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_DIAGRAM)
  const [isGenerating, setIsGenerating] = useState(false)
  const [renderedSvg, setRenderedSvg] = useState("")
  const [error, setError] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)

  useEffect(() => {
    // Initialize with default diagram
    renderDiagram(mermaidCode)
  }, [])

  const renderDiagram = async (code) => {
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

      // Simple mermaid rendering simulation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a simple SVG representation for demo
      const svgContent = `
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>
              .node { fill: #c7d2fe; stroke: #6366f1; stroke-width: 2px; }
              .decision { fill: #fef3c7; stroke: #f59e0b; stroke-width: 2px; }
              .process { fill: #d1fae5; stroke: #10b981; stroke-width: 2px; }
              .end { fill: #ddd6fe; stroke: #8b5cf6; stroke-width: 2px; }
              .text { font-family: Arial, sans-serif; font-size: 12px; text-anchor: middle; }
            </style>
          </defs>
          
          <!-- Start node -->
          <rect x="250" y="20" width="100" height="40" rx="5" class="node"/>
          <text x="300" y="43" class="text">🚀 Start</text>
          
          <!-- Decision diamond -->
          <polygon points="300,100 350,125 300,150 250,125" class="decision"/>
          <text x="300" y="130" class="text">🤔 Choose</text>
          
          <!-- Process nodes -->
          <rect x="150" y="180" width="100" height="40" rx="5" class="process"/>
          <text x="200" y="203" class="text">✨ Create</text>
          
          <rect x="350" y="180" width="100" height="40" rx="5" class="process"/>
          <text x="400" y="203" class="text">📚 Learn</text>
          
          <!-- End node -->
          <rect x="250" y="260" width="100" height="40" rx="5" class="end"/>
          <text x="300" y="283" class="text">🎉 Success!</text>
          
          <!-- Arrows -->
          <line x1="300" y1="60" x2="300" y2="100" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
          <line x1="275" y1="140" x2="225" y2="170" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
          <line x1="325" y1="140" x2="375" y2="170" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
          <line x1="200" y1="220" x2="275" y2="255" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
          <line x1="400" y1="220" x2="325" y2="255" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
          
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
            </marker>
          </defs>
        </svg>
      `
      
      setRenderedSvg(svgContent)

      setTimeout(() => {
        setIsAnimating(false)
        setShowDiagram(true)
      }, 500)
    } catch (err) {
      console.error("Rendering error:", err)
      setError(err instanceof Error ? err.message : "Failed to render diagram")
      setRenderedSvg("")
      setIsAnimating(false)
      setShowDiagram(false)
      showToast("Render Error", "Invalid diagram code. Please check the syntax.", "destructive")
    }
  }

  const generateDiagram = async () => {
    if (!prompt.trim()) {
      showToast("Empty prompt", "Please enter a description of the diagram you want to create", "destructive")
      return
    }

    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a more complex diagram based on prompt
      const generatedCode = `flowchart TD
  A["📝 ${prompt}"] --> B{"Process Step?"}
  B -->|Yes| C["Execute Task"]
  B -->|No| D["Skip Step"]
  C --> E["Review Results"]
  D --> E
  E --> F["Complete"]
  style A fill:#c7d2fe,stroke:#6366f1,stroke-width:2px
  style B fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
  style C fill:#d1fae5,stroke:#10b981,stroke-width:2px
  style D fill:#fecaca,stroke:#ef4444,stroke-width:2px
  style E fill:#ddd6fe,stroke:#8b5cf6,stroke-width:2px
  style F fill:#dcfce7,stroke:#16a34a,stroke-width:2px`

      setMermaidCode(generatedCode)
      await renderDiagram(generatedCode)
      showToast("Diagram generated", "Your diagram has been generated successfully using GurukulX-1.0")
    } catch (error) {
      console.error("Error generating diagram:", error)
      showToast("Generation failed", "Failed to generate diagram. Please try again.", "destructive")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCodeChange = (newCode) => {
    setMermaidCode(newCode)
    renderDiagram(newCode)
  }

  const exportPng = async () => {
    if (!renderedSvg) {
      showToast("No diagram to export", "Please generate or create a valid diagram first", "destructive")
      return
    }

    try {
      // Create a canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas size
      canvas.width = 800
      canvas.height = 600
      
      // Fill with white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Create an image from SVG
      const img = new Image()
      const svgBlob = new Blob([renderedSvg], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Draw the SVG image on canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            
            // Convert canvas to blob
            canvas.toBlob((blob) => {
              if (blob) {
                // Create download link
                const downloadUrl = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = downloadUrl
                link.download = `flowchart-${Date.now()}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                
                // Clean up
                URL.revokeObjectURL(url)
                URL.revokeObjectURL(downloadUrl)
                
                showToast("Export successful", `Flowchart exported as PNG`)
                resolve()
              } else {
                reject(new Error('Failed to create blob'))
              }
            }, 'image/png', 1.0)
          } catch (error) {
            reject(error)
          }
        }
        
        img.onerror = () => {
          reject(new Error('Failed to load SVG image'))
        }
        
        img.src = url
      })
    } catch (error) {
      console.error("Export error:", error)
      showToast("Export failed", "Failed to export PNG. Please try again.", "destructive")
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(mermaidCode)
      showToast("Code copied", "Mermaid code copied to clipboard")
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = mermaidCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showToast("Code copied", "Mermaid code copied to clipboard")
    }
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
              <h1 className="text-3xl font-bold text-center">
                <GradientText>GX Flowchart Generator</GradientText>
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