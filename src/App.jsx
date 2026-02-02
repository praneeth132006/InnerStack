import { useAuth } from "@/context/AuthContext"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Dashboard } from "@/components/Dashboard"
import { ProfilePage } from "@/components/ProfilePage"
import { AuthPage } from "@/components/AuthPage"
import { ErrorPage } from "@/components/ErrorPage"
import { useState } from "react"

function App() {

  const { user, loading, logout } = useAuth()
  const [page, setPage] = useState("dashboard")

  // Simple URL routing on mount
  useState(() => {
    const path = window.location.pathname
    if (path === "/auth") setPage("auth")
    else if (path === "/profile") setPage("profile")
    else if (path === "/404") setPage("error")
    else if (path !== "/" && path !== "/dashboard") {
      // Optional: Redirect unknown paths to error page?
      // For now, let's just default to dashboard/hero based on user state
      // But if we want to support 404 for real:
      // setPage("error") 
    }
  }, [])

  const handleLogout = () => {
    logout()
    setPage("dashboard")
    window.history.pushState({}, "", "/")
  }

  // Update URL when page changes
  const navigate = (newPage) => {
    setPage(newPage)
    const path = newPage === "dashboard" ? "/" : `/${newPage}`
    window.history.pushState({}, "", path)
  }

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }
    if (page === "auth") return <AuthPage onNavigate={navigate} />
    if (page === "error") return <ErrorPage onNavigate={navigate} />
    if (!user) return <Hero onNavigate={navigate} />
    if (page === "profile") return <ProfilePage user={user} onLogout={handleLogout} />
    return <Dashboard user={user} />
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Navbar
        user={user}
        onLogout={handleLogout}
        currentPage={page}
        onNavigate={navigate}
      />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
