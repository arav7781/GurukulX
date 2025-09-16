"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Loader2,
  FileText,
  Download,
  ArrowLeft,
  Brain,
  ImageIcon,
  Type,
  Palette,
  Bold,
  Italic,
  Underline,
  X,
  RotateCcw,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Calculator,
  ActivityIcon as Function,
  Copy,
  Keyboard,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

const QuestionPaperEditor = () => {
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState("")
  const [thinkingMode, setThinkingMode] = useState(true)
  const [showThinking, setShowThinking] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [thinking, setThinking] = useState<string[]>([])
  const [response, setResponse] = useState<string[]>([])
  const [markdownContent, setMarkdownContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [isThinkingComplete, setIsThinkingComplete] = useState(false)
  const [isResponseComplete, setIsResponseComplete] = useState(false)
  const [showTypingIndicator, setShowTypingIndicator] = useState(false)

  // Enhanced styling states
  const [selectedFont, setSelectedFont] = useState("serif")
  const [fontSize, setFontSize] = useState([16])
  const [textColor, setTextColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [showMathPanel, setShowMathPanel] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [draggedImage, setDraggedImage] = useState<string | null>(null)
  const [resizingImage, setResizingImage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const thinkingRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const contentSet = useRef(false)
  const { toast } = useToast()

  const fontOptions = [
    { value: "serif", label: "Times New Roman", fontFamily: "'Times New Roman', serif", className: "font-serif" },
    { value: "sans", label: "Arial", fontFamily: "Arial, sans-serif", className: "font-sans" },
    { value: "mono", label: "Courier New", fontFamily: "'Courier New', monospace", className: "font-mono" },
    {
      value: "playfair",
      label: "Playfair Display",
      fontFamily: "'Playfair Display', serif",
      className: "font-playfair",
    },
    { value: "inter", label: "Inter", fontFamily: "'Inter', sans-serif", className: "font-inter" },
    { value: "roboto", label: "Roboto", fontFamily: "'Roboto', sans-serif", className: "font-roboto" },
    { value: "crimson", label: "Crimson Text", fontFamily: "'Crimson Text', serif", className: "font-crimson" },
    { value: "lora", label: "Lora", fontFamily: "'Lora', serif", className: "font-lora" },
  ]

  const mathSymbols = [
    { symbol: "∑", latex: "\\sum", name: "Sum" },
    { symbol: "∫", latex: "\\int", name: "Integral" },
    { symbol: "∂", latex: "\\partial", name: "Partial" },
    { symbol: "∞", latex: "\\infty", name: "Infinity" },
    { symbol: "π", latex: "\\pi", name: "Pi" },
    { symbol: "α", latex: "\\alpha", name: "Alpha" },
    { symbol: "β", latex: "\\beta", name: "Beta" },
    { symbol: "γ", latex: "\\gamma", name: "Gamma" },
    { symbol: "δ", latex: "\\delta", name: "Delta" },
    { symbol: "θ", latex: "\\theta", name: "Theta" },
    { symbol: "λ", latex: "\\lambda", name: "Lambda" },
    { symbol: "μ", latex: "\\mu", name: "Mu" },
    { symbol: "σ", latex: "\\sigma", name: "Sigma" },
    { symbol: "φ", latex: "\\phi", name: "Phi" },
    { symbol: "ω", latex: "\\omega", name: "Omega" },
    { symbol: "≤", latex: "\\leq", name: "Less Equal" },
    { symbol: "≥", latex: "\\geq", name: "Greater Equal" },
    { symbol: "≠", latex: "\\neq", name: "Not Equal" },
    { symbol: "±", latex: "\\pm", name: "Plus Minus" },
    { symbol: "×", latex: "\\times", name: "Times" },
    { symbol: "÷", latex: "\\div", name: "Divide" },
    { symbol: "√", latex: "\\sqrt{}", name: "Square Root" },
    { symbol: "∛", latex: "\\sqrt[3]{}", name: "Cube Root" },
    { symbol: "x²", latex: "x^2", name: "Superscript" },
    { symbol: "x₂", latex: "x_2", name: "Subscript" },
  ]

  const keyboardShortcuts = [
    { key: "Ctrl+B", action: "Bold" },
    { key: "Ctrl+I", action: "Italic" },
    { key: "Ctrl+U", action: "Underline" },
    { key: "Ctrl+S", action: "Save/Download" },
    { key: "Ctrl+Z", action: "Undo" },
    { key: "Ctrl+Y", action: "Redo" },
    { key: "Ctrl+A", action: "Select All" },
    { key: "Ctrl+C", action: "Copy" },
    { key: "Ctrl+V", action: "Paste" },
    { key: "Ctrl+M", action: "Math Panel" },
    { key: "Ctrl+Shift+I", action: "Add Image" },
    { key: "F1", action: "Help/Shortcuts" },
  ]

  // Load data from localStorage and fetch API response on mount
  useEffect(() => {
    const storedQuery = localStorage.getItem("paperQuery")
    const storedSubject = localStorage.getItem("paperSubject")
    const storedThinkingMode = localStorage.getItem("paperThinkingMode")

    if (storedQuery && storedSubject && storedThinkingMode !== null) {
      setQuery(storedQuery)
      setSubject(storedSubject)
      setThinkingMode(storedThinkingMode === "true")

      fetchAPIResponse(storedQuery, storedSubject, storedThinkingMode === "true").then((apiResponse) => {
        if (apiResponse) {
          let thinkingLines: string[] = []
          let responseLines: string[] = []

          if (storedThinkingMode === "true") {
            const thinkingMatch = apiResponse.match(/<Thinking>([\s\S]*?)<\/Thinking>/)
            if (thinkingMatch) {
              thinkingLines = thinkingMatch[1].split("\n").filter((line: string) => line.trim() !== "")
            }
            const responsePart = apiResponse.replace(/<Thinking>[\s\S]*?<\/Thinking>/, "").trim()
            responseLines = responsePart.split("\n").filter((line: string) => line.trim() !== "")
          } else {
            responseLines = apiResponse.split("\n").filter((line: string) => line.trim() !== "")
          }

          if (storedThinkingMode === "true" && thinkingLines.length > 0) {
            let thinkingIndex = 0
            const thinkingInterval = setInterval(() => {
              if (thinkingIndex < thinkingLines.length) {
                setThinking((prev) => [...prev, thinkingLines[thinkingIndex]])
                thinkingIndex++
              } else {
                clearInterval(thinkingInterval)
                setIsThinkingComplete(true)
                startResponseGeneration(responseLines)
              }
            }, 200)
          } else {
            setIsThinkingComplete(true)
            startResponseGeneration(responseLines)
          }
        } else {
          setThinking([])
          setResponse([
            "# Sample Question Paper",
            "",
            "## Please enter your query to generate a customized question paper.",
            "",
            "### Mathematical Example:",
            "Solve the equation: $x^2 + 5x + 6 = 0$",
            "",
            "### Physics Example:",
            "Calculate the force using $F = ma$ where $m = 10kg$ and $a = 9.8m/s^2$",
          ])
          setMarkdownContent(
            "# Sample Question Paper\n\n## Please enter your query to generate a customized question paper.\n\n### Mathematical Example:\nSolve the equation: $x^2 + 5x + 6 = 0$\n\n### Physics Example:\nCalculate the force using $F = ma$ where $m = 10kg$ and $a = 9.8m/s^2$",
          )
          setIsThinkingComplete(true)
          setIsResponseComplete(true)
          setIsGenerating(false)
        }
      })
    } else {
      setSubject("Sample Subject")
      setIsLoading(false)
      setThinking([])
      setResponse([
        "# Sample Question Paper",
        "",
        "## Please enter your query to generate a customized question paper.",
        "",
        "### Mathematical Example:",
        "Solve the equation: $x^2 + 5x + 6 = 0$",
        "",
        "### Physics Example:",
        "Calculate the force using $F = ma$ where $m = 10kg$ and $a = 9.8m/s^2$",
      ])
      setMarkdownContent(
        "# Sample Question Paper\n\n## Please enter your query to generate a customized question paper.\n\n### Mathematical Example:\nSolve the equation: $x^2 + 5x + 6 = 0$\n\n### Physics Example:\nCalculate the force using $F = ma$ where $m = 10kg$ and $a = 9.8m/s^2$",
      )
      setIsThinkingComplete(true)
      setIsResponseComplete(true)
      setIsGenerating(false)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault()
            applyFormatting("bold")
            break
          case "i":
            e.preventDefault()
            applyFormatting("italic")
            break
          case "u":
            e.preventDefault()
            applyFormatting("underline")
            break
          case "s":
            e.preventDefault()
            handleDownloadTxt()
            break
          case "z":
            e.preventDefault()
            document.execCommand("undo")
            break
          case "y":
            e.preventDefault()
            document.execCommand("redo")
            break
          case "m":
            e.preventDefault()
            setShowMathPanel(!showMathPanel)
            break
        }
      }
      if (e.key === "F1") {
        e.preventDefault()
        setShowKeyboardShortcuts(!showKeyboardShortcuts)
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault()
        handleAddImage()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showMathPanel, showKeyboardShortcuts])

  // Enable CSS styling for formatting commands
  useEffect(() => {
    document.execCommand("styleWithCSS", false, "true")
  }, [])

  // Auto-scroll thinking box
  useEffect(() => {
    if (thinkingRef.current && thinking.length > 0) {
      thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight
    }
  }, [thinking])

  // Set initial editor content only once
  useEffect(() => {
    if (isResponseComplete && !contentSet.current) {
      const content = response.join("\n")
      setMarkdownContent(content)
      updateEditorContent(content)
      contentSet.current = true
    }
  }, [isResponseComplete])

  const fetchAPIResponse = async (query: string, subject: string, thinkingMode: boolean) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/professor-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, subject, thinkingMode }),
      })

      if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error fetching API response:", error)
      toast({
        title: "Error",
        description: "Failed to generate question paper. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const startResponseGeneration = (responseLines: string[]) => {
    setShowTypingIndicator(true)
    let responseIndex = 0
    const responseInterval = setInterval(() => {
      if (responseIndex < responseLines.length) {
        setResponse((prev) => [...prev, responseLines[responseIndex]])
        responseIndex++
      } else {
        clearInterval(responseInterval)
        setShowTypingIndicator(false)
        setIsResponseComplete(true)
        setIsGenerating(false)
      }
    }, 50)
  }

  const updateEditorContent = (content: string) => {
    if (editorRef.current) {
      const formattedHTML = convertMarkdownToHTML(content)
      editorRef.current.innerHTML = formattedHTML
      setupImageEventListeners()
    }
  }

  const setupImageEventListeners = () => {
    const imageContainers = editorRef.current?.querySelectorAll(".image-container")
    imageContainers?.forEach((container) => {
      const imageId = container.getAttribute("data-image-id")
      if (imageId) {
        setupImageInteractions(container as HTMLElement, imageId)
      }
    })
  }

  const setupImageInteractions = (container: HTMLElement, imageId: string) => {
    const img = container.querySelector("img")
    if (!img) return

    // Make image resizable
    let isResizing = false
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains("resize-handle")) {
        isResizing = true
        startX = e.clientX
        startY = e.clientY
        startWidth = img.offsetWidth
        startHeight = img.offsetHeight
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY
        const newWidth = Math.max(50, startWidth + deltaX)
        const aspectRatio = startHeight / startWidth
        const newHeight = newWidth * aspectRatio

        img.style.width = `${newWidth}px`
        img.style.height = `${newHeight}px`
        handleContentChange()
      }
    }

    const handleMouseUp = () => {
      if (isResizing) {
        isResizing = false
        toast({
          title: "Image Resized",
          description: "Image has been resized successfully.",
        })
      }
    }

    // Drag functionality
    container.addEventListener("dragstart", (e) => {
      setDraggedImage(imageId)
      e.dataTransfer?.setData("text/plain", imageId)
    })

    container.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const convertMarkdownToHTML = (markdown: string) => {
    return markdown
      .split("\n")
      .map((line) => {
        // Handle images
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
        if (imageMatch) {
          const [, alt, src] = imageMatch
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          return `<div class="image-container my-4 relative group cursor-move select-none" data-image-id="${imageId}" draggable="true">
            <img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl" style="min-width: 100px; min-height: 50px;" />
            <div class="image-controls absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button class="image-delete-btn absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 hover:scale-110" onclick="removeImage('${imageId}')">×</button>
              <div class="absolute top-2 left-2 bg-orange-500 text-black text-xs px-2 py-1 rounded transition-all duration-200">
                <div class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6L6 10l4 4 4-4-4-4z"/>
                  </svg>
                  Drag to move
                </div>
              </div>
              <div class="resize-handle absolute bottom-1 right-1 w-4 h-4 bg-orange-500 rounded cursor-se-resize opacity-75 hover:opacity-100 transition-opacity duration-200">
                <svg class="w-3 h-3 text-black m-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"/>
                </svg>
              </div>
            </div>
          </div>`
        }

        // Handle math expressions
        line = line.replace(
          /\$([^$]+)\$/g,
          '<span class="math-inline bg-gradient-to-r from-orange-100 to-amber-100 px-2 py-1 rounded border border-orange-200 font-serif italic">$1</span>',
        )
        line = line.replace(
          /\$\$([^$]+)\$\$/g,
          '<div class="math-block bg-gradient-to-r from-orange-100 to-amber-100 p-4 my-3 rounded-lg border-2 border-orange-200 text-center font-serif text-lg">$1</div>',
        )

        // Handle headers
        if (line.startsWith("# "))
          return `<h1 class="text-4xl font-bold my-8 text-black border-b-3 border-orange-300 pb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">${line.substring(2)}</h1>`
        if (line.startsWith("## "))
          return `<h2 class="text-3xl font-semibold my-6 text-black border-b-2 border-orange-200 pb-2">${line.substring(3)}</h2>`
        if (line.startsWith("### "))
          return `<h3 class="text-2xl font-medium my-4 text-black">${line.substring(4)}</h3>`

        // Handle formatting
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
        line = line.replace(/\*(.*?)\*/g, '<em class="italic text-black">$1</em>')

        if (line.trim() === "") return "<br />"
        return `<p class="leading-relaxed my-3 text-black text-base">${line}</p>`
      })
      .join("")
  }

  const convertHTMLToMarkdown = (html: string) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html

    const processNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent || ""
      if (node.nodeType !== Node.ELEMENT_NODE) return ""

      const element = node as Element
      const tagName = element.tagName.toLowerCase()
      const content = Array.from(element.childNodes).map(processNode).join("")

      switch (tagName) {
        case "h1":
          return `# ${content}\n`
        case "h2":
          return `## ${content}\n`
        case "h3":
          return `### ${content}\n`
        case "strong":
        case "b":
          return `**${content}**`
        case "em":
        case "i":
          return `*${content}*`
        case "p":
          return `${content}\n`
        case "br":
          return "\n"
        case "img":
          const src = element.getAttribute("src") || ""
          const alt = element.getAttribute("alt") || ""
          return `![${alt}](${src})`
        case "div":
          if (element.classList.contains("image-container")) {
            const img = element.querySelector("img")
            if (img) {
              const src = img.getAttribute("src") || ""
              const alt = img.getAttribute("alt") || ""
              return `![${alt}](${src})\n`
            }
          }
          if (element.classList.contains("math-block")) {
            return `$$${content}$$\n`
          }
          return content
        case "span":
          if (element.classList.contains("math-inline")) {
            return `$${content}$`
          }
          return content
        default:
          return content
      }
    }

    return Array.from(tempDiv.childNodes).map(processNode).join("")
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML
      const markdownContent = convertHTMLToMarkdown(htmlContent)
      setMarkdownContent(markdownContent)
      setResponse(markdownContent.split("\n").filter((line) => line.trim() !== ""))
    }
  }

  const applyFormatting = (command: string, value?: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      document.execCommand(command, false, value)
      handleContentChange()
      updateFormattingStates()
    } else {
      toast({
        title: "Select Text",
        description: "Please select some text to apply formatting.",
        variant: "destructive",
      })
    }
  }

  const applyFontFamily = (fontFamily: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      document.execCommand("fontName", false, fontFamily)
      handleContentChange()
    } else {
      toast({
        title: "Select Text",
        description: "Please select some text to apply font family.",
        variant: "destructive",
      })
    }
  }

  const updateFormattingStates = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      setIsBold(document.queryCommandState("bold"))
      setIsItalic(document.queryCommandState("italic"))
      setIsUnderline(document.queryCommandState("underline"))
    }
  }

  const insertMathSymbol = (symbol: string, latex: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      const mathSpan = document.createElement("span")
      mathSpan.className =
        "math-inline bg-gradient-to-r from-orange-100 to-amber-100 px-2 py-1 rounded border border-orange-200 font-serif italic"
      mathSpan.textContent = symbol

      range.insertNode(mathSpan)
      range.setStartAfter(mathSpan)
      range.setEndAfter(mathSpan)
      selection.removeAllRanges()
      selection.addRange(range)

      handleContentChange()
      toast({
        title: "Math Symbol Added",
        description: `Added ${symbol} to your document.`,
      })
    } else {
      toast({
        title: "Position Cursor",
        description: "Please click where you want to insert the math symbol.",
        variant: "destructive",
      })
    }
  }

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const selection = window.getSelection()

        if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0)
          range.deleteContents()

          const imageContainer = document.createElement("div")
          imageContainer.className = "image-container my-4 relative group cursor-move select-none"
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          imageContainer.setAttribute("data-image-id", imageId)
          imageContainer.setAttribute("draggable", "true")

          imageContainer.innerHTML = `
            <img src="${imageUrl}" alt="${file.name}" class="max-w-full h-auto rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl" style="min-width: 100px; min-height: 50px;" />
            <div class="image-controls absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button class="image-delete-btn absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 hover:scale-110">×</button>
              <div class="absolute top-2 left-2 bg-orange-500 text-black text-xs px-2 py-1 rounded transition-all duration-200">
                <div class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6L6 10l4 4 4-4-4-4z"/>
                  </svg>
                  Drag to move
                </div>
              </div>
              <div class="resize-handle absolute bottom-1 right-1 w-4 h-4 bg-orange-500 rounded cursor-se-resize opacity-75 hover:opacity-100 transition-opacity duration-200">
                <svg class="w-3 h-3 text-black m-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"/>
                </svg>
              </div>
            </div>
          `

          range.insertNode(imageContainer)
          range.setStartAfter(imageContainer)
          range.setEndAfter(imageContainer)
          selection.removeAllRanges()
          selection.addRange(range)

          // Setup interactions for the new image
          setupImageInteractions(imageContainer, imageId)
        } else {
          const updatedMarkdown = markdownContent + "\n\n" + `![${file.name}](${imageUrl})`
          setMarkdownContent(updatedMarkdown)
          updateEditorContent(updatedMarkdown)
        }

        handleContentChange()
        toast({
          title: "Image Added",
          description: "The image has been added. You can drag to move and resize it.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (imageId: string) => {
    const imageContainer = document.querySelector(`[data-image-id="${imageId}"]`)
    if (imageContainer) {
      imageContainer.remove()
      handleContentChange()
      toast({
        title: "Image Removed",
        description: "The image has been removed from your question paper.",
      })
    }
  }

  const handleDownloadTxt = () => {
    const element = document.createElement("a")
    const file = new Blob([markdownContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "question-paper.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast({
      title: "Downloaded",
      description: "Your question paper has been downloaded as a .txt file.",
    })
  }

  useEffect(() => {
    (window as any).removeImage = removeImage
    return () => {
      delete (window as any).removeImage
    }
  }, [])

  // Enhanced drag and drop for images
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer!.dropEffect = "move"
      editor.style.backgroundColor = "rgba(255, 165, 0, 0.05)"
    }

    const handleDragLeave = (e: DragEvent) => {
      if (!editor.contains(e.relatedTarget as Node)) {
        editor.style.backgroundColor = ""
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      editor.style.backgroundColor = ""
      const imageId = e.dataTransfer?.getData("text/plain")
      if (imageId && draggedImage === imageId) {
        const imageElement = document.querySelector(`[data-image-id="${imageId}"]`) as HTMLElement
        if (imageElement) {
          const range = document.caretRangeFromPoint(e.clientX, e.clientY)
          if (range && editor.contains(range.startContainer)) {
            range.insertNode(imageElement)
            handleContentChange()
            toast({
              title: "Image Moved",
              description: "The image has been repositioned.",
            })
          }
        }
      }
      setDraggedImage(null)
    }

    editor.addEventListener("dragover", handleDragOver)
    editor.addEventListener("dragleave", handleDragLeave)
    editor.addEventListener("drop", handleDrop)

    return () => {
      editor.removeEventListener("dragover", handleDragOver)
      editor.removeEventListener("dragleave", handleDragLeave)
      editor.removeEventListener("drop", handleDrop)
    }
  }, [draggedImage])

  const getSelectedFontClass = () => {
    const font = fontOptions.find((f) => f.value === selectedFont)
    return font ? font.className : "font-serif"
  }

  const getTextStyle = () => ({
    fontSize: `${fontSize[0]}px`,
    color: textColor,
    backgroundColor: backgroundColor,
  })

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-100 to-orange-50">
        <style jsx global>{`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(255, 165, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0); }
          }
          .pulse-border {
            animation: pulse 2s infinite;
          }
          .gradient-border {
            position: relative;
            border-radius: 0.75rem;
            padding: 1px;
            background: linear-gradient(60deg, rgba(255, 165, 0, 0.5), rgba(255, 140, 0, 0.5), rgba(255, 69, 0, 0.5));
          }
          .gradient-border::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 0.75rem;
            padding: 1px;
            background: linear-gradient(60deg, rgba(255, 165, 0, 0.5), rgba(255, 140, 0, 0.5), rgba(255, 69, 0, 0.5));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
          }
          .glass-card {
            backdrop-filter: blur(16px);
            background: rgba(255, 245, 238, 0.7);
            border: 1px solid rgba(255, 165, 0, 0.2);
            box-shadow: 
              0 4px 30px rgba(0, 0, 0, 0.1),
              inset 0 0 1px 1px rgba(255, 165, 0, 0.1);
          }
          .thinking-box {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 165, 0, 0.5) rgba(255, 245, 238, 0.1);
          }
          .thinking-box::-webkit-scrollbar {
            width: 8px;
          }
          .thinking-box::-webkit-scrollbar-track {
            background: rgba(255, 245, 238, 0.1);
            border-radius: 4px;
          }
          .thinking-box::-webkit-scrollbar-thumb {
            background: rgba(255, 165, 0, 0.5);
            border-radius: 4px;
          }
          .toolbar-button {
            background: rgba(255, 245, 238, 0.2);
            border: 1px solid rgba(255, 165, 0, 0.3);
            color: black !important;
          }
          .toolbar-button:hover {
            background: rgba(255, 165, 0, 0.3);
            border-color: rgba(255, 165, 0, 0.5);
          }
          .toolbar-button.active {
            background: rgba(255, 165, 0, 0.5);
            border-color: rgba(255, 165, 0, 0.7);
          }
          .math-symbol-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 245, 238, 0.2);
            border: 1px solid rgba(255, 165, 0, 0.3);
            border-radius: 8px;
            font-size: 18px;
            font-family: 'Times New Roman', serif;
            color: black;
            cursor: pointer;
            transition: all 0.2s;
          }
          .math-symbol-btn:hover {
            background: rgba(255, 165, 0, 0.3);
            border-color: rgba(255, 165, 0, 0.5);
            transform: scale(1.05);
          }
          .paper-container {
            background: rgba(255, 245, 238, 0.9);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 
              0 4px 20px rgba(0, 0, 0, 0.05),
              inset 0 0 1px 1px rgba(255, 165, 0, 0.1);
            min-height: 400px;
            overflow: auto;
          }
          .editable-content {
            outline: none;
            min-height: 300px;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.6;
            color: black;
          }
          .typing-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 245, 238, 0.9);
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            color: black;
          }
          .shortcuts-panel, .math-panel {
            background: rgba(255, 245, 238, 0.9);
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 165, 0, 0.2);
          }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-roboto { font-family: 'Roboto', sans-serif; }
          .font-crimson { font-family: 'Crimson Text', serif; }
          .font-lora { font-family: 'Lora', serif; }
        `}</style>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] bg-orange-500/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]" />
        </div>

        <AnimatePresence>
          {showTypingIndicator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="typing-indicator"
            >
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5" />
                <span className="font-medium">Clarvis is typing</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto py-8 px-4 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-orange-200 bg-orange-100/40 text-black hover:bg-orange-100/80 hover:text-black"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="toolbar-button"
                    onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                  >
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Keyboard Shortcuts (F1)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownloadTxt}
                    size="sm"
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-black"
                    disabled={!markdownContent || isLoading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download TXT
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download as .txt file (Ctrl+S)</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 text-center"
          >
            {subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "Question"} Paper Editor
          </motion.h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
              <p className="text-black">Generating your question paper...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence>
                {thinkingMode && showThinking && thinking.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="gradient-border">
                      <Card className="glass-card border-0">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-black flex items-center">
                            <Brain className="mr-2 h-5 w-5 text-orange-400" />
                            AI Thinking Process
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div
                            ref={thinkingRef}
                            className="relative p-4 rounded-xl bg-gradient-to-r from-orange-100/90 to-amber-100/90 shadow-[0_0_18px_rgba(255,165,0,0.6)] overflow-hidden max-h-48 overflow-y-auto thinking-box"
                          >
                            <div className="relative z-10 space-y-1">
                              {thinking.map((line, i) => (
                                <motion.p
                                  key={`think-line-${i}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                                  className="text-black leading-relaxed"
                                >
                                  {line}
                                </motion.p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Keyboard Shortcuts Panel */}
              <AnimatePresence>
                {showKeyboardShortcuts && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="shortcuts-panel"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-black flex items-center">
                        <Keyboard className="mr-2 h-5 w-5" />
                        Keyboard Shortcuts
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKeyboardShortcuts(false)}
                        className="text-black hover:bg-orange-100/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {keyboardShortcuts.map((shortcut, index) => (
                        <div key={index} className="bg-orange-100/20 rounded-lg p-3 text-center">
                          <div className="font-mono text-sm font-bold text-black">{shortcut.key}</div>
                          <div className="text-xs text-black/80">{shortcut.action}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="gradient-border">
                <Card className="glass-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-black flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-orange-400" />
                      Enhanced Question Paper Editor
                    </CardTitle>
                    <CardDescription className="text-black">
                      Click anywhere to edit content. Select text to format. Drag images to move and use resize handles
                      to adjust size.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    {/* Enhanced Vibrant Toolbar */}
                    <div className="vibrant-toolbar flex flex-wrap items-center gap-4 mb-4 sticky top-0 z-20">
                      {/* Font and Size Controls */}
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-black" />
                        <Select
                          onValueChange={(value) => {
                            setSelectedFont(value)
                            const font = fontOptions.find((f) => f.value === value)
                            if (font) applyFontFamily(font.fontFamily)
                          }}
                          value={selectedFont}
                        >
                          <SelectTrigger className="w-[180px] bg-orange-100/20 border-orange-200 text-black">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                <span className={font.className}>{font.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-black">Size:</span>
                        <div className="w-24">
                          <Slider
                            value={fontSize}
                            onValueChange={setFontSize}
                            max={32}
                            min={10}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <span className="text-sm text-black w-8">{fontSize[0]}px</span>
                      </div>

                      <Separator orientation="vertical" className="h-6 bg-orange-200" />

                      {/* Formatting Controls */}
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isBold ? "default" : "ghost"}
                              size="sm"
                              onClick={() => applyFormatting("bold")}
                              className={`toolbar-button ${isBold ? "active" : ""}`}
                            >
                              <Bold className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isItalic ? "default" : "ghost"}
                              size="sm"
                              onClick={() => applyFormatting("italic")}
                              className={`toolbar-button ${isItalic ? "active" : ""}`}
                            >
                              <Italic className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isUnderline ? "default" : "ghost"}
                              size="sm"
                              onClick={() => applyFormatting("underline")}
                              className={`toolbar-button ${isUnderline ? "active" : ""}`}
                            >
                              <Underline className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                        </Tooltip>
                      </div>

                      <Separator orientation="vertical" className="h-6 bg-orange-200" />

                      {/* Alignment Controls */}
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => applyFormatting("justifyLeft")}
                              className="toolbar-button"
                            >
                              <AlignLeft className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Align Left</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => applyFormatting("justifyCenter")}
                              className="toolbar-button"
                            >
                              <AlignCenter className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Align Center</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => applyFormatting("justifyRight")}
                              className="toolbar-button"
                            >
                              <AlignRight className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Align Right</TooltipContent>
                        </Tooltip>
                      </div>

                      <Separator orientation="vertical" className="h-6 bg-orange-200" />

                      {/* List Controls */}
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => applyFormatting("insertUnorderedList")}
                              className="toolbar-button"
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Bullet List</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => applyFormatting("insertOrderedList")}
                              className="toolbar-button"
                            >
                              <ListOrdered className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Numbered List</TooltipContent>
                        </Tooltip>
                      </div>

                      <Separator orientation="vertical" className="h-6 bg-orange-200" />

                      {/* Color Controls */}
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-black" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => {
                                setTextColor(e.target.value)
                                applyFormatting("foreColor", e.target.value)
                              }}
                              className="w-8 h-8 rounded border-none cursor-pointer bg-orange-100/20"
                              title="Text Color"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Text Color</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => {
                                setBackgroundColor(e.target.value)
                                applyFormatting("hiliteColor", e.target.value)
                              }}
                              className="w-8 h-8 rounded border-none cursor-pointer bg-orange-100/20"
                              title="Highlight Color"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Highlight Color</TooltipContent>
                        </Tooltip>
                      </div>

                      <Separator orientation="vertical" className="h-6 bg-orange-200" />

                      {/* Math and Media Controls */}
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`toolbar-button ${showMathPanel ? "active" : ""}`}
                              onClick={() => setShowMathPanel(!showMathPanel)}
                            >
                              <Calculator className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Math Panel (Ctrl+M)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="toolbar-button" onClick={handleAddImage}>
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add Image (Ctrl+Shift+I)</TooltipContent>
                        </Tooltip>
                      </div>

                      <Separator orientation="vertical" className="h-6 bg-orange-200" />

                      {/* Undo/Redo Controls */}
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => document.execCommand("undo")}
                              className="toolbar-button"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => document.execCommand("redo")}
                              className="toolbar-button"
                            >
                              <RotateCw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Math Panel */}
                    <AnimatePresence>
                      {showMathPanel && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="math-panel mb-4"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-black flex items-center">
                              <Function className="mr-2 h-5 w-5" />
                              Mathematical Symbols & Expressions
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowMathPanel(false)}
                              className="text-black hover:bg-orange-100/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-4">
                            {mathSymbols.map((symbol, index) => (
                              <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                  <button
                                    className="math-symbol-btn"
                                    onClick={() => insertMathSymbol(symbol.symbol, symbol.latex)}
                                  >
                                    {symbol.symbol}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>{symbol.name}</TooltipContent>
                              </Tooltip>
                            ))}
                          </div>

                          <div className="bg-orange-100/20 rounded-lg p-3">
                            <p className="text-black text-sm mb-2">
                              <strong>LaTeX Tips:</strong> Use $...$ for inline math and $$...$$ for block math
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-black/80">
                              <span>• Fractions: {"$\\frac{a}{b}$"}</span>
                              <span>• Powers: {"$x^{2}$"}</span>
                              <span>• Subscripts: {"$x_{1}$"}</span>
                              <span>• Square root: {"$\\sqrt{x}$"}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative mt-4"
                    >
                      <div className="paper-container">
                        <div
                          ref={editorRef}
                          className={`editable-content thinking-box ${getSelectedFontClass()}`}
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onInput={handleContentChange}
                          onKeyUp={updateFormattingStates}
                          onMouseUp={updateFormattingStates}
                          style={getTextStyle()}
                        />
                      </div>
                    </motion.div>
                  </CardContent>

                  <div className="flex justify-between items-center p-6 pt-0">
                    <div className="flex items-center gap-4">
                      <span className="text-black text-sm">{markdownContent.length} characters</span>
                      <span className="text-black text-sm">{markdownContent.split("\n").length} lines</span>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(markdownContent)
                              toast({
                                title: "Copied!",
                                description: "Content copied to clipboard.",
                              })
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-black border-orange-600"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to Clipboard</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleDownloadTxt}
                            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-black"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download TXT
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download as .txt file (Ctrl+S)</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default QuestionPaperEditor