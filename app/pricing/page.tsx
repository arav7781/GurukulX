"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Coffee, GraduationCap, Sparkles, Crown, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const { toast } = useToast()

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName)

    if (planName === "Guru's Blessing") {
      setShowEasterEgg(true)
      toast({
        title: "🙏 Guru's Blessing Activated!",
        description: "Your teachers are smiling somewhere! ✨",
      })
    } else if (planName === "Coffee Debt") {
      toast({
        title: "☕ Perfect Choice!",
        description: "Every professor deserves good coffee! Your karma is safe.",
      })
    } else if (planName === "Scholarship Fund") {
      toast({
        title: "🎓 Noble Heart!",
        description: "You're helping the next generation. Your teachers would be proud!",
      })
    }
  }

  const pricingPlans = [
    {
      name: "Guru's Blessing",
      price: "₹0",
      period: "Forever",
      description: "For those who learned from the best teachers",
      icon: Heart,
      color: "from-orange-500 to-red-500",
      popular: true,
      features: [
        "All AI features unlocked",
        "Unlimited lesson plans",
        "24/7 coding assistant",
        "Blessed by your teachers' wisdom",
        "Karma protection included",
        "Good vibes only",
        "Teacher's pet status",
        "Infinite gratitude",
      ],
      funnyNote: "Because a good student never forgets their teacher! 🙏",
      buttonText: "Accept Blessing",
    },
    {
      name: "Coffee Debt",
      price: "₹99",
      period: "per month",
      description: "Buy your professor a coffee (virtually)",
      icon: Coffee,
      color: "from-amber-500 to-orange-500",
      features: [
        "All premium features",
        "Priority support",
        "Advanced AI models",
        "Coffee karma points",
        "Professor appreciation badge",
        "Guilt-free usage",
        "Warm fuzzy feelings",
        "Caffeine-powered AI",
      ],
      funnyNote: "Every click sends virtual coffee to a professor somewhere! ☕",
      buttonText: "Brew Some Karma",
    },
    {
      name: "Scholarship Fund",
      price: "₹499",
      period: "per month",
      description: "Help the next generation of students",
      icon: GraduationCap,
      color: "from-green-600 to-green-700",
      features: [
        "Everything in Coffee Debt",
        "White-label solutions",
        "Custom AI training",
        "Scholarship contribution",
        "Hall of fame mention",
        "Teacher's blessing certificate",
        "Lifetime good karma",
        "Educational impact reports",
      ],
      funnyNote: "Your subscription helps fund scholarships. Teachers everywhere are doing happy dances! 💃",
      buttonText: "Spread the Knowledge",
    },
  ]

  const testimonials = [
    {
      name: "Prof. Sharma",
      role: "Computer Science",
      quote: "Finally, a student who remembers where they learned to code! 😊",
      avatar: "👨‍🏫",
    },
    {
      name: "Dr. Priya",
      role: "Mathematics",
      quote: "This pricing model restored my faith in students. Plus, free coffee! ☕",
      avatar: "👩‍🏫",
    },
    {
      name: "Prof. Kumar",
      role: "Physics",
      quote: "The only subscription that doesn't make me question the universe! 🌌",
      avatar: "👨‍🔬",
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
        .white-gradient {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
        }
        .gradient-text {
          background: linear-gradient(135deg, #ff671f, #046a38);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-text-tricolor {
          background: linear-gradient(90deg, #ff671f 0%, #000080 50%, #046a38 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .chakra-wheel {
          position: absolute;
          width: 120px;
          height: 120px;
          border: 3px solid rgba(0, 0, 128, 0.1);
          border-radius: 50%;
          top: 5%;
          right: 5%;
        }
        .chakra-wheel::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background: rgba(0, 0, 128, 0.1);
          border-radius: 50%;
        }
        .chakra-spoke {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 58px;
          height: 1px;
          background: rgba(0, 0, 128, 0.1);
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
      `}</style>

      {/* Indian Flag inspired decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Saffron decorative element */}
        <div className="absolute -top-[15%] -left-[10%] w-[40%] h-[25%] bg-gradient-to-r from-orange-500/15 to-orange-400/5 rounded-full blur-[100px]" />
        {/* Green decorative element */}
        <div className="absolute -bottom-[15%] -right-[10%] w-[40%] h-[25%] bg-gradient-to-r from-green-600/15 to-green-500/5 rounded-full blur-[100px]" />
        {/* Central white enhancement */}
        <div className="absolute top-[35%] left-[30%] w-[40%] h-[30%] bg-white/80 rounded-full blur-[60px]" />
        
        {/* Ashoka Chakra in background */}
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

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-green-100 px-6 py-3 rounded-full mb-6 border border-orange-200"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-semibold text-gray-800">Guilt-Free Pricing</span>
            <Sparkles className="h-5 w-5 text-green-600" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Pricing That Makes</span>
            <br />
            <span className="gradient-text-tricolor">Teachers Smile</span>
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Because a developer should never charge money from those who taught them to code! Choose your way to give
            back to the education community. 🎓
          </p>

          <motion.div
            className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gradient-to-r from-red-50 to-red-100 px-6 py-3 rounded-lg border border-red-200"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Heart className="h-4 w-4 text-red-500" />
            Made with gratitude for all teachers
            <Heart className="h-4 w-4 text-red-500" />
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.name

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 text-sm shadow-lg">
                      <Crown className="h-4 w-4 mr-1" />
                      Most Blessed
                    </Badge>
                  </motion.div>
                )}

                <Card
                  className={`h-full transition-all duration-300 bg-white border-2 ${
                    isSelected ? "border-orange-500 shadow-2xl shadow-orange-500/20" : "border-gray-200 hover:border-orange-300 hover:shadow-xl"
                  } ${plan.popular ? "border-orange-200" : ""}`}
                >
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={{
                        scale: 1.1,
                        rotate: 360,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>

                    <CardTitle className="text-2xl mb-2 text-gray-800">{plan.name}</CardTitle>
                    <CardDescription className="text-base text-gray-600">{plan.description}</CardDescription>

                    <div className="mt-4">
                      <motion.span
                        className="text-4xl font-bold text-gray-800"
                        animate={
                          plan.name === "Guru's Blessing"
                            ? {
                                scale: [1, 1.1, 1],
                                color: ["#1f2937", "#ff671f", "#1f2937"],
                              }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {plan.price}
                      </motion.span>
                      <span className="text-gray-500 ml-2">/{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + featureIndex * 0.1 }}
                      >
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </motion.div>
                    ))}

                    <motion.div 
                      className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-orange-200" 
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-xs text-center italic text-gray-600">{plan.funnyNote}</p>
                    </motion.div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3 shadow-lg transition-all duration-300`}
                      onClick={() => handlePlanSelect(plan.name)}
                      disabled={isSelected}
                    >
                      <motion.span animate={isSelected ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.5 }}>
                        {isSelected ? "Selected! 🎉" : plan.buttonText}
                      </motion.span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Easter Egg Animation */}
        <AnimatePresence>
          {showEasterEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
              onClick={() => setShowEasterEgg(false)}
            >
              <motion.div
                className="bg-white p-8 rounded-2xl text-center max-w-md mx-4 border-2 border-orange-200 shadow-2xl"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-6xl mb-4"
                >
                  🙏
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Guru's Blessing Received!</h3>
                <p className="text-gray-600 mb-4">
                  Your teachers are sending you good vibes from wherever they are! May your code compile on the first
                  try! ✨
                </p>
                <Button 
                  onClick={() => setShowEasterEgg(false)}
                  className="bg-gradient-to-r from-orange-500 to-green-600 text-white"
                >
                  Namaste 🙏
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h2>

          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="p-6 text-left bg-white border-2 border-gray-200 hover:border-orange-300 transition-colors">
              <h3 className="font-semibold mb-2 text-gray-800">Is the "Guru's Blessing" plan really free?</h3>
              <p className="text-gray-600">
                It's our way of honoring the teachers who shaped us. The only payment required is your gratitude and
                good karma! 🙏
              </p>
            </Card>

            <Card className="p-6 text-left bg-white border-2 border-gray-200 hover:border-orange-300 transition-colors">
              <h3 className="font-semibold mb-2 text-gray-800">Do you actually send coffee to professors?</h3>
              <p className="text-gray-600">
                While we can't physically deliver coffee (yet!), we do contribute to educational initiatives and teacher
                appreciation programs. Your subscription helps! ☕
              </p>
            </Card>

            <Card className="p-6 text-left bg-white border-2 border-gray-200 hover:border-orange-300 transition-colors">
              <h3 className="font-semibold mb-2 text-gray-800">What if I never had good teachers?</h3>
              <p className="text-gray-600">
                Then this is your chance to be the change! Choose any plan and help create better educational
                experiences for future students. 🌟
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-orange-50 via-white to-green-50 rounded-2xl border-2 border-gray-200 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Ready to Honor Your Teachers?</h3>
          <p className="text-gray-600 mb-6 text-lg">
            Choose a plan that makes you feel good about using AI for education. Because gratitude is the best currency!
            💝
          </p>
          <Link href="/lesson-planning">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white font-semibold px-8 py-3 shadow-lg transition-all duration-300 transform hover:scale-105">
              <Heart className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}