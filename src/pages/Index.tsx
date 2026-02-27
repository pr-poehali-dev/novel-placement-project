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
import { AdminPanel, useAdmin } from "@/components/admin-panel"
import { useRef, useEffect, useState } from "react"

export default function Index() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const { isAdmin, login, logout } = useAdmin()
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

  const SECTION_IDS = ["hero", "work", "services", "about", "reviews", "portfolio", "configurator", "contact"]

  const scrollToSection = (index: number) => {
    const id = SECTION_IDS[index]
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setCurrentSection(index)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return
      scrollThrottleRef.current = requestAnimationFrame(() => {
        const sections = SECTION_IDS.map(id => document.getElementById(id))
        const scrollY = window.scrollY + window.innerHeight / 3
        let active = 0
        sections.forEach((el, i) => {
          if (el && el.offsetTop <= scrollY) active = i
        })
        if (active !== currentSection) setCurrentSection(active)
        scrollThrottleRef.current = undefined
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current)
    }
  }, [currentSection])

  return (
    <main className="relative min-h-screen w-full bg-background">
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
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-700 md:px-12 border-b border-foreground/5 backdrop-blur-xl bg-background/60 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md">
            <span className="font-sans text-lg font-bold text-foreground">⚡</span>
          </div>
          <span className="font-sans text-lg font-semibold tracking-tight text-foreground">Sborka PC Chita</span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          {[
            { label: "Сборки", idx: 1 },
            { label: "Услуги", idx: 2 },
            { label: "О нас", idx: 3 },
            { label: "Отзывы", idx: 4 },
            { label: "Работы", idx: 5 },
            { label: "Конфигуратор", idx: 6 },
          ].map(({ label, idx }) => (
            <button
              key={label}
              onClick={() => scrollToSection(idx)}
              className="font-sans text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => scrollToSection(7)}>
          Заказать
        </MagneticButton>
      </nav>

      <div
        className={`relative z-10 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Hero Section */}
        <section id="hero" className="flex min-h-screen w-full flex-col justify-center px-6 pt-20 pb-16 md:px-12 md:pb-24">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-6 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/10 px-4 py-1.5 backdrop-blur-md duration-700">
              <p className="font-mono text-xs text-foreground/70">Сборка ПК в Чите · Забайкальский край</p>
            </div>
            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-5xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-7xl lg:text-8xl">
              Твой идеальный<br />
              <span className="text-foreground/40">ПК — с нуля</span>
            </h1>
            <p className="mb-10 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-lg leading-relaxed text-foreground/60 duration-1000 delay-200 md:text-xl">
              Подбираем комплектующие под любые задачи и бюджет. Собираем, тестируем и доставляем готовый компьютер.
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection(6)}>
                Конфигуратор
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(7)}>
                Заказать
              </MagneticButton>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { value: "5+", label: "лет опыта" },
                { value: "500+", label: "собранных ПК" },
                { value: "24ч", label: "срок сборки" },
                { value: "100%", label: "гарантия" },
              ].map((stat) => (
                <div key={stat.value} className="rounded-xl border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-sm">
                  <p className="font-sans text-2xl font-light text-foreground">{stat.value}</p>
                  <p className="font-mono text-xs text-foreground/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div id="work"><WorkSection /></div>
        <div id="services"><ServicesSection /></div>
        <div id="about"><AboutSection scrollToSection={scrollToSection} /></div>
        <div id="reviews"><ReviewsSection /></div>
        <div id="portfolio"><PortfolioSection isAdmin={isAdmin} /></div>
        <div id="configurator"><ConfiguratorSection scrollToSection={scrollToSection} /></div>
        <div id="contact"><ContactSection /></div>
      </div>

      <AdminPanel isAdmin={isAdmin} onLogin={login} onLogout={logout} />

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}