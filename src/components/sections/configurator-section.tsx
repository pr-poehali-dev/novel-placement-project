import { useReveal } from "@/hooks/use-reveal"
import { useState } from "react"

const cpuOptions = [
  { value: "", label: "Выберите процессор", price: 0 },
  { value: "i5", label: "Intel Core i5-13400F", price: 18000 },
  { value: "i7", label: "Intel Core i7-13700F", price: 28000 },
  { value: "r5", label: "AMD Ryzen 5 7600X", price: 22000 },
  { value: "r7", label: "AMD Ryzen 7 7700X", price: 32000 },
]

const gpuOptions = [
  { value: "", label: "Выберите видеокарту", price: 0 },
  { value: "rtx4060", label: "NVIDIA RTX 4060", price: 38000 },
  { value: "rtx4070", label: "NVIDIA RTX 4070", price: 58000 },
  { value: "rx7600", label: "AMD RX 7600", price: 30000 },
  { value: "rx7700", label: "AMD RX 7700 XT", price: 42000 },
]

const ramOptions = [
  { value: "", label: "Выберите оперативную память", price: 0 },
  { value: "16", label: "16 ГБ DDR5", price: 8000 },
  { value: "32", label: "32 ГБ DDR5", price: 14000 },
  { value: "64", label: "64 ГБ DDR5", price: 26000 },
]

const storageOptions = [
  { value: "", label: "Выберите накопитель", price: 0 },
  { value: "ssd500", label: "SSD 500 ГБ NVMe", price: 4500 },
  { value: "ssd1t", label: "SSD 1 ТБ NVMe", price: 7500 },
  { value: "ssd2t", label: "SSD 2 ТБ NVMe", price: 13000 },
]

export function ConfiguratorSection({ scrollToSection }: { scrollToSection: (i: number) => void }) {
  const { ref, isVisible } = useReveal(0.2)
  const [cpu, setCpu] = useState("")
  const [gpu, setGpu] = useState("")
  const [ram, setRam] = useState("")
  const [storage, setStorage] = useState("")

  const basePrice = 8000

  const total =
    basePrice +
    (cpuOptions.find((o) => o.value === cpu)?.price ?? 0) +
    (gpuOptions.find((o) => o.value === gpu)?.price ?? 0) +
    (ramOptions.find((o) => o.value === ram)?.price ?? 0) +
    (storageOptions.find((o) => o.value === storage)?.price ?? 0)

  const hasSelection = cpu || gpu || ram || storage

  const selectClass =
    "w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 font-sans text-sm text-foreground backdrop-blur-sm transition-all duration-200 focus:border-foreground/50 focus:outline-none hover:border-foreground/35 appearance-none cursor-pointer"

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start flex-col justify-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-2 font-mono text-xs text-foreground/60">/ Конфигуратор</p>
          <h2 className="font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Собери свой ПК
            <br />
            онлайн
          </h2>
        </div>

        <div
          className={`grid gap-4 md:grid-cols-2 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-foreground/50">Процессор</label>
              <select className={selectClass} value={cpu} onChange={(e) => setCpu(e.target.value)}>
                {cpuOptions.map((o) => (
                  <option key={o.value} value={o.value} style={{ background: "#1a1a2e", color: "#fff" }}>
                    {o.label}{o.price > 0 ? ` — ${o.price.toLocaleString("ru")} ₽` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-foreground/50">Видеокарта</label>
              <select className={selectClass} value={gpu} onChange={(e) => setGpu(e.target.value)}>
                {gpuOptions.map((o) => (
                  <option key={o.value} value={o.value} style={{ background: "#1a1a2e", color: "#fff" }}>
                    {o.label}{o.price > 0 ? ` — ${o.price.toLocaleString("ru")} ₽` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-foreground/50">Оперативная память</label>
              <select className={selectClass} value={ram} onChange={(e) => setRam(e.target.value)}>
                {ramOptions.map((o) => (
                  <option key={o.value} value={o.value} style={{ background: "#1a1a2e", color: "#fff" }}>
                    {o.label}{o.price > 0 ? ` — ${o.price.toLocaleString("ru")} ₽` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-foreground/50">Накопитель</label>
              <select className={selectClass} value={storage} onChange={(e) => setStorage(e.target.value)}>
                {storageOptions.map((o) => (
                  <option key={o.value} value={o.value} style={{ background: "#1a1a2e", color: "#fff" }}>
                    {o.label}{o.price > 0 ? ` — ${o.price.toLocaleString("ru")} ₽` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-1 flex-col justify-between rounded-xl border border-foreground/15 bg-foreground/5 p-6 backdrop-blur-sm">
              <div>
                <p className="mb-4 font-mono text-xs text-foreground/50">Итоговая стоимость</p>
                <div className="flex items-end gap-2">
                  <span className="font-sans text-5xl font-light text-foreground">
                    {total.toLocaleString("ru")}
                  </span>
                  <span className="mb-2 font-sans text-2xl text-foreground/60">₽</span>
                </div>
                <p className="mt-2 font-mono text-xs text-foreground/40">
                  Включает сборку, тестирование и гарантию
                </p>
              </div>

              <div className="mt-6 space-y-2 border-t border-foreground/10 pt-4">
                {[
                  { label: "Корпус + питание + охлаждение", price: basePrice },
                  cpu && { label: cpuOptions.find((o) => o.value === cpu)?.label, price: cpuOptions.find((o) => o.value === cpu)?.price },
                  gpu && { label: gpuOptions.find((o) => o.value === gpu)?.label, price: gpuOptions.find((o) => o.value === gpu)?.price },
                  ram && { label: ramOptions.find((o) => o.value === ram)?.label, price: ramOptions.find((o) => o.value === ram)?.price },
                  storage && { label: storageOptions.find((o) => o.value === storage)?.label, price: storageOptions.find((o) => o.value === storage)?.price },
                ]
                  .filter(Boolean)
                  .map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="font-mono text-xs text-foreground/50 truncate mr-2">{(item as {label: string | undefined; price: number | undefined}).label}</span>
                      <span className="font-mono text-xs text-foreground/70 shrink-0">
                        {((item as {label: string | undefined; price: number | undefined}).price ?? 0).toLocaleString("ru")} ₽
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => scrollToSection(6)}
              className="w-full rounded-lg border border-foreground/30 bg-foreground/10 px-6 py-3 font-sans text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-foreground/20 hover:border-foreground/50 disabled:opacity-40"
              disabled={!hasSelection}
            >
              Оформить заказ →
            </button>

            <p className="font-mono text-xs text-foreground/40 text-center">
              Комплектующие заказываем с DNS или маркетплейсов. Финальная цена уточняется при заказе.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}