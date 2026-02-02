import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Dashboard } from "@/components/Dashboard"
import { ProfilePage } from "@/components/ProfilePage"

function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState("dashboard") // "dashboard" or "profile"

  const handleLogin = () => {
    setUser({ name: "Demo User" })
    setPage("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setPage("dashboard")
  }

  const renderPage = () => {
    if (!user) return <Hero />
    if (page === "profile") return <ProfilePage user={user} onLogout={handleLogout} />
    return <Dashboard user={user} />
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentPage={page}
        onNavigate={setPage}
      />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  )
}

export default App

