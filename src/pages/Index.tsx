import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ReviewsSection } from "@/components/sections/reviews-section"
import { ConfiguratorSection } from "@/components/sections/configurator-section"
import { PortfolioSection } from "@/components/sections/portfolio-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>()

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 7) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 7) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        {/* Deep dark base */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #0a0e1a 70%, #0f0a0a 100%)" }} />

        {/* PCB circuit grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pcb-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="none" />
              <line x1="0" y1="40" x2="80" y2="40" stroke="#22c55e" strokeWidth="0.5" />
              <line x1="40" y1="0" x2="40" y2="80" stroke="#22c55e" strokeWidth="0.5" />
              <circle cx="40" cy="40" r="2.5" fill="#22c55e" />
              <circle cx="0" cy="0" r="1.5" fill="#22c55e" />
              <circle cx="80" cy="0" r="1.5" fill="#22c55e" />
              <circle cx="0" cy="80" r="1.5" fill="#22c55e" />
              <circle cx="80" cy="80" r="1.5" fill="#22c55e" />
              <rect x="28" y="28" width="24" height="24" fill="none" stroke="#22c55e" strokeWidth="0.5" />
            </pattern>
            <pattern id="pcb-traces" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              <line x1="0" y1="20" x2="60" y2="20" stroke="#22c55e" strokeWidth="1" />
              <line x1="60" y1="20" x2="60" y2="60" stroke="#22c55e" strokeWidth="1" />
              <line x1="60" y1="60" x2="120" y2="60" stroke="#22c55e" strokeWidth="1" />
              <line x1="120" y1="60" x2="120" y2="100" stroke="#22c55e" strokeWidth="1" />
              <line x1="120" y1="100" x2="160" y2="100" stroke="#22c55e" strokeWidth="1" />
              <line x1="20" y1="0" x2="20" y2="80" stroke="#22c55e" strokeWidth="1" />
              <line x1="20" y1="80" x2="80" y2="80" stroke="#22c55e" strokeWidth="1" />
              <line x1="80" y1="80" x2="80" y2="140" stroke="#22c55e" strokeWidth="1" />
              <line x1="80" y1="140" x2="160" y2="140" stroke="#22c55e" strokeWidth="1" />
              <circle cx="60" cy="20" r="3" fill="#22c55e" />
              <circle cx="60" cy="60" r="3" fill="#22c55e" />
              <circle cx="120" cy="60" r="3" fill="#22c55e" />
              <circle cx="120" cy="100" r="3" fill="#22c55e" />
              <circle cx="20" cy="80" r="3" fill="#22c55e" />
              <circle cx="80" cy="80" r="3" fill="#22c55e" />
              <circle cx="80" cy="140" r="3" fill="#22c55e" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pcb-grid)" />
          <rect width="100%" height="100%" fill="url(#pcb-traces)" />
        </svg>

        {/* CPU chip icons scattered */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          {[
            { x: 10, y: 8, s: 80 }, { x: 55, y: 20, s: 60 }, { x: 80, y: 5, s: 90 },
            { x: 25, y: 55, s: 70 }, { x: 70, y: 65, s: 80 }, { x: 5, y: 75, s: 65 },
            { x: 42, y: 38, s: 100 }, { x: 88, y: 40, s: 55 }, { x: 60, y: 85, s: 75 },
          ].map((c, i) => (
            <g key={i} transform={`translate(${c.x}%, ${c.y}%) scale(${c.s / 80})`}>
              <rect x="-20" y="-20" width="40" height="40" rx="4" fill="none" stroke="#60a5fa" strokeWidth="2" />
              <rect x="-12" y="-12" width="24" height="24" rx="2" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="-20" y1="-8" x2="-28" y2="-8" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="-20" y1="0" x2="-28" y2="0" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="-20" y1="8" x2="-28" y2="8" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="20" y1="-8" x2="28" y2="-8" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="20" y1="0" x2="28" y2="0" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="20" y1="8" x2="28" y2="8" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="-8" y1="-20" x2="-8" y2="-28" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="0" y1="-20" x2="0" y2="-28" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="8" y1="-20" x2="8" y2="-28" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="-8" y1="20" x2="-8" y2="28" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="0" y1="20" x2="0" y2="28" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="8" y1="20" x2="8" y2="28" stroke="#60a5fa" strokeWidth="1.5" />
            </g>
          ))}
        </svg>

        {/* Radial glow — blue top-left, orange bottom-right */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 15% 20%, rgba(18,117,216,0.35) 0%, transparent 70%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 85% 80%, rgba(225,145,54,0.28) 0%, transparent 70%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)" }} />

        {/* Vignette */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-foreground/25">
            <span className="font-sans text-xl font-bold text-foreground">⚡</span>
          </div>
          <span className="font-sans text-xl font-semibold tracking-tight text-foreground">Sborka PC Chita</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {["Главная", "Конфигурации", "Услуги", "О нас", "Отзывы", "Наши работы", "Конфигуратор", "Заказать"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                  currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => scrollToSection(7)}>
          Заказать
        </MagneticButton>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero Section */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-end px-6 pb-16 pt-24 md:px-12 md:pb-24">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md duration-700">
              <p className="font-mono text-xs text-foreground/90">Конфигуратор и сборка ПК</p>
            </div>
            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-6xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-7xl lg:text-8xl">
              <span className="text-balance">
                Твой идеальный ПК — с нуля
              </span>
            </h1>
            <p className="mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-lg leading-relaxed text-foreground/90 duration-1000 delay-200 md:text-xl">
              <span className="text-pretty">
                Подбираем комплектующие под любые задачи и бюджет. Собираем, тестируем и доставляем готовый компьютер.
              </span>
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => scrollToSection(6)}
              >
                Конфигуратор
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(1)}>
                Примеры сборок
              </MagneticButton>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/80">Листайте вправо</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/80" />
              </div>
            </div>
          </div>
        </section>

        <WorkSection />
        <ServicesSection />
        <AboutSection scrollToSection={scrollToSection} />
        <ReviewsSection />
        <PortfolioSection />
        <ConfiguratorSection scrollToSection={scrollToSection} />
        <ContactSection />
      </div>

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}