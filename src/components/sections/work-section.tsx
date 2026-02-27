import { useReveal } from "@/hooks/use-reveal"

const builds = [
  {
    number: "01",
    title: "Офисный ПК",
    subtitle: "Работа, учёба, интернет",
    specs: "Intel Core i3 / i5 · 8–16 ГБ DDR4 · SSD 256–512 ГБ · Intel UHD Graphics",
    price: "от 30 000 ₽",
    direction: "left",
  },
  {
    number: "02",
    title: "Домашний мультимедиа",
    subtitle: "Кино, стриминг, фото",
    specs: "Intel Core i5 · 16 ГБ DDR4 · SSD 512 ГБ · GTX 1650 / RX 6600",
    price: "от 55 000 ₽",
    direction: "right",
  },
  {
    number: "03",
    title: "Игровой старт",
    subtitle: "1080p Gaming 60+ FPS",
    specs: "Ryzen 5 5600 · 16 ГБ DDR4 · SSD 1 ТБ · RTX 3060 / RX 6700 XT",
    price: "от 85 000 ₽",
    direction: "left",
  },
  {
    number: "04",
    title: "Игровой зверь",
    subtitle: "1440p / 4K Gaming 100+ FPS",
    specs: "Ryzen 7 7800X3D · 32 ГБ DDR5 · NVMe 1 ТБ · RTX 4070 Super / RX 7900 XT",
    price: "от 150 000 ₽",
    direction: "right",
  },
  {
    number: "05",
    title: "Рабочая станция",
    subtitle: "Видеомонтаж, 3D, рендер",
    specs: "Intel Core i9 / Ryzen 9 · 64 ГБ DDR5 · NVMe 2 ТБ · RTX 4090 / RTX 5080",
    price: "от 300 000 ₽",
    direction: "left",
  },
]

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex w-full flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 transition-all duration-700 md:mb-10 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Популярные сборки
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Готовые конфигурации под любую задачу</p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {builds.map((build, i) => (
            <BuildCard key={i} build={build} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BuildCard({
  build,
  index,
  isVisible,
}: {
  build: { number: string; title: string; subtitle: string; specs: string; price: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return build.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      className={`group flex items-center justify-between border-b border-foreground/10 py-4 transition-all duration-700 hover:border-foreground/25 md:py-5 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-start gap-4 md:gap-8 min-w-0">
        <span className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-foreground/50 shrink-0 mt-0.5">
          {build.number}
        </span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="font-sans text-xl font-light text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-2xl lg:text-3xl">
              {build.title}
            </h3>
            <span className="font-mono text-xs text-foreground/40">{build.subtitle}</span>
          </div>
          <p className="font-mono text-xs text-foreground/40 mt-0.5 truncate md:text-sm">{build.specs}</p>
        </div>
      </div>
      <span className="font-mono text-xs text-foreground/40 shrink-0 ml-4 group-hover:text-foreground/60 transition-colors md:text-sm">
        {build.price}
      </span>
    </div>
  )
}