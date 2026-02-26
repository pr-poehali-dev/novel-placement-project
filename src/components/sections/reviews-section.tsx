import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"

const reviews = [
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

export function ReviewsSection() {
  const { ref, isVisible } = useReveal(0.2)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start flex-col justify-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-2 font-mono text-xs text-foreground/60">/ Отзывы клиентов</p>
          <h2 className="font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Что говорят
            <br />
            наши клиенты
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`flex flex-col gap-3 rounded-xl border border-foreground/15 bg-foreground/5 p-4 backdrop-blur-sm transition-all duration-700 md:p-5 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${150 + i * 100}ms` }}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Icon key={j} name="Star" size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="flex-1 text-xs leading-relaxed text-foreground/80 md:text-sm">
                «{review.text}»
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">{review.name}</p>
                  <p className="font-mono text-xs text-foreground/50">{review.city}</p>
                </div>
                <span className="rounded-full border border-foreground/20 px-2 py-0.5 font-mono text-[10px] text-foreground/60">
                  {review.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-6 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <p className="font-mono text-xs text-foreground/50">
            Более 50 довольных клиентов по Забайкальскому краю
          </p>
        </div>
      </div>
    </section>
  )
}
