"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Sparkles, Download, Loader2, Copy, Zap, Info, GitBranch, ArrowRight, Diamond,
  Square, Circle, Play, Pause, Trash2, Plus, Settings, Move, MousePointer,
  Undo, Redo, ZoomIn, ZoomOut, RotateCcw, Save, Upload
} from "lucide-react"

// Default flowchart elements
const DEFAULT_ELEMENTS = [
  { id: 'start', type: 'ellipse', x: 100, y: 50, width: 120, height: 60, text: '🚀 Start', color: '#c7d2fe', borderColor: '#6366f1' },
  { id: 'decision', type: 'diamond', x: 100, y: 150, width: 140, height: 80, text: '🤔 Decision?', color: '#fef3c7', borderColor: '#f59e0b' },
  { id: 'process1', type: 'rectangle', x: 50, y: 270, width: 120, height: 60, text: '✨ Process A', color: '#d1fae5', borderColor: '#10b981' },
  { id: 'process2', type: 'rectangle', x: 200, y: 270, width: 120, height: 60, text: '📚 Process B', color: '#d1fae5', borderColor: '#10b981' },
  { id: 'end', type: 'ellipse', x: 125, y: 370, width: 120, height: 60, text: '🎉 End', color: '#ddd6fe', borderColor: '#8b5cf6' }
]

const DEFAULT_CONNECTIONS = [
  { id: 'conn1', from: 'start', to: 'decision', label: '' },
  { id: 'conn2', from: 'decision', to: 'process1', label: 'Yes' },
  { id: 'conn3', from: 'decision', to: 'process2', label: 'No' },
  { id: 'conn4', from: 'process1', to: 'end', label: '' },
  { id: 'conn5', from: 'process2', to: 'end', label: '' }
]

// Shape types
const SHAPE_TYPES = [
  { type: 'rectangle', icon: Square, name: 'Process', color: '#d1fae5', borderColor: '#10b981' },
  { type: 'diamond', icon: Diamond, name: 'Decision', color: '#fef3c7', borderColor: '#f59e0b' },
  { type: 'ellipse', icon: Circle, name: 'Start/End', color: '#c7d2fe', borderColor: '#6366f1' },
  { type: 'parallelogram', icon: GitBranch, name: 'Input/Output', color: '#fed7e2', borderColor: '#f56565' }
]

// Simple toast function
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast)
    }
  }, 3000)
}

// Simple GradientText component
const GradientText = ({ children }) => (
  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
    {children}
  </span>
)

export default function FlowchartGenerator() {
  const [elements, setElements] = useState(DEFAULT_ELEMENTS)
  const [connections, setConnections] = useState(DEFAULT_CONNECTIONS)
  const [selectedElement, setSelectedElement] = useState(null)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingFrom, setConnectingFrom] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [tool, setTool] = useState('select') // select, pan, connect
  const [mermaidCode, setMermaidCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Generate Mermaid code from elements and connections
  const generateMermaidCode = useCallback(() => {
    let code = 'flowchart TD\n'
    
    // Add elements
    elements.forEach(element => {
      let shape = ''
      switch (element.type) {
        case 'rectangle':
          shape = `["${element.text}"]`
          break
        case 'diamond':
          shape = `{"${element.text}"}`
          break
        case 'ellipse':
          shape = `(["${element.text}"])`
          break
        case 'parallelogram':
          shape = `[/"${element.text}"/]`
          break
        default:
          shape = `["${element.text}"]`
      }
      code += `    ${element.id}${shape}\n`
    })
    
    // Add connections
    connections.forEach(connection => {
      const label = connection.label ? `|${connection.label}|` : ''
      code += `    ${connection.from} -->${label} ${connection.to}\n`
    })
    
    // Add styles
    elements.forEach(element => {
      code += `    style ${element.id} fill:${element.color},stroke:${element.borderColor},stroke-width:2px\n`
    })
    
    return code
  }, [elements, connections])

  // Update mermaid code when elements or connections change
  useEffect(() => {
    setMermaidCode(generateMermaidCode())
  }, [generateMermaidCode])

  // Save state to history
  const saveToHistory = useCallback(() => {
    const newState = { elements: [...elements], connections: [...connections] }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [elements, connections, history, historyIndex])

  // Undo functionality
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setElements(prevState.elements)
      setConnections(prevState.connections)
      setHistoryIndex(historyIndex - 1)
    }
  }

  // Redo functionality
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setElements(nextState.elements)
      setConnections(nextState.connections)
      setHistoryIndex(historyIndex + 1)
    }
  }

  // Get element center point
  const getElementCenter = (element) => ({
    x: element.x + element.width / 2,
    y: element.y + element.height / 2
  })

  // Check if point is inside element
  const isPointInElement = (point, element) => {
    return point.x >= element.x && 
           point.x <= element.x + element.width && 
           point.y >= element.y && 
           point.y <= element.y + element.height
  }

  // Handle mouse down on canvas
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom
    
    const clickedElement = elements.find(el => isPointInElement({ x, y }, el))
    
    if (tool === 'select') {
      if (clickedElement) {
        setSelectedElement(clickedElement)
        setIsDragging(true)
        setDragOffset({
          x: x - clickedElement.x,
          y: y - clickedElement.y
        })
      } else {
        setSelectedElement(null)
      }
    } else if (tool === 'connect') {
      if (clickedElement) {
        if (!connectingFrom) {
          setConnectingFrom(clickedElement)
          setIsConnecting(true)
        } else if (clickedElement.id !== connectingFrom.id) {
          // Create connection
          const newConnection = {
            id: `conn_${Date.now()}`,
            from: connectingFrom.id,
            to: clickedElement.id,
            label: ''
          }
          setConnections(prev => [...prev, newConnection])
          setConnectingFrom(null)
          setIsConnecting(false)
          saveToHistory()
        }
      }
    }
  }

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (isDragging && selectedElement && tool === 'select') {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / zoom
      const y = (e.clientY - rect.top - pan.y) / zoom
      
      const newX = Math.max(0, x - dragOffset.x)
      const newY = Math.max(0, y - dragOffset.y)
      
      setElements(prev => prev.map(el => 
        el.id === selectedElement.id 
          ? { ...el, x: newX, y: newY }
          : el
      ))
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      saveToHistory()
    }
  }

  // Add new element
  const addElement = (type) => {
    const shapeType = SHAPE_TYPES.find(s => s.type === type)
    const newElement = {
      id: `element_${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'diamond' ? 140 : 120,
      height: type === 'diamond' ? 80 : 60,
      text: `New ${shapeType.name}`,
      color: shapeType.color,
      borderColor: shapeType.borderColor
    }
    setElements(prev => [...prev, newElement])
    setSelectedElement(newElement)
    saveToHistory()
  }

  // Delete selected element
  const deleteSelected = () => {
    if (selectedElement) {
      setElements(prev => prev.filter(el => el.id !== selectedElement.id))
      setConnections(prev => prev.filter(conn => 
        conn.from !== selectedElement.id && conn.to !== selectedElement.id
      ))
      setSelectedElement(null)
      saveToHistory()
    } else if (selectedConnection) {
      setConnections(prev => prev.filter(conn => conn.id !== selectedConnection.id))
      setSelectedConnection(null)
      saveToHistory()
    }
  }

  // Update element text
  const updateElementText = (elementId, text) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, text } : el
    ))
    saveToHistory()
  }

  // Export as PNG
  const exportPng = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Calculate canvas size based on elements
    const maxX = Math.max(...elements.map(el => el.x + el.width)) + 50
    const maxY = Math.max(...elements.map(el => el.y + el.height)) + 50
    
    canvas.width = maxX
    canvas.height = maxY
    
    // Fill white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw connections first (so they appear behind elements)
    connections.forEach(connection => {
      const fromEl = elements.find(el => el.id === connection.from)
      const toEl = elements.find(el => el.id === connection.to)
      
      if (fromEl && toEl) {
        const fromCenter = getElementCenter(fromEl)
        const toCenter = getElementCenter(toEl)
        
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(fromCenter.x, fromCenter.y)
        ctx.lineTo(toCenter.x, toCenter.y)
        ctx.stroke()
        
        // Draw arrow
        const angle = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x)
        const arrowLength = 10
        ctx.beginPath()
        ctx.moveTo(toCenter.x, toCenter.y)
        ctx.lineTo(
          toCenter.x - arrowLength * Math.cos(angle - Math.PI / 6),
          toCenter.y - arrowLength * Math.sin(angle - Math.PI / 6)
        )
        ctx.moveTo(toCenter.x, toCenter.y)
        ctx.lineTo(
          toCenter.x - arrowLength * Math.cos(angle + Math.PI / 6),
          toCenter.y - arrowLength * Math.sin(angle + Math.PI / 6)
        )
        ctx.stroke()
        
        // Draw label
        if (connection.label) {
          const midX = (fromCenter.x + toCenter.x) / 2
          const midY = (fromCenter.y + toCenter.y) / 2
          ctx.fillStyle = '#000'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(connection.label, midX, midY - 5)
        }
      }
    })
    
    // Draw elements
    elements.forEach(element => {
      ctx.fillStyle = element.color
      ctx.strokeStyle = element.borderColor
      ctx.lineWidth = 2
      
      if (element.type === 'rectangle' || element.type === 'parallelogram') {
        ctx.fillRect(element.x, element.y, element.width, element.height)
        ctx.strokeRect(element.x, element.y, element.width, element.height)
      } else if (element.type === 'ellipse') {
        ctx.beginPath()
        ctx.ellipse(
          element.x + element.width / 2,
          element.y + element.height / 2,
          element.width / 2,
          element.height / 2,
          0, 0, 2 * Math.PI
        )
        ctx.fill()
        ctx.stroke()
      } else if (element.type === 'diamond') {
        const centerX = element.x + element.width / 2
        const centerY = element.y + element.height / 2
        ctx.beginPath()
        ctx.moveTo(centerX, element.y)
        ctx.lineTo(element.x + element.width, centerY)
        ctx.lineTo(centerX, element.y + element.height)
        ctx.lineTo(element.x, centerY)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
      
      // Draw text
      ctx.fillStyle = '#000'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        element.text,
        element.x + element.width / 2,
        element.y + element.height / 2 + 5
      )
    })
    
    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `flowchart-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showToast('Flowchart exported as PNG!')
    })
  }

  // Copy mermaid code
  const copyCode = () => {
    navigator.clipboard.writeText(mermaidCode).then(() => {
      showToast("Mermaid code copied to clipboard")
    }).catch(() => {
      showToast("Failed to copy code", 'error')
    })
  }

  // Clear canvas
  const clearCanvas = () => {
    setElements([])
    setConnections([])
    setSelectedElement(null)
    setSelectedConnection(null)
    saveToHistory()
  }

  // Generate from AI prompt
  const generateFromPrompt = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a description", 'error')
      return
    }

    setIsGenerating(true)
    try {
      // This is a demo implementation - replace with your actual AI API
      showToast("AI generation is a demo feature. Please implement your API endpoint.", 'error')
      
      // Example of how to structure the API call:
      // const response = await fetch("/api/generate-flowchart", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt }),
      // })
      // const data = await response.json()
      // setElements(data.elements)
      // setConnections(data.connections)
      
    } catch (error) {
      showToast("Failed to generate flowchart", 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-300 backdrop-blur-xl bg-gray-50/80 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <GradientText>Visual Flowchart Editor</GradientText>
              </h1>
              <p className="text-sm text-gray-600">Drag, drop, and connect elements</p>
            </div>
          </div>
          
          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <Button
                onClick={() => setTool('select')}
                variant={tool === 'select' ? 'default' : 'ghost'}
                size="sm"
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setTool('connect')}
                variant={tool === 'connect' ? 'default' : 'ghost'}
                size="sm"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setTool('pan')}
                variant={tool === 'pan' ? 'default' : 'ghost'}
                size="sm"
              >
                <Move className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <Button onClick={undo} variant="ghost" size="sm" disabled={historyIndex <= 0}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button onClick={redo} variant="ghost" size="sm" disabled={historyIndex >= history.length - 1}>
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={exportPng} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
            
            <Button onClick={() => setShowCode(!showCode)} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              {showCode ? 'Hide' : 'Show'} Code
            </Button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-white border-r border-gray-300 p-4 h-screen overflow-y-auto">
          {/* AI Generation */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">AI Generator</h3>
            <Input
              placeholder="Describe your flowchart..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mb-2"
            />
            <Button
              onClick={generateFromPrompt}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {/* Shape Tools */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Add Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              {SHAPE_TYPES.map((shape) => (
                <Button
                  key={shape.type}
                  onClick={() => addElement(shape.type)}
                  variant="outline"
                  size="sm"
                  className="flex flex-col p-3 h-auto"
                >
                  <shape.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{shape.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Element Properties */}
          {selectedElement && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Properties</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Text</label>
                  <Input
                    value={selectedElement.text}
                    onChange={(e) => updateElementText(selectedElement.id, e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Width</label>
                    <Input
                      type="number"
                      value={selectedElement.width}
                      onChange={(e) => {
                        const width = parseInt(e.target.value)
                        setElements(prev => prev.map(el => 
                          el.id === selectedElement.id ? { ...el, width } : el
                        ))
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height</label>
                    <Input
                      type="number"
                      value={selectedElement.height}
                      onChange={(e) => {
                        const height = parseInt(e.target.value)
                        setElements(prev => prev.map(el => 
                          el.id === selectedElement.id ? { ...el, height } : el
                        ))
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
                <Button
                  onClick={deleteSelected}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Element
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={clearCanvas} variant="outline" size="sm" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Canvas
            </Button>
            <div className="text-xs text-gray-500 mt-4">
              <p><strong>Select Tool:</strong> Click and drag elements</p>
              <p><strong>Connect Tool:</strong> Click elements to connect</p>
              <p><strong>Pan Tool:</strong> Drag to pan the canvas</p>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <div 
            ref={canvasRef}
            className="w-full h-screen bg-gray-50 relative overflow-hidden cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {/* Grid pattern */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Connections */}
              {connections.map(connection => {
                const fromEl = elements.find(el => el.id === connection.from)
                const toEl = elements.find(el => el.id === connection.to)
                
                if (!fromEl || !toEl) return null
                
                const fromCenter = getElementCenter(fromEl)
                const toCenter = getElementCenter(toEl)
                
                return (
                  <g key={connection.id}>
                    <line
                      x1={fromCenter.x}
                      y1={fromCenter.y}
                      x2={toCenter.x}
                      y2={toCenter.y}
                      stroke="#374151"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    {connection.label && (
                      <text
                        x={(fromCenter.x + toCenter.x) / 2}
                        y={(fromCenter.y + toCenter.y) / 2 - 10}
                        textAnchor="middle"
                        className="fill-gray-700 text-sm"
                      >
                        {connection.label}
                      </text>
                    )}
                  </g>
                )
              })}
              
              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                 refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                </marker>
              </defs>
            </svg>

            {/* Elements */}
            {elements.map(element => (
              <div
                key={element.id}
                className={`absolute border-2 rounded cursor-pointer flex items-center justify-center text-sm font-medium select-none ${
                  selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  backgroundColor: element.color,
                  borderColor: element.borderColor,
                  clipPath: element.type === 'diamond' 
                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                    : element.type === 'ellipse'
                    ? 'ellipse(50% 50%)'
                    : 'none',
                  zIndex: 10
                }}
              >
                {element.text}
              </div>
            ))}

            {/* Connection preview */}
            {isConnecting && connectingFrom && (
              <div
                className="absolute w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{
                  left: getElementCenter(connectingFrom).x - 4,
                  top: getElementCenter(connectingFrom).y - 4,
                  zIndex: 20
                }}
              />
            )}
          </div>

          {/* Status bar */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-lg">
            <span className="text-gray-600">
              Elements: {elements.length} | Connections: {connections.length} | Tool: {tool}
            </span>
          </div>
        </div>

        {/* Right Sidebar - Code View */}
        {showCode && (
          <div className="w-80 bg-white border-l border-gray-300 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Mermaid Code</h3>
              <Button onClick={copyCode} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              value={mermaidCode}
              onChange={(e) => setMermaidCode(e.target.value)}
              className="min-h-96 font-mono text-xs"
              readOnly
            />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Usage Instructions:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Select Tool:</strong> Click to select, drag to move elements</li>
                <li>• <strong>Connect Tool:</strong> Click two elements to connect them</li>
                <li>• <strong>Add Elements:</strong> Use the left sidebar buttons</li>
                <li>• <strong>Edit Text:</strong> Select element and use properties panel</li>
                <li>• <strong>Delete:</strong> Select element/connection and press Delete</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg border border-gray-300 px-3 py-2 text-xs shadow-lg">
        <div className="text-gray-600">
          <kbd className="px-1 py-0.5 bg-gray-100 rounded">Del</kbd> Delete | 
          <kbd className="px-1 py-0.5 bg-gray-100 rounded ml-1">Ctrl+Z</kbd> Undo | 
          <kbd className="px-1 py-0.5 bg-gray-100 rounded ml-1">Ctrl+Y</kbd> Redo
        </div>
      </div>

      {/* Keyboard event handlers */}
      <div
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault()
            deleteSelected()
          } else if (e.ctrlKey && e.key === 'z') {
            e.preventDefault()
            undo()
          } else if (e.ctrlKey && e.key === 'y') {
            e.preventDefault()
            redo()
          }
        }}
        className="fixed inset-0 pointer-events-none"
      />

      <style jsx>{`
        .cursor-crosshair {
          cursor: ${tool === 'select' ? 'default' : tool === 'connect' ? 'crosshair' : 'grab'};
        }
        
        .cursor-crosshair:active {
          cursor: ${tool === 'pan' ? 'grabbing' : 'default'};
        }
      `}</style>
    </div>
  )
}