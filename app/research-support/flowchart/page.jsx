"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Sparkles, Download, Loader2, Copy, Zap, Info, GitBranch, ArrowRight, Diamond,
  Square, Circle, Play, Pause, Trash2, Plus, Settings, Move, MousePointer,
  Undo, Redo, ZoomIn, ZoomOut, RotateCcw, Save, Upload, Eye, EyeOff, 
  Palette, Type, Link, Unlink, MoreHorizontal, ChevronDown
} from "lucide-react"

// Shape types with proper configurations
const SHAPE_TYPES = [
  { 
    type: 'rectangle', 
    icon: Square, 
    name: 'Process', 
    color: '#dbeafe', 
    borderColor: '#3b82f6',
    textColor: '#1e40af',
    mermaidShape: (text) => `["${text}"]`
  },
  { 
    type: 'diamond', 
    icon: Diamond, 
    name: 'Decision', 
    color: '#fef3c7', 
    borderColor: '#f59e0b',
    textColor: '#d97706',
    mermaidShape: (text) => `{"${text}"}`
  },
  { 
    type: 'ellipse', 
    icon: Circle, 
    name: 'Start/End', 
    color: '#e0e7ff', 
    borderColor: '#8b5cf6',
    textColor: '#7c3aed',
    mermaidShape: (text) => `(["${text}"])`
  },
  { 
    type: 'parallelogram', 
    icon: GitBranch, 
    name: 'Input/Output', 
    color: '#fed7e2', 
    borderColor: '#ec4899',
    textColor: '#db2777',
    mermaidShape: (text) => `[/"${text}"/]`
  },
  { 
    type: 'hexagon', 
    icon: MoreHorizontal, 
    name: 'Preparation', 
    color: '#d1fae5', 
    borderColor: '#10b981',
    textColor: '#047857',
    mermaidShape: (text) => `{{"${text}"}}`
  }
]

// Default flowchart elements
const DEFAULT_ELEMENTS = [
  { 
    id: 'start_1', 
    type: 'ellipse', 
    x: 300, 
    y: 50, 
    width: 140, 
    height: 70, 
    text: '🚀 Start Process', 
    color: '#e0e7ff', 
    borderColor: '#8b5cf6',
    textColor: '#7c3aed'
  },
  { 
    id: 'decision_1', 
    type: 'diamond', 
    x: 280, 
    y: 180, 
    width: 180, 
    height: 90, 
    text: '🤔 Valid Input?', 
    color: '#fef3c7', 
    borderColor: '#f59e0b',
    textColor: '#d97706'
  },
  { 
    id: 'process_1', 
    type: 'rectangle', 
    x: 150, 
    y: 330, 
    width: 150, 
    height: 70, 
    text: '✅ Process Data', 
    color: '#dbeafe', 
    borderColor: '#3b82f6',
    textColor: '#1e40af'
  },
  { 
    id: 'process_2', 
    type: 'rectangle', 
    x: 450, 
    y: 330, 
    width: 150, 
    height: 70, 
    text: '❌ Show Error', 
    color: '#fee2e2', 
    borderColor: '#ef4444',
    textColor: '#dc2626'
  },
  { 
    id: 'end_1', 
    type: 'ellipse', 
    x: 300, 
    y: 480, 
    width: 140, 
    height: 70, 
    text: '🎯 End Process', 
    color: '#e0e7ff', 
    borderColor: '#8b5cf6',
    textColor: '#7c3aed'
  }
]

const DEFAULT_CONNECTIONS = [
  { id: 'conn_1', from: 'start_1', to: 'decision_1', label: '', points: [] },
  { id: 'conn_2', from: 'decision_1', to: 'process_1', label: 'Yes', points: [] },
  { id: 'conn_3', from: 'decision_1', to: 'process_2', label: 'No', points: [] },
  { id: 'conn_4', from: 'process_1', to: 'end_1', label: '', points: [] },
  { id: 'conn_5', from: 'process_2', to: 'end_1', label: '', points: [] }
]

// Color palette for styling
const COLOR_PALETTE = [
  { name: 'Blue', color: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  { name: 'Green', color: '#d1fae5', border: '#10b981', text: '#047857' },
  { name: 'Yellow', color: '#fef3c7', border: '#f59e0b', text: '#d97706' },
  { name: 'Purple', color: '#e0e7ff', border: '#8b5cf6', text: '#7c3aed' },
  { name: 'Pink', color: '#fed7e2', border: '#ec4899', text: '#db2777' },
  { name: 'Red', color: '#fee2e2', border: '#ef4444', text: '#dc2626' },
  { name: 'Gray', color: '#f3f4f6', border: '#6b7280', text: '#374151' }
]

// Toast notification system
const showToast = (message, type = 'info', duration = 3000) => {
  const toastContainer = document.getElementById('toast-container') || (() => {
    const container = document.createElement('div')
    container.id = 'toast-container'
    container.className = 'fixed top-4 right-4 z-50 space-y-2'
    document.body.appendChild(container)
    return container
  })()

  const toast = document.createElement('div')
  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
  toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0`
  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">×</button>
    </div>
  `
  
  toastContainer.appendChild(toast)
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full', 'opacity-0')
  }, 100)
  
  // Auto remove
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('translate-x-full', 'opacity-0')
      setTimeout(() => toast.remove(), 300)
    }
  }, duration)
}

// Simple GradientText component
const GradientText = ({ children }) => (
  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
    {children}
  </span>
)

export default function FlowchartGenerator() {
  // Core state
  const [elements, setElements] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [selectedConnection, setSelectedConnection] = useState(null)
  
  // Interaction state
  const [isDragging, setIsDragging] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingFrom, setConnectingFrom] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [tool, setTool] = useState('select') // select, connect, pan
  
  // View state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [showCode, setShowCode] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [mermaidCode, setMermaidCode] = useState('')
  
  // History state
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  // AI generation state
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Refs
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Initialize with proper default elements
  useEffect(() => {
    if (elements.length === 0) {
      console.log('Initializing default elements')
      setElements([...DEFAULT_ELEMENTS])
      setConnections([...DEFAULT_CONNECTIONS])
    }
  }, [])

  // Generate Mermaid code from elements and connections
  const generateMermaidCode = useCallback(() => {
    let code = 'flowchart TD\n'
    
    // Add elements with proper shapes
    elements.forEach(element => {
      const shapeType = SHAPE_TYPES.find(s => s.type === element.type)
      const shape = shapeType ? shapeType.mermaidShape(element.text) : `["${element.text}"]`
      code += `    ${element.id}${shape}\n`
    })
    
    code += '\n'
    
    // Add connections
    connections.forEach(connection => {
      const label = connection.label ? `|"${connection.label}"|` : ''
      code += `    ${connection.from} -->${label} ${connection.to}\n`
    })
    
    code += '\n'
    
    // Add styles
    elements.forEach(element => {
      code += `    style ${element.id} fill:${element.color},stroke:${element.borderColor},stroke-width:2px,color:${element.textColor}\n`
    })
    
    return code
  }, [elements, connections])

  // Update mermaid code when elements or connections change
  useEffect(() => {
    setMermaidCode(generateMermaidCode())
  }, [generateMermaidCode])

  // Initialize history properly
  useEffect(() => {
    if (elements.length > 0 && history.length === 0) {
      const initialState = { elements: [...elements], connections: [...connections] }
      setHistory([initialState])
      setHistoryIndex(0)
    }
  }, [elements, connections, history.length])

  // Debug log to check elements
  useEffect(() => {
    console.log('Current elements:', elements)
    console.log('Current connections:', connections)
  }, [elements, connections])

  // Save state to history
  const saveToHistory = useCallback(() => {
    const newState = { elements: [...elements], connections: [...connections] }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    
    // Limit history size
    if (newHistory.length > 50) {
      newHistory.shift()
    } else {
      setHistoryIndex(prev => prev + 1)
    }
    
    setHistory(newHistory)
  }, [elements, connections, history, historyIndex])

  // Undo functionality
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setElements([...prevState.elements])
      setConnections([...prevState.connections])
      setHistoryIndex(historyIndex - 1)
      setSelectedElement(null)
      setSelectedConnection(null)
    }
  }

  // Redo functionality
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setElements([...nextState.elements])
      setConnections([...nextState.connections])
      setHistoryIndex(historyIndex + 1)
      setSelectedElement(null)
      setSelectedConnection(null)
    }
  }

  // Utility functions
  const getElementCenter = (element) => ({
    x: element.x + element.width / 2,
    y: element.y + element.height / 2
  })

  const isPointInElement = (point, element) => {
    if (element.type === 'diamond') {
      // Diamond hit detection
      const centerX = element.x + element.width / 2
      const centerY = element.y + element.height / 2
      const dx = Math.abs(point.x - centerX) / (element.width / 2)
      const dy = Math.abs(point.y - centerY) / (element.height / 2)
      return dx + dy <= 1
    } else if (element.type === 'ellipse') {
      // Ellipse hit detection
      const centerX = element.x + element.width / 2
      const centerY = element.y + element.height / 2
      const dx = (point.x - centerX) / (element.width / 2)
      const dy = (point.y - centerY) / (element.height / 2)
      return dx * dx + dy * dy <= 1
    } else {
      // Rectangle hit detection
      return point.x >= element.x && 
             point.x <= element.x + element.width && 
             point.y >= element.y && 
             point.y <= element.y + element.height
    }
  }

  // Mouse event handlers
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom
    
    const clickedElement = elements.find(el => isPointInElement({ x, y }, el))
    
    if (tool === 'select') {
      if (clickedElement) {
        setSelectedElement(clickedElement)
        setSelectedConnection(null)
        setIsDragging(true)
        setDragOffset({
          x: x - clickedElement.x,
          y: y - clickedElement.y
        })
      } else {
        setSelectedElement(null)
        setSelectedConnection(null)
      }
    } else if (tool === 'connect') {
      if (clickedElement) {
        if (!connectingFrom) {
          setConnectingFrom(clickedElement)
          setIsConnecting(true)
          showToast(`Connecting from "${clickedElement.text}". Click another element to connect.`, 'info')
        } else if (clickedElement.id !== connectingFrom.id) {
          // Check if connection already exists
          const existingConnection = connections.find(conn => 
            (conn.from === connectingFrom.id && conn.to === clickedElement.id) ||
            (conn.from === clickedElement.id && conn.to === connectingFrom.id)
          )
          
          if (!existingConnection) {
            const newConnection = {
              id: `conn_${Date.now()}`,
              from: connectingFrom.id,
              to: clickedElement.id,
              label: '',
              points: []
            }
            setConnections(prev => [...prev, newConnection])
            showToast(`Connected "${connectingFrom.text}" to "${clickedElement.text}"`, 'success')
            saveToHistory()
          } else {
            showToast('Connection already exists!', 'error')
          }
          
          setConnectingFrom(null)
          setIsConnecting(false)
        }
      } else {
        setConnectingFrom(null)
        setIsConnecting(false)
      }
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && selectedElement && tool === 'select') {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / zoom
      const y = (e.clientY - rect.top - pan.y) / zoom
      
      const newX = Math.max(0, Math.min(1200 - selectedElement.width, x - dragOffset.x))
      const newY = Math.max(0, Math.min(800 - selectedElement.height, y - dragOffset.y))
      
      setElements(prev => prev.map(el => 
        el.id === selectedElement.id 
          ? { ...el, x: newX, y: newY }
          : el
      ))
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      saveToHistory()
    }
  }

  // Add new element with better positioning and validation
  const addElement = (type) => {
    const shapeConfig = SHAPE_TYPES.find(s => s.type === type)
    if (!shapeConfig) {
      console.error('Invalid shape type:', type)
      return
    }
    
    // Calculate a good position for new elements
    const existingPositions = elements?.map(el => ({ x: el.x, y: el.y })) || []
    let newX = 100
    let newY = 100
    
    // Find a free spot
    let attempts = 0
    while (attempts < 20 && existingPositions.some(pos => 
      Math.abs(pos.x - newX) < 120 && Math.abs(pos.y - newY) < 90
    )) {
      newX += 160
      if (newX > 600) {
        newX = 100
        newY += 120
      }
      attempts++
    }
    
    const newElement = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      x: newX,
      y: newY,
      width: type === 'diamond' ? 160 : type === 'hexagon' ? 140 : 130,
      height: type === 'diamond' ? 90 : type === 'ellipse' ? 70 : 60,
      text: `New ${shapeConfig.name}`,
      color: shapeConfig.color,
      borderColor: shapeConfig.borderColor,
      textColor: shapeConfig.textColor
    }
    
    console.log('Adding new element:', newElement)
    
    setElements(prevElements => {
      const newElements = [...(prevElements || []), newElement]
      console.log('Updated elements array:', newElements)
      return newElements
    })
    
    setSelectedElement(newElement)
    showToast(`Added ${shapeConfig.name} element`, 'success')
    
    // Save to history after state update
    setTimeout(() => {
      saveToHistory()
    }, 100)
  }

  const deleteSelected = () => {
    if (selectedElement) {
      setElements(prev => prev.filter(el => el.id !== selectedElement.id))
      setConnections(prev => prev.filter(conn => 
        conn.from !== selectedElement.id && conn.to !== selectedElement.id
      ))
      setSelectedElement(null)
      saveToHistory()
      showToast('Element deleted', 'success')
    } else if (selectedConnection) {
      setConnections(prev => prev.filter(conn => conn.id !== selectedConnection.id))
      setSelectedConnection(null)
      saveToHistory()
      showToast('Connection deleted', 'success')
    }
  }

  const updateElementText = (elementId, text) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, text } : el
    ))
  }

  const updateElementDimensions = (elementId, width, height) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, width: parseInt(width), height: parseInt(height) } : el
    ))
  }

  const updateElementColor = (elementId, colorConfig) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { 
        ...el, 
        color: colorConfig.color,
        borderColor: colorConfig.border,
        textColor: colorConfig.text
      } : el
    ))
  }

  // AI Generation with real API
  const generateFromPrompt = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a description of your flowchart", 'error')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/flowchart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          format: 'visual_elements' // Request structured data for visual editor
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate flowchart`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Handle both mermaid code and structured elements
      if (data.elements && data.connections) {
        // Direct structured data
        setElements(data.elements)
        setConnections(data.connections)
      } else if (data.diagram) {
        // Parse mermaid code to create elements (simplified parser)
        const parsedElements = parseMermaidToElements(data.diagram)
        if (parsedElements.elements.length > 0) {
          setElements(parsedElements.elements)
          setConnections(parsedElements.connections)
        }
      }
      
      setSelectedElement(null)
      setSelectedConnection(null)
      saveToHistory()
      showToast("AI flowchart generated successfully!", 'success', 4000)
      
    } catch (error) {
      console.error("Generation error:", error)
      showToast(
        error.message || "Failed to generate flowchart. Please check your connection and try again.", 
        'error', 
        5000
      )
    } finally {
      setIsGenerating(false)
    }
  }

  // Simple Mermaid parser for AI-generated code
  const parseMermaidToElements = (mermaidCode) => {
    const elements = []
    const connections = []
    const lines = mermaidCode.split('\n').filter(line => line.trim())
    
    let yPosition = 50
    const positions = new Map()
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      // Parse element definitions
      const elementMatch = trimmed.match(/^\s*(\w+)\s*(\[.*?\]|\{.*?\}|\(.*?\)|\[\/".*?"\/\])/)
      if (elementMatch) {
        const [, id, shapeText] = elementMatch
        let type = 'rectangle'
        let text = shapeText.replace(/[\[\]{}()/"]/g, '').trim()
        
        if (shapeText.includes('{')) type = 'diamond'
        else if (shapeText.includes('(')) type = 'ellipse'
        else if (shapeText.includes('/')) type = 'parallelogram'
        
        const shapeConfig = SHAPE_TYPES.find(s => s.type === type) || SHAPE_TYPES[0]
        const xPosition = 150 + (index % 3) * 200
        
        elements.push({
          id,
          type,
          x: xPosition,
          y: yPosition + Math.floor(index / 3) * 150,
          width: type === 'diamond' ? 160 : 130,
          height: type === 'diamond' ? 90 : 60,
          text: text || `${shapeConfig.name} ${elements.length + 1}`,
          color: shapeConfig.color,
          borderColor: shapeConfig.borderColor,
          textColor: shapeConfig.textColor
        })
        
        positions.set(id, elements[elements.length - 1])
      }
      
      // Parse connections
      const connectionMatch = trimmed.match(/^\s*(\w+)\s*-->\s*(?:\|"?([^|"]*)"?\|)?\s*(\w+)/)
      if (connectionMatch) {
        const [, from, label, to] = connectionMatch
        connections.push({
          id: `conn_${connections.length + 1}`,
          from,
          to,
          label: label || '',
          points: []
        })
      }
    })
    
    return { elements, connections }
  }

  // Export functionality
  const exportPng = () => {
    if (elements.length === 0) {
      showToast("No elements to export. Create a flowchart first.", 'error')
      return
    }

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Calculate canvas size
      const padding = 50
      const maxX = Math.max(...elements.map(el => el.x + el.width), 800)
      const maxY = Math.max(...elements.map(el => el.y + el.height), 600)
      
      canvas.width = maxX + padding
      canvas.height = maxY + padding
      
      // Fill background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid if enabled
      if (showGrid) {
        ctx.strokeStyle = '#f1f5f9'
        ctx.lineWidth = 0.5
        for (let x = 0; x <= canvas.width; x += 20) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y <= canvas.height; y += 20) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }
      
      // Draw connections
      connections.forEach(connection => {
        const fromEl = elements.find(el => el.id === connection.from)
        const toEl = elements.find(el => el.id === connection.to)
        
        if (fromEl && toEl) {
          const fromCenter = getElementCenter(fromEl)
          const toCenter = getElementCenter(toEl)
          
          // Draw line
          ctx.strokeStyle = '#64748b'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(fromCenter.x, fromCenter.y)
          ctx.lineTo(toCenter.x, toCenter.y)
          ctx.stroke()
          
          // Draw arrowhead
          const angle = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x)
          const arrowLength = 12
          const arrowAngle = Math.PI / 6
          
          ctx.beginPath()
          ctx.moveTo(toCenter.x, toCenter.y)
          ctx.lineTo(
            toCenter.x - arrowLength * Math.cos(angle - arrowAngle),
            toCenter.y - arrowLength * Math.sin(angle - arrowAngle)
          )
          ctx.lineTo(
            toCenter.x - arrowLength * Math.cos(angle + arrowAngle),
            toCenter.y - arrowLength * Math.sin(angle + arrowAngle)
          )
          ctx.closePath()
          ctx.fillStyle = '#64748b'
          ctx.fill()
          
          // Draw label
          if (connection.label) {
            const midX = (fromCenter.x + toCenter.x) / 2
            const midY = (fromCenter.y + toCenter.y) / 2
            ctx.fillStyle = '#374151'
            ctx.font = 'bold 12px Inter, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            
            // Background for label
            const labelWidth = ctx.measureText(connection.label).width + 8
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(midX - labelWidth/2, midY - 8, labelWidth, 16)
            ctx.strokeStyle = '#e5e7eb'
            ctx.strokeRect(midX - labelWidth/2, midY - 8, labelWidth, 16)
            
            ctx.fillStyle = '#374151'
            ctx.fillText(connection.label, midX, midY)
          }
        }
      })
      
      // Draw elements
      elements.forEach(element => {
        ctx.fillStyle = element.color
        ctx.strokeStyle = element.borderColor
        ctx.lineWidth = 2
        
        // Draw shape
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
        } else if (element.type === 'hexagon') {
          const centerX = element.x + element.width / 2
          const centerY = element.y + element.height / 2
          const radius = Math.min(element.width, element.height) / 2
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }
        
        // Draw text
        ctx.fillStyle = element.textColor
        ctx.font = 'bold 14px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Handle multi-line text
        const words = element.text.split(' ')
        const lines = []
        let currentLine = words[0]
        
        for (let i = 1; i < words.length; i++) {
          const word = words[i]
          const width = ctx.measureText(currentLine + " " + word).width
          if (width < element.width - 20) {
            currentLine += " " + word
          } else {
            lines.push(currentLine)
            currentLine = word
          }
        }
        lines.push(currentLine)
        
        const lineHeight = 16
        const startY = element.y + element.height / 2 - ((lines.length - 1) * lineHeight) / 2
        
        lines.forEach((line, index) => {
          ctx.fillText(
            line,
            element.x + element.width / 2,
            startY + (index * lineHeight)
          )
        })
      })
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `flowchart-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          showToast('Flowchart exported successfully!', 'success')
        }
      }, 'image/png', 1.0)
      
    } catch (error) {
      console.error('Export error:', error)
      showToast('Failed to export PNG. Please try again.', 'error')
    }
  }

  // Copy mermaid code
  const copyCode = () => {
    navigator.clipboard.writeText(mermaidCode).then(() => {
      showToast("Mermaid code copied to clipboard!", 'success')
    }).catch(() => {
      showToast("Failed to copy code. Please select and copy manually.", 'error')
    })
  }

  // Clear canvas
  const clearCanvas = () => {
    if (elements.length === 0) {
      showToast("Canvas is already empty", 'info')
      return
    }
    
    if (confirm('Are you sure you want to clear the entire canvas? This action cannot be undone.')) {
      setElements([])
      setConnections([])
      setSelectedElement(null)
      setSelectedConnection(null)
      saveToHistory()
      showToast('Canvas cleared', 'success')
    }
  }

  // Zoom controls
  const zoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.2))
  }

  const resetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault()
          deleteSelected()
          break
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
          }
          break
        case 'y':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            redo()
          }
          break
        case '1':
          setTool('select')
          break
        case '2':
          setTool('connect')
          break
        case '3':
          setTool('pan')
          break
        case 'Escape':
          setSelectedElement(null)
          setSelectedConnection(null)
          setConnectingFrom(null)
          setIsConnecting(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedElement, selectedConnection])

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
                <GradientText>Professional Flowchart Editor</GradientText>
              </h1>
              <p className="text-sm text-gray-600">AI-powered visual flowchart creation</p>
            </div>
          </div>
          
          {/* Main Toolbar */}
          <div className="flex items-center gap-3">
            {/* Tool Selection */}
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <Button
                onClick={() => setTool('select')}
                variant={tool === 'select' ? 'default' : 'ghost'}
                size="sm"
                title="Select Tool (1)"
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setTool('connect')}
                variant={tool === 'connect' ? 'default' : 'ghost'}
                size="sm"
                title="Connect Tool (2)"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setTool('pan')}
                variant={tool === 'pan' ? 'default' : 'ghost'}
                size="sm"
                title="Pan Tool (3)"
              >
                <Move className="h-4 w-4" />
              </Button>
            </div>
            
            {/* History Controls */}
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <Button 
                onClick={undo} 
                variant="ghost" 
                size="sm" 
                disabled={historyIndex <= 0}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button 
                onClick={redo} 
                variant="ghost" 
                size="sm" 
                disabled={historyIndex >= history.length - 1}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Zoom Controls */}
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <Button onClick={zoomOut} variant="ghost" size="sm" title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button onClick={resetZoom} variant="ghost" size="sm" title="Reset Zoom">
                <span className="text-xs font-mono">{Math.round(zoom * 100)}%</span>
              </Button>
              <Button onClick={zoomIn} variant="ghost" size="sm" title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            {/* View Controls */}
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant={showGrid ? 'default' : 'ghost'}
                size="sm"
                title="Toggle Grid"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setShowCode(!showCode)}
                variant={showCode ? 'default' : 'ghost'}
                size="sm"
                title="Toggle Code Panel"
              >
                {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Export */}
            <Button onClick={exportPng} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto h-[calc(100vh-80px)]">
        {/* Left Sidebar - Tools & Properties */}
        <div className="w-80 bg-white border-r border-gray-300 p-4 overflow-y-auto">
          {/* AI Generation Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
              AI Generator
            </h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Describe your flowchart process... (e.g., 'user login process with validation', 'order processing workflow', etc.)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-20 text-sm resize-none"
              />
              <Button
                onClick={generateFromPrompt}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
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

          {/* Shape Tools */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Plus className="h-4 w-4 mr-2 text-green-500" />
              Add Elements
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SHAPE_TYPES.map((shape) => (
                <Button
                  key={shape.type}
                  onClick={() => addElement(shape.type)}
                  variant="outline"
                  size="sm"
                  className="flex flex-col p-3 h-auto hover:bg-gray-50 transition-colors"
                >
                  <shape.icon className="h-5 w-5 mb-1" style={{ color: shape.borderColor }} />
                  <span className="text-xs">{shape.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Element Properties */}
          {selectedElement && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-orange-500" />
                Properties
              </h3>
              <div className="space-y-4">
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium mb-1">Element Text</label>
                  <Input
                    value={selectedElement.text}
                    onChange={(e) => updateElementText(selectedElement.id, e.target.value)}
                    className="text-sm"
                    placeholder="Enter element text..."
                  />
                </div>
                
                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Width</label>
                    <Input
                      type="number"
                      min="80"
                      max="300"
                      value={selectedElement.width}
                      onChange={(e) => updateElementDimensions(selectedElement.id, e.target.value, selectedElement.height)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height</label>
                    <Input
                      type="number"
                      min="40"
                      max="200"
                      value={selectedElement.height}
                      onChange={(e) => updateElementDimensions(selectedElement.id, selectedElement.width, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium mb-2">Colors</label>
                  <div className="grid grid-cols-4 gap-1">
                    {COLOR_PALETTE.map((color, index) => (
                      <Button
                        key={index}
                        onClick={() => updateElementColor(selectedElement.id, color)}
                        className="w-8 h-8 p-0 rounded border-2"
                        style={{ 
                          backgroundColor: color.color,
                          borderColor: selectedElement.color === color.color ? color.border : 'transparent'
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="pt-2 border-t">
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
            </div>
          )}

          {/* Connection Properties */}
          {selectedConnection && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Link className="h-4 w-4 mr-2 text-purple-500" />
                Connection
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <Input
                    value={selectedConnection.label}
                    onChange={(e) => {
                      setConnections(prev => prev.map(conn => 
                        conn.id === selectedConnection.id 
                          ? { ...conn, label: e.target.value }
                          : conn
                      ))
                    }}
                    className="text-sm"
                    placeholder="Connection label..."
                  />
                </div>
                <Button
                  onClick={deleteSelected}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Delete Connection
                </Button>
              </div>
            </div>
          )}

          {/* Canvas Actions */}
          <div className="space-y-2">
            <Button onClick={clearCanvas} variant="outline" size="sm" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Canvas
            </Button>
            
            {/* Help Section */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Quick Help
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p><kbd className="bg-blue-100 px-1 rounded">1</kbd> Select tool</p>
                <p><kbd className="bg-blue-100 px-1 rounded">2</kbd> Connect tool</p>
                <p><kbd className="bg-blue-100 px-1 rounded">3</kbd> Pan tool</p>
                <p><kbd className="bg-blue-100 px-1 rounded">Del</kbd> Delete selected</p>
                <p><kbd className="bg-blue-100 px-1 rounded">Ctrl+Z</kbd> Undo</p>
                <p><kbd className="bg-blue-100 px-1 rounded">Esc</kbd> Deselect all</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-gray-50">
          <div 
            ref={canvasRef}
            className="w-full h-full relative overflow-hidden select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ 
              cursor: tool === 'select' ? 'default' : tool === 'connect' ? 'crosshair' : 'grab',
              minHeight: '600px',
              position: 'relative'
            }}
          >
            {/* Fixed Canvas Container */}
            <div 
              className="absolute inset-0"
              style={{ 
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: '0 0',
                width: '2000px',
                height: '1500px'
              }}
            >
              {/* Grid Background */}
              {showGrid && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                    </pattern>
                    <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <rect width="100%" height="100%" fill="url(#grid-major)" />
                </svg>
              )}
              
              {/* Connections SVG Layer with better rendering */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5, pointerEvents: 'none' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="8" 
                   refX="9" refY="4" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 10 4, 0 8" fill="#64748b" />
                  </marker>
                  <marker id="arrowhead-selected" markerWidth="10" markerHeight="8" 
                   refX="9" refY="4" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 10 4, 0 8" fill="#3b82f6" />
                  </marker>
                </defs>
                
                {connections && connections.length > 0 && connections.map(connection => {
                  const fromEl = elements?.find(el => el?.id === connection?.from)
                  const toEl = elements?.find(el => el?.id === connection?.to)
                  
                  if (!fromEl || !toEl || !connection?.id) return null
                  
                  const fromCenter = getElementCenter(fromEl)
                  const toCenter = getElementCenter(toEl)
                  const isSelected = selectedConnection?.id === connection.id
                  
                  return (
                    <g key={connection.id}>
                      {/* Connection line */}
                      <line
                        x1={fromCenter.x}
                        y1={fromCenter.y}
                        x2={toCenter.x}
                        y2={toCenter.y}
                        stroke={isSelected ? '#3b82f6' : '#64748b'}
                        strokeWidth={isSelected ? '3' : '2'}
                        markerEnd={isSelected ? "url(#arrowhead-selected)" : "url(#arrowhead)"}
                        className="cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedConnection(connection)
                          setSelectedElement(null)
                        }}
                      />
                      
                      {/* Connection label */}
                      {connection.label && (
                        <g>
                          <rect
                            x={(fromCenter.x + toCenter.x) / 2 - (connection.label.length * 4)}
                            y={(fromCenter.y + toCenter.y) / 2 - 10}
                            width={connection.label.length * 8}
                            height={20}
                            fill="white"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            rx="4"
                          />
                          <text
                            x={(fromCenter.x + toCenter.x) / 2}
                            y={(fromCenter.y + toCenter.y) / 2 + 3}
                            textAnchor="middle"
                            className="fill-gray-700 font-medium"
                            style={{ fontSize: '12px', pointerEvents: 'none' }}
                          >
                            {connection.label}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Elements with better text rendering */}
              {elements && elements.length > 0 && elements.map((element, index) => {
                if (!element || !element.id) return null
                
                return (
                  <div
                    key={element.id}
                    className={`absolute border-2 cursor-pointer flex items-center justify-center font-medium select-none transition-all duration-200 ${
                      selectedElement?.id === element.id 
                        ? 'ring-2 ring-blue-500 ring-offset-1 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                      backgroundColor: element.color || '#f3f4f6',
                      borderColor: element.borderColor || '#6b7280',
                      color: element.textColor || '#374151',
                      borderRadius: element.type === 'rectangle' ? '8px' : element.type === 'ellipse' ? '50%' : '4px',
                      clipPath: element.type === 'diamond' 
                        ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                        : element.type === 'hexagon'
                        ? 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
                        : 'none',
                      zIndex: selectedElement?.id === element.id ? 15 : 10,
                      padding: '4px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      wordWrap: 'break-word',
                      fontSize: '13px',
                      lineHeight: '1.3',
                      fontWeight: '600'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (tool === 'select') {
                        console.log('Selected element:', element.id)
                        setSelectedElement(element)
                        setSelectedConnection(null)
                      }
                    }}
                  >
                    <div 
                      style={{ 
                        maxWidth: `${element.width - 16}px`,
                        maxHeight: `${element.height - 16}px`,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: element.text && element.text.length > 15 ? 'normal' : 'nowrap',
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                        padding: '2px'
                      }}
                    >
                      {element.text || 'New Element'}
                    </div>
                  </div>
                )
              })}

              {/* Connection Preview */}
              {isConnecting && connectingFrom && (
                <div
                  className="absolute w-4 h-4 bg-blue-500 rounded-full animate-pulse border-2 border-white shadow-lg"
                  style={{
                    left: getElementCenter(connectingFrom).x - 8,
                    top: getElementCenter(connectingFrom).y - 8,
                    zIndex: 25
                  }}
                />
              )}
            </div>

            {/* Debug info - Enhanced */}
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg text-xs z-50 border">
              <div className="font-semibold text-gray-800 mb-2">Canvas Debug</div>
              <div className="space-y-1 text-gray-600">
                <div>Elements: <span className="font-bold text-blue-600">{elements?.length || 0}</span></div>
                <div>Connections: <span className="font-bold text-green-600">{connections?.length || 0}</span></div>
                <div>Zoom: <span className="font-bold">{Math.round(zoom * 100)}%</span></div>
                <div>Tool: <span className="font-bold capitalize">{tool}</span></div>
                <div>Selected: <span className="font-bold text-purple-600">{selectedElement?.id || 'none'}</span></div>
                {elements?.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="font-medium">Elements List:</div>
                    {elements.map((el, i) => (
                      <div key={el.id} className="text-xs">
                        {i+1}. {el.id} ({el.x}, {el.y})
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick reset button */}
              <button 
                onClick={() => {
                  console.log('Resetting to default elements')
                  setElements([...DEFAULT_ELEMENTS])
                  setConnections([...DEFAULT_CONNECTIONS])
                  setSelectedElement(null)
                  setSelectedConnection(null)
                }}
                className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Reset Default
              </button>
            </div>
          </div>

          {/* Canvas Status Bar */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-lg">
            <div className="flex items-center space-x-4 text-gray-600">
              <span>Elements: <strong>{elements.length}</strong></span>
              <span>Connections: <strong>{connections.length}</strong></span>
              <span>Tool: <strong className="capitalize">{tool}</strong></span>
              <span>Zoom: <strong>{Math.round(zoom * 100)}%</strong></span>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Code Panel */}
        {showCode && (
          <div className="w-96 bg-white border-l border-gray-300 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Copy className="h-4 w-4 mr-2 text-indigo-500" />
                  Mermaid Code
                </h3>
                <Button onClick={copyCode} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <Textarea
                value={mermaidCode}
                readOnly
                className="min-h-full font-mono text-xs bg-gray-50 border border-gray-200 resize-none"
                placeholder="Generated Mermaid code will appear here..."
              />
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Mermaid Syntax</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><code className="bg-gray-200 px-1 rounded">[]</code> Rectangle (Process)</p>
                <p><code className="bg-gray-200 px-1 rounded">{'{}'}</code> Diamond (Decision)</p>
                <p><code className="bg-gray-200 px-1 rounded">([])</code> Ellipse (Start/End)</p>
                <p><code className="bg-gray-200 px-1 rounded">[//]</code> Parallelogram (I/O)</p>
                <p><code className="bg-gray-200 px-1 rounded">--{">"}</code> Arrow connection</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Generating Flowchart</h3>
              <p className="text-gray-600 text-sm">AI is creating your flowchart...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}