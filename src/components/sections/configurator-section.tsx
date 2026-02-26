import { useReveal } from "@/hooks/use-reveal"
import { useState } from "react"

const socketOptions = ["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"]

const cpuOptions = [
  { value: "", label: "Выберите процессор", price: 0, socket: "" },
  // AM4
  { value: "r3-3100",    label: "AMD Ryzen 3 3100",         price: 7000,  socket: "AM4" },
  { value: "r5-3600",    label: "AMD Ryzen 5 3600",         price: 9500,  socket: "AM4" },
  { value: "r5-5600",    label: "AMD Ryzen 5 5600",         price: 12000, socket: "AM4" },
  { value: "r5-5600x",   label: "AMD Ryzen 5 5600X",        price: 14000, socket: "AM4" },
  { value: "r7-5700x",   label: "AMD Ryzen 7 5700X",        price: 18000, socket: "AM4" },
  { value: "r7-5800x",   label: "AMD Ryzen 7 5800X",        price: 22000, socket: "AM4" },
  { value: "r9-5900x",   label: "AMD Ryzen 9 5900X",        price: 28000, socket: "AM4" },
  { value: "r9-5950x",   label: "AMD Ryzen 9 5950X",        price: 38000, socket: "AM4" },
  // AM5
  { value: "r5-7600",    label: "AMD Ryzen 5 7600",         price: 18000, socket: "AM5" },
  { value: "r5-7600x",   label: "AMD Ryzen 5 7600X",        price: 22000, socket: "AM5" },
  { value: "r7-7700",    label: "AMD Ryzen 7 7700",         price: 25000, socket: "AM5" },
  { value: "r7-7700x",   label: "AMD Ryzen 7 7700X",        price: 30000, socket: "AM5" },
  { value: "r7-7800x3d", label: "AMD Ryzen 7 7800X3D",      price: 38000, socket: "AM5" },
  { value: "r9-7900x",   label: "AMD Ryzen 9 7900X",        price: 42000, socket: "AM5" },
  { value: "r9-7950x",   label: "AMD Ryzen 9 7950X",        price: 68000, socket: "AM5" },
  { value: "r9-9900x",   label: "AMD Ryzen 9 9900X",        price: 55000, socket: "AM5" },
  { value: "r9-9950x",   label: "AMD Ryzen 9 9950X",        price: 80000, socket: "AM5" },
  // LGA1200
  { value: "i3-10100f",  label: "Intel Core i3-10100F",     price: 6000,  socket: "LGA1200" },
  { value: "i5-10400f",  label: "Intel Core i5-10400F",     price: 9000,  socket: "LGA1200" },
  { value: "i5-10600k",  label: "Intel Core i5-10600K",     price: 12000, socket: "LGA1200" },
  { value: "i7-10700f",  label: "Intel Core i7-10700F",     price: 15000, socket: "LGA1200" },
  { value: "i7-10700k",  label: "Intel Core i7-10700K",     price: 18000, socket: "LGA1200" },
  { value: "i9-10900k",  label: "Intel Core i9-10900K",     price: 24000, socket: "LGA1200" },
  { value: "i3-11100",   label: "Intel Core i3-11100",      price: 7000,  socket: "LGA1200" },
  { value: "i5-11400f",  label: "Intel Core i5-11400F",     price: 10000, socket: "LGA1200" },
  { value: "i7-11700f",  label: "Intel Core i7-11700F",     price: 16000, socket: "LGA1200" },
  // LGA1700
  { value: "i3-12100f",  label: "Intel Core i3-12100F",     price: 9000,  socket: "LGA1700" },
  { value: "i5-12400f",  label: "Intel Core i5-12400F",     price: 13000, socket: "LGA1700" },
  { value: "i5-12600k",  label: "Intel Core i5-12600K",     price: 16000, socket: "LGA1700" },
  { value: "i5-13400f",  label: "Intel Core i5-13400F",     price: 18000, socket: "LGA1700" },
  { value: "i5-13600k",  label: "Intel Core i5-13600K",     price: 22000, socket: "LGA1700" },
  { value: "i7-12700f",  label: "Intel Core i7-12700F",     price: 20000, socket: "LGA1700" },
  { value: "i7-13700f",  label: "Intel Core i7-13700F",     price: 28000, socket: "LGA1700" },
  { value: "i7-13700k",  label: "Intel Core i7-13700K",     price: 34000, socket: "LGA1700" },
  { value: "i9-12900k",  label: "Intel Core i9-12900K",     price: 38000, socket: "LGA1700" },
  { value: "i9-13900k",  label: "Intel Core i9-13900K",     price: 50000, socket: "LGA1700" },
  // LGA1851
  { value: "i5-14400f",  label: "Intel Core i5-14400F",     price: 20000, socket: "LGA1851" },
  { value: "i5-14600k",  label: "Intel Core i5-14600K",     price: 26000, socket: "LGA1851" },
  { value: "i7-14700f",  label: "Intel Core i7-14700F",     price: 32000, socket: "LGA1851" },
  { value: "i7-14700k",  label: "Intel Core i7-14700K",     price: 40000, socket: "LGA1851" },
  { value: "i9-14900k",  label: "Intel Core i9-14900K",     price: 56000, socket: "LGA1851" },
  { value: "i5-arrow",   label: "Intel Core Ultra 5 245K",  price: 30000, socket: "LGA1851" },
  { value: "i7-arrow",   label: "Intel Core Ultra 7 265K",  price: 42000, socket: "LGA1851" },
  { value: "i9-arrow",   label: "Intel Core Ultra 9 285K",  price: 62000, socket: "LGA1851" },
]

const mbOptions = [
  { value: "", label: "Выберите материнскую плату", price: 0, socket: "" },
  // AM4
  { value: "b450m-ds3h",  label: "Gigabyte B450M DS3H",           price: 7500,  socket: "AM4" },
  { value: "b450m-pro",   label: "ASUS PRIME B450M-A II",         price: 8500,  socket: "AM4" },
  { value: "b550m-pro",   label: "MSI PRO B550M-P GEN3",          price: 9500,  socket: "AM4" },
  { value: "b550-tomahawk",label: "MSI MAG B550 TOMAHAWK",        price: 14000, socket: "AM4" },
  { value: "x570-pro",    label: "ASUS PRIME X570-PRO",           price: 18000, socket: "AM4" },
  { value: "x570-gaming", label: "Gigabyte X570 AORUS ELITE",     price: 22000, socket: "AM4" },
  // AM5
  { value: "b650m-k",     label: "ASUS PRIME B650M-K",            price: 12000, socket: "AM5" },
  { value: "b650m-plus",  label: "MSI PRO B650M-A WiFi",          price: 14000, socket: "AM5" },
  { value: "b650-gaming", label: "Gigabyte B650 GAMING X AX",     price: 16500, socket: "AM5" },
  { value: "b650e-aorus", label: "Gigabyte B650E AORUS PRO AX",   price: 22000, socket: "AM5" },
  { value: "x670-pro",    label: "ASUS ROG STRIX X670E-F GAMING", price: 36000, socket: "AM5" },
  { value: "x670e-aorus", label: "Gigabyte X670E AORUS MASTER",   price: 45000, socket: "AM5" },
  { value: "x870e-rog",   label: "ASUS ROG MAXIMUS Z890 APEX",    price: 60000, socket: "AM5" },
  // LGA1200
  { value: "h410m-dgs",   label: "Gigabyte H410M DS2V",           price: 6000,  socket: "LGA1200" },
  { value: "b460m-ds3h",  label: "Gigabyte B460M DS3H",           price: 7500,  socket: "LGA1200" },
  { value: "b560m-pro",   label: "MSI PRO B560M-P",               price: 9000,  socket: "LGA1200" },
  { value: "h510m-asus",  label: "ASUS PRIME H510M-K",            price: 7000,  socket: "LGA1200" },
  { value: "z490-asus",   label: "ASUS TUF GAMING Z490-PLUS",     price: 14000, socket: "LGA1200" },
  { value: "z590-aorus",  label: "Gigabyte Z590 AORUS ELITE",     price: 18000, socket: "LGA1200" },
  // LGA1700
  { value: "b660m-pro",   label: "MSI PRO B660M-A DDR4",          price: 9500,  socket: "LGA1700" },
  { value: "b760m-pro",   label: "MSI PRO B760M-P",               price: 11500, socket: "LGA1700" },
  { value: "b760m-asus",  label: "ASUS PRIME B760M-A DDR5",       price: 13000, socket: "LGA1700" },
  { value: "b760-gaming", label: "MSI MAG B760 TOMAHAWK WiFi",    price: 17000, socket: "LGA1700" },
  { value: "z690-aorus",  label: "Gigabyte Z690 AORUS PRO",       price: 24000, socket: "LGA1700" },
  { value: "z790-tomahawk",label: "MSI MAG Z790 TOMAHAWK WiFi",   price: 28000, socket: "LGA1700" },
  { value: "z790-rog",    label: "ASUS ROG STRIX Z790-F GAMING",  price: 38000, socket: "LGA1700" },
  // LGA1851
  { value: "z890m-pro",   label: "MSI PRO Z890-P WiFi",           price: 20000, socket: "LGA1851" },
  { value: "z890-tomahawk",label: "MSI MAG Z890 TOMAHAWK WiFi",   price: 28000, socket: "LGA1851" },
  { value: "z890-asus",   label: "ASUS PRIME Z890-P WiFi",        price: 24000, socket: "LGA1851" },
  { value: "z890-tuf",    label: "ASUS TUF GAMING Z890-PLUS WiFi",price: 32000, socket: "LGA1851" },
  { value: "z890-aorus",  label: "Gigabyte Z890 AORUS MASTER",    price: 45000, socket: "LGA1851" },
  { value: "z890-rog",    label: "ASUS ROG STRIX Z890-F GAMING",  price: 50000, socket: "LGA1851" },
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
  const [socket, setSocket] = useState("")
  const [cpu, setCpu] = useState("")
  const [gpu, setGpu] = useState("")
  const [ram, setRam] = useState("")
  const [storage, setStorage] = useState("")
  const [mb, setMb] = useState("")
  const [psu, setPsu] = useState("")
  const [caseVal, setCaseVal] = useState("")
  const [cooler, setCooler] = useState("")

  const assemblyPrice = 5000

  const filteredCpuOptions = socket
    ? cpuOptions.filter((o) => !o.socket || o.socket === socket)
    : cpuOptions

  const filteredMbOptions = socket
    ? mbOptions.filter((o) => !o.socket || o.socket === socket)
    : mbOptions

  const selectedCpu = cpuOptions.find((o) => o.value === cpu)
  const selectedMb = mbOptions.find((o) => o.value === mb)
  const socketMismatch =
    selectedCpu?.socket && selectedMb?.socket &&
    selectedCpu.socket !== selectedMb.socket

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
            {/* Сокет */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-foreground/50">Сокет</label>
              <select
                className={selectClass}
                value={socket}
                onChange={(e) => {
                  setSocket(e.target.value)
                  setCpu("")
                  setMb("")
                }}
              >
                <option value="" style={{ background: "#1a1a2e", color: "#fff" }}>Все сокеты</option>
                {socketOptions.map((s) => (
                  <option key={s} value={s} style={{ background: "#1a1a2e", color: "#fff" }}>{s}</option>
                ))}
              </select>
            </div>

            {[
              { label: "Процессор", options: filteredCpuOptions, val: cpu, set: setCpu },
              { label: "Материнская плата", options: filteredMbOptions, val: mb, set: setMb },
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

            {socketMismatch && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3">
                <span className="mt-0.5 text-red-400 shrink-0">⚠</span>
                <p className="font-mono text-xs text-red-400">
                  Несовместимые сокеты: процессор {selectedCpu?.socket} не подходит к плате {selectedMb?.socket}
                </p>
              </div>
            )}

            <button
              onClick={() => scrollToSection(6)}
              className="w-full rounded-lg border border-foreground/30 bg-foreground/10 px-6 py-3 font-sans text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-foreground/20 hover:border-foreground/50 disabled:opacity-40"
              disabled={!hasSelection || !!socketMismatch}
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
