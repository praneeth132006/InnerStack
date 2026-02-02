import { useAuth } from "@/context/AuthContext"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Dashboard } from "@/components/Dashboard"
import { ProfilePage } from "@/components/ProfilePage"
import { useState } from "react"

function App() {
  const { user, loading, logout } = useAuth()
  const [page, setPage] = useState("dashboard")

  const handleLogout = () => {
    logout()
    setPage("dashboard")
  }

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }
    if (!user) return <Hero />
    if (page === "profile") return <ProfilePage user={user} onLogout={handleLogout} />
    return <Dashboard user={user} />
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Navbar
        user={user}
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
