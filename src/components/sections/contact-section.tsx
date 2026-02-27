import { Mail, MapPin, Phone } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"

const SEND_CONFIG_URL = "https://functions.poehali.dev/86675a14-a4c9-40d6-8d10-cb2be1369846"
const SEND_MESSAGE_URL = "https://functions.poehali.dev/f839bbc9-37e1-42e4-ada3-9040fa436013"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.message) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(false)

    try {
      const resp = await fetch(SEND_MESSAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
        }),
      })
      const data = await resp.json()
      if (data.ok) {
        setSubmitSuccess(true)
        setFormData({ name: "", phone: "", message: "" })
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setSubmitError(true)
      }
    } catch {
      setSubmitError(true)
    }

    setIsSubmitting(false)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:mb-3 md:text-7xl lg:text-8xl">
                Собери
                <br />
                свой ПК
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-base">/ Оставьте заявку</p>
            </div>

            <div className="space-y-4 md:space-y-8">
              <a
                href="mailto:sborkapcchita@gmail.com"
                className={`group block transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Mail className="h-3 w-3 text-foreground/60" />
                  <span className="font-mono text-xs text-foreground/60">Email</span>
                </div>
                <p className="text-base text-foreground transition-colors group-hover:text-foreground/70 md:text-2xl">
                  sborkapcchita@gmail.com
                </p>
              </a>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-foreground/60" />
                  <span className="font-mono text-xs text-foreground/60">Локация</span>
                </div>
                <p className="text-base text-foreground md:text-2xl">Чита, Забайкальский край</p>
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "420ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Phone className="h-3 w-3 text-foreground/60" />
                  <span className="font-mono text-xs text-foreground/60">Телефон</span>
                </div>
                <div className="flex flex-col gap-1">
                  <a href="tel:+79143560063" className="text-base text-foreground transition-colors hover:text-foreground/70 md:text-xl">
                    +7 914 356-00-63
                  </a>
                  <a href="tel:+79294859285" className="text-base text-foreground transition-colors hover:text-foreground/70 md:text-xl">
                    +7 929 485-92-85
                  </a>
                </div>
              </div>

              <div
                className={`flex gap-2 pt-2 transition-all duration-700 md:pt-4 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                {[
                  { label: "Telegram", href: "https://t.me/SborkaPCChita" },
                  { label: "ВКонтакте", href: "https://vk.com/id866328516" },
                  { label: "Авито", href: "https://www.avito.ru/user/199802176/profile" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-transparent font-mono text-xs text-foreground/60 transition-all hover:border-foreground/60 hover:text-foreground/90"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Minimal form */}
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                  placeholder="Ваше имя"
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                  placeholder="+7 900 000-00-00"
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">Сообщение</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                  placeholder="Расскажите о задачах: игры, работа, монтаж видео..."
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "650ms" }}
              >
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full disabled:opacity-50"
                >
                  {isSubmitting ? "Отправка..." : "Отправить"}
                </MagneticButton>
                {submitSuccess && (
                  <p className="mt-3 text-center font-mono text-sm text-foreground/80">Заявка отправлена! Свяжемся с вами.</p>
                )}
                {submitError && (
                  <p className="mt-3 text-center font-mono text-sm text-red-400">Ошибка. Попробуйте позвонить нам.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}