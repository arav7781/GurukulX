"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpen, Users, FileText, Bot, Menu, X, Globe, DollarSign } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Voicebot", href: "/Voicebot", icon: Users },
    { name: "AI Reader", href: "/ai-assistants/tts", icon: BookOpen },
    { name: "Flowchart", href: "/research-support/flowchart", icon: Users },
    { name: "Question Paper", href: "/student-engagement/chatbot", icon: FileText },
    { name: "Coding Assistant", href: "/ai-assistants/coding", icon: Bot },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "RAG Chatbot", href: "https://legal-search-case-files.vercel.app/chatbot", icon: Globe, external: true },
    { name: "GitHub", href: "https://github.com/arav7781/GurukulX", icon: Globe, external: true },
  ]

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-orange-200/50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-2 group-hover:scale-105 transition-transform">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-1 font-bold text-xl group-hover:text-orange-600 transition-colors hidden md:inline-block">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent">
                GurukulX
              </span>
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 text-sm font-medium transition-colors hover:scale-105",
                  isActive ? "text-orange-600" : "text-gray-700 hover:text-orange-600",
                  "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-orange-500 after:transition-all after:duration-300",
                  isActive && !item.external ? "after:w-full" : "after:w-0 hover:after:w-full",
                )}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-orange-50 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div> */}
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-orange-200/50 shadow-lg">
          <div className="space-y-2 px-4 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive && !item.external
                      ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                  )}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
