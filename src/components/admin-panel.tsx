import { useState } from "react"
import Icon from "@/components/ui/icon"

const ADMIN_KEY = "sbpc_admin"
const ADMIN_PASSWORD = "sbpc2024"

interface AdminPanelProps {
  isAdmin: boolean
  onLogin: (password: string) => boolean
  onLogout: () => void
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(ADMIN_KEY) === "true"
  })

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, "true")
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem(ADMIN_KEY)
    setIsAdmin(false)
  }

  return { isAdmin, login, logout }
}

export function AdminPanel({ isAdmin, onLogin, onLogout }: AdminPanelProps) {
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (onLogin(password)) {
      setShowLogin(false)
      setPassword("")
      setError(false)
    } else {
      setError(true)
    }
  }

  if (isAdmin) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-green-500/40 bg-black/80 px-4 py-2 backdrop-blur-md">
        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-mono text-xs text-green-400">Режим админа</span>
        <button
          onClick={onLogout}
          className="ml-1 font-mono text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
        >
          выйти
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className="fixed bottom-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-black/60 backdrop-blur-md text-foreground/20 hover:text-foreground/50 transition-colors"
        title="Войти как администратор"
      >
        <Icon name="Lock" size={14} />
      </button>

      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) { setShowLogin(false); setError(false) } }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-foreground/20 bg-[#0d0d1a] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Icon name="Lock" size={16} className="text-foreground/50" />
                <h3 className="font-sans text-base font-light text-foreground">Вход для администратора</h3>
              </div>
              <button onClick={() => { setShowLogin(false); setError(false) }} className="text-foreground/30 hover:text-foreground/60">
                <Icon name="X" size={18} />
              </button>
            </div>

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoFocus
              className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 font-sans text-sm text-foreground placeholder-foreground/30 focus:border-foreground/50 focus:outline-none mb-3"
            />

            {error && (
              <p className="mb-3 font-mono text-xs text-red-400">Неверный пароль</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-foreground px-4 py-3 font-sans text-sm font-medium text-background hover:opacity-80 transition-opacity"
            >
              Войти
            </button>
          </div>
        </div>
      )}
    </>
  )
}