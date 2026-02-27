import { useReveal } from "@/hooks/use-reveal"
import { useRef, useState } from "react"
import Icon from "@/components/ui/icon"

interface PortfolioItem {
  id: string
  src: string
  title: string
  description: string
}

const STORAGE_KEY = "portfolio_items"

const DEFAULT_ITEMS: PortfolioItem[] = [
  {
    id: "default-1",
    src: "https://cdn.poehali.dev/projects/232bc773-606a-496d-8a58-e8c7fc46ab65/files/c8f6fa25-874b-4a13-aa05-eccaf7001c36.jpg",
    title: "Игровая сборка",
    description: "RTX 4070 + Ryzen 7 7700X",
  },
  {
    id: "default-2",
    src: "https://cdn.poehali.dev/projects/232bc773-606a-496d-8a58-e8c7fc46ab65/files/1dfe37b6-7d17-4432-ae04-f6f114fa0db2.jpg",
    title: "AMD геймерский ПК",
    description: "RX 7800 XT + Ryzen 5 7600",
  },
  {
    id: "default-3",
    src: "https://cdn.poehali.dev/projects/232bc773-606a-496d-8a58-e8c7fc46ab65/files/c8163e50-d0c2-49b9-a05a-188a086f6d8a.jpg",
    title: "Рабочая станция",
    description: "Монтаж видео и 3D",
  },
  {
    id: "default-4",
    src: "https://cdn.poehali.dev/projects/232bc773-606a-496d-8a58-e8c7fc46ab65/files/b8525a2f-4d27-4a9d-a83f-c81a0ca10f22.jpg",
    title: "Офисный ПК",
    description: "Тихая и надёжная работа",
  },
]

function loadItems(): PortfolioItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const saved = raw ? JSON.parse(raw) : []
    const savedIds = new Set(saved.map((i: PortfolioItem) => i.id))
    const defaults = DEFAULT_ITEMS.filter(d => !savedIds.has(d.id))
    return [...defaults, ...saved]
  } catch {
    return DEFAULT_ITEMS
  }
}

function saveItems(items: PortfolioItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function PortfolioSection() {
  const { ref, isVisible } = useReveal(0.2)
  const [items, setItems] = useState<PortfolioItem[]>(loadItems)
  const [selected, setSelected] = useState<PortfolioItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)

    const promises = files.map(
      (file) =>
        new Promise<PortfolioItem>((resolve) => {
          const reader = new FileReader()
          reader.onload = (ev) => {
            resolve({
              id: `${Date.now()}-${Math.random()}`,
              src: ev.target?.result as string,
              title: file.name.replace(/\.[^.]+$/, ""),
              description: "",
            })
          }
          reader.readAsDataURL(file)
        })
    )

    Promise.all(promises).then((newItems) => {
      const updated = [...items, ...newItems]
      setItems(updated)
      saveItems(updated)
      setUploading(false)
    })

    e.target.value = ""
  }

  const handleDelete = (id: string) => {
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    saveItems(updated)
    if (selected?.id === id) setSelected(null)
  }

  const startEdit = (item: PortfolioItem) => {
    setEditId(item.id)
    setEditTitle(item.title)
    setEditDesc(item.description)
  }

  const saveEdit = () => {
    const updated = items.map((i) =>
      i.id === editId ? { ...i, title: editTitle, description: editDesc } : i
    )
    setItems(updated)
    saveItems(updated)
    setEditId(null)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start flex-col px-4 pt-20 md:px-12 md:pt-0"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col py-8 md:py-16">
        {/* Header */}
        <div
          className={`mb-6 flex flex-col gap-4 transition-all duration-700 md:mb-10 md:flex-row md:items-end md:justify-between ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <div>
            <h2 className="font-sans text-3xl font-light leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Наши
              <br />
              <span className="text-foreground/40">работы</span>
            </h2>
            <p className="mt-2 font-mono text-xs text-foreground/50 md:text-sm">
              Реальные сборки наших клиентов
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-foreground/20 bg-foreground/10 px-5 py-2.5 font-sans text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-foreground/40 hover:bg-foreground/20 disabled:opacity-50"
          >
            <Icon name="Upload" size={16} />
            {uploading ? "Загрузка..." : "Добавить фото"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {items.length === 0 ? (
            <div
              className={`flex h-full flex-col items-center justify-center gap-4 transition-all duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-foreground/20 px-12 py-16 transition-all hover:border-foreground/40 hover:bg-foreground/5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
                  <Icon name="ImagePlus" size={28} className="text-foreground/60" />
                </div>
                <p className="text-center font-sans text-base text-foreground/60">
                  Нажмите, чтобы загрузить первые фото
                </p>
                <p className="font-mono text-xs text-foreground/30">PNG, JPG, WEBP — любые изображения</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 transition-all duration-500 hover:border-foreground/30 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div
                    className="aspect-square cursor-pointer overflow-hidden"
                    onClick={() => setSelected(item)}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {editId === item.id ? (
                    <div className="p-2">
                      <input
                        className="mb-1 w-full rounded bg-foreground/10 px-2 py-1 font-sans text-xs text-foreground outline-none focus:ring-1 focus:ring-foreground/30"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Название"
                      />
                      <input
                        className="mb-1 w-full rounded bg-foreground/10 px-2 py-1 font-sans text-xs text-foreground outline-none focus:ring-1 focus:ring-foreground/30"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Описание"
                      />
                      <button
                        onClick={saveEdit}
                        className="w-full rounded bg-foreground/20 px-2 py-1 font-sans text-xs text-foreground hover:bg-foreground/30"
                      >
                        Сохранить
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <p className="truncate font-sans text-xs font-medium text-foreground">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 truncate font-mono text-xs text-foreground/50">{item.description}</p>
                      )}
                      <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => startEdit(item)}
                          className="flex items-center gap-1 rounded bg-foreground/10 px-2 py-1 font-sans text-xs text-foreground/70 hover:bg-foreground/20"
                        >
                          <Icon name="Pencil" size={11} />
                          Изменить
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 font-sans text-xs text-red-400 hover:bg-red-500/20"
                        >
                          <Icon name="Trash2" size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add more tile */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-foreground/20 transition-all hover:border-foreground/40 hover:bg-foreground/5"
              >
                <Icon name="Plus" size={24} className="text-foreground/40" />
                <span className="font-mono text-xs text-foreground/40">Добавить</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative mx-4 max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.src}
              alt={selected.title}
              className="max-h-[80vh] w-full object-contain"
            />
            {(selected.title || selected.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
                <p className="font-sans text-base font-medium text-white">{selected.title}</p>
                {selected.description && (
                  <p className="font-mono text-sm text-white/70">{selected.description}</p>
                )}
              </div>
            )}
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}