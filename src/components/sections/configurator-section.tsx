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

const mbOptions = [
  { value: "", label: "Выберите материнскую плату", price: 0 },
  { value: "b650m", label: "ASUS PRIME B650M-K (AM5)", price: 12000 },
  { value: "b760m", label: "MSI PRO B760M-P (LGA1700)", price: 11500 },
  { value: "b650", label: "Gigabyte B650 GAMING X AX (AM5)", price: 16500 },
  { value: "z790", label: "MSI MAG Z790 TOMAHAWK (LGA1700)", price: 22000 },
]

const psuOptions = [
  { value: "", label: "Выберите блок питания", price: 0 },
  { value: "550w", label: "Deepcool PQ550M 550W 80+ Gold", price: 5500 },
  { value: "650w", label: "Seasonic Focus GX-650 650W 80+ Gold", price: 8500 },
  { value: "750w", label: "be quiet! Pure Power 12 M 750W 80+ Gold", price: 10500 },
  { value: "850w", label: "Corsair RM850x 850W 80+ Gold", price: 14000 },
]

const caseOptions = [
  { value: "", label: "Выберите корпус", price: 0 },
  { value: "matx1", label: "DeepCool MATREXX 40 (mATX)", price: 3500 },
  { value: "atx1", label: "Deepcool CC560 (ATX)", price: 5500 },
  { value: "atx2", label: "be quiet! Pure Base 500DX (ATX)", price: 9500 },
  { value: "atx3", label: "Fractal Design Pop Air (ATX)", price: 10500 },
]

const coolerOptions = [
  { value: "", label: "Выберите охлаждение", price: 0 },
  { value: "box", label: "Боксовый кулер (в комплекте с CPU)", price: 0 },
  { value: "dc1", label: "Deepcool AG400 (башня, 120мм)", price: 3000 },
  { value: "be1", label: "be quiet! Pure Rock 2 (башня, 120мм)", price: 4500 },
  { value: "dc2", label: "Deepcool AG620 (двойная башня, 2×120мм)", price: 5500 },
  { value: "aio240", label: "Deepcool LT240 (СЖО 240мм)", price: 8500 },
]

export function ConfiguratorSection({ scrollToSection }: { scrollToSection: (i: number) => void }) {
  const { ref, isVisible } = useReveal(0.2)
  const [cpu, setCpu] = useState("")
  const [gpu, setGpu] = useState("")
  const [ram, setRam] = useState("")
  const [storage, setStorage] = useState("")
  const [mb, setMb] = useState("")
  const [psu, setPsu] = useState("")
  const [caseVal, setCaseVal] = useState("")
  const [cooler, setCooler] = useState("")

  const assemblyPrice = 5000

  const total =
    assemblyPrice +
    (cpuOptions.find((o) => o.value === cpu)?.price ?? 0) +
    (gpuOptions.find((o) => o.value === gpu)?.price ?? 0) +
    (ramOptions.find((o) => o.value === ram)?.price ?? 0) +
    (storageOptions.find((o) => o.value === storage)?.price ?? 0) +
    (mbOptions.find((o) => o.value === mb)?.price ?? 0) +
    (psuOptions.find((o) => o.value === psu)?.price ?? 0) +
    (caseOptions.find((o) => o.value === caseVal)?.price ?? 0) +
    (coolerOptions.find((o) => o.value === cooler)?.price ?? 0)

  const hasSelection = cpu || gpu || ram || storage || mb || psu || caseVal || cooler

  const selectClass =
    "w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 font-sans text-sm text-foreground backdrop-blur-sm transition-all duration-200 focus:border-foreground/50 focus:outline-none hover:border-foreground/35 appearance-none cursor-pointer"

  const breakdown = [
    { label: "Сборка и тестирование", price: assemblyPrice },
    cpu && { label: cpuOptions.find((o) => o.value === cpu)?.label, price: cpuOptions.find((o) => o.value === cpu)?.price },
    mb && { label: mbOptions.find((o) => o.value === mb)?.label, price: mbOptions.find((o) => o.value === mb)?.price },
    gpu && { label: gpuOptions.find((o) => o.value === gpu)?.label, price: gpuOptions.find((o) => o.value === gpu)?.price },
    ram && { label: ramOptions.find((o) => o.value === ram)?.label, price: ramOptions.find((o) => o.value === ram)?.price },
    storage && { label: storageOptions.find((o) => o.value === storage)?.label, price: storageOptions.find((o) => o.value === storage)?.price },
    psu && { label: psuOptions.find((o) => o.value === psu)?.label, price: psuOptions.find((o) => o.value === psu)?.price },
    caseVal && { label: caseOptions.find((o) => o.value === caseVal)?.label, price: caseOptions.find((o) => o.value === caseVal)?.price },
    cooler && cooler !== "box" && { label: coolerOptions.find((o) => o.value === cooler)?.label, price: coolerOptions.find((o) => o.value === cooler)?.price },
  ].filter(Boolean) as { label: string | undefined; price: number | undefined }[]

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start flex-col justify-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div
          className={`mb-6 transition-all duration-700 ${
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
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[55vh] pr-1 scrollbar-thin">
            {[
              { label: "Процессор", options: cpuOptions, val: cpu, set: setCpu },
              { label: "Материнская плата", options: mbOptions, val: mb, set: setMb },
              { label: "Видеокарта", options: gpuOptions, val: gpu, set: setGpu },
              { label: "Оперативная память", options: ramOptions, val: ram, set: setRam },
              { label: "Накопитель", options: storageOptions, val: storage, set: setStorage },
              { label: "Блок питания", options: psuOptions, val: psu, set: setPsu },
              { label: "Корпус", options: caseOptions, val: caseVal, set: setCaseVal },
              { label: "Охлаждение CPU", options: coolerOptions, val: cooler, set: setCooler },
            ].map(({ label, options, val, set }) => (
              <div key={label} className="flex flex-col gap-1">
                <label className="font-mono text-xs text-foreground/50">{label}</label>
                <select className={selectClass} value={val} onChange={(e) => set(e.target.value)}>
                  {options.map((o) => (
                    <option key={o.value} value={o.value} style={{ background: "#1a1a2e", color: "#fff" }}>
                      {o.label}{o.price > 0 ? ` — ${o.price.toLocaleString("ru")} ₽` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-1 flex-col justify-between rounded-xl border border-foreground/15 bg-foreground/5 p-5 backdrop-blur-sm">
              <div>
                <p className="mb-3 font-mono text-xs text-foreground/50">Итоговая стоимость</p>
                <div className="flex items-end gap-2">
                  <span className="font-sans text-5xl font-light text-foreground">
                    {total.toLocaleString("ru")}
                  </span>
                  <span className="mb-2 font-sans text-2xl text-foreground/60">₽</span>
                </div>
                <p className="mt-1 font-mono text-xs text-foreground/40">
                  Включает сборку, тестирование и гарантию
                </p>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-foreground/10 pt-3 max-h-[22vh] overflow-y-auto">
                {breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-mono text-xs text-foreground/50 truncate mr-2">{item.label}</span>
                    <span className="font-mono text-xs text-foreground/70 shrink-0">
                      {(item.price ?? 0).toLocaleString("ru")} ₽
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
