import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"
import { useState } from "react"

interface Review {
  name: string
  city: string
  text: string
  rating: number
  tag: string
}

const initialReviews: Review[] = [
  {
    name: "Алексей К.",
    city: "Чита",
    text: "Заказал сборку для видеомонтажа — результат превзошёл ожидания. Всё работает быстро, без лагов. Ребята посоветовали оптимальный вариант под мой бюджет.",
    rating: 5,
    tag: "Видеомонтаж",
  },
  {
    name: "Дмитрий Р.",
    city: "Краснокаменск",
    text: "Брал игровой ПК. Объяснили разницу между комплектующими, не навязывали лишнего. Доставили в целости, всё запустилось сразу.",
    rating: 5,
    tag: "Игровой ПК",
  },
  {
    name: "Марина С.",
    city: "Чита",
    text: "Заказывала офисный компьютер для небольшого офиса. Собрали 3 машины под ключ — быстро и недорого. Теперь всё летает.",
    rating: 5,
    tag: "Офис",
  },
  {
    name: "Игорь В.",
    city: "Борзя",
    text: "Очень доволен! Объяснили всё доступно, помогли выбрать. Доставка в Борзю прошла без проблем. Буду рекомендовать знакомым.",
    rating: 5,
    tag: "Игровой ПК",
  },
  {
    name: "Татьяна Л.",
    city: "Чита",
    text: "Сыну собрали компьютер для учёбы и игр. Цена приятно удивила. Всё протестировали перед отправкой — пришло в отличном состоянии.",
    rating: 5,
    tag: "Учёба и игры",
  },
]

const TAGS = ["Игровой ПК", "Офис", "Видеомонтаж", "Учёба и игры", "Рабочая станция", "Другое"]

export function ReviewsSection() {
  const { ref, isVisible } = useReveal(0.2)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const [form, setForm] = useState({ name: "", city: "", text: "", rating: 5, tag: TAGS[0] })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setReviews(prev => [{ ...form }, ...prev])
    setForm({ name: "", city: "", text: "", rating: 5, tag: TAGS[0] })
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setShowForm(false) }, 2500)
  }

  const inputClass = "w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2.5 font-sans text-sm text-foreground placeholder-foreground/30 focus:border-foreground/40 focus:outline-none transition-colors"

  return (
    <section
      ref={ref}
      className="flex w-full flex-col justify-start px-4 py-16 md:px-12 md:py-20 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div
          className={`mb-6 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
        >
          <p className="mb-1 font-mono text-xs text-foreground/60">/ Отзывы клиентов</p>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h2 className="font-sans text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Что говорят<br />наши клиенты
            </h2>
            <button
              onClick={() => setShowForm(v => !v)}
              className="flex items-center gap-2 rounded-xl border border-foreground/25 px-4 py-2 font-mono text-xs text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-colors"
            >
              <Icon name={showForm ? "X" : "MessageSquarePlus"} size={13} />
              {showForm ? "Закрыть" : "Оставить отзыв"}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div
            className={`mb-5 rounded-xl border border-foreground/20 bg-foreground/5 p-4 backdrop-blur-sm transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {submitted ? (
              <div className="flex items-center gap-3 py-4 justify-center">
                <Icon name="CheckCircle" size={20} className="text-green-400" />
                <p className="font-sans text-sm text-foreground/80">Спасибо за ваш отзыв!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="mb-3 font-mono text-xs text-foreground/50">Поделитесь впечатлением о нашей работе</p>
                <div className="grid gap-3 sm:grid-cols-2 mb-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Имя *</label>
                    <input
                      className={inputClass}
                      placeholder="Ваше имя"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Город</label>
                    <input
                      className={inputClass}
                      placeholder="Чита"
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mb-3 flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Отзыв *</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Расскажите о вашем опыте работы с нами..."
                    value={form.text}
                    onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    required
                  />
                </div>

                <div className="mb-4 flex flex-wrap gap-4 items-end">
                  {/* Stars */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Оценка</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setForm(f => ({ ...f, rating: star }))}
                        >
                          <Icon
                            name="Star"
                            size={20}
                            className={`transition-colors ${star <= (hoveredStar || form.rating) ? "fill-amber-400 text-amber-400" : "text-foreground/20"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tag */}
                  <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                    <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Тип сборки</label>
                    <select
                      className={`${inputClass} appearance-none`}
                      value={form.tag}
                      onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                      style={{ background: "#0d0d1a" }}
                    >
                      {TAGS.map(t => <option key={t} value={t} style={{ background: "#0d0d1a" }}>{t}</option>)}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="h-10 px-5 rounded-xl bg-foreground text-background font-sans text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    Отправить
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews grid */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`flex flex-col gap-3 rounded-xl border border-foreground/15 bg-foreground/5 p-4 backdrop-blur-sm transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${150 + i * 80}ms` }}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Icon key={j} name="Star" size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="flex-1 text-xs leading-relaxed text-foreground/80">
                «{review.text}»
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">{review.name}</p>
                  {review.city && <p className="font-mono text-xs text-foreground/50">{review.city}</p>}
                </div>
                <span className="rounded-full border border-foreground/20 px-2 py-0.5 font-mono text-[10px] text-foreground/60">
                  {review.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-5 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          style={{ transitionDelay: "700ms" }}
        >
          <p className="font-mono text-xs text-foreground/50">
            Более {reviews.length >= 50 ? "50" : reviews.length} довольных клиентов по Забайкальскому краю
          </p>
        </div>
      </div>
    </section>
  )
}