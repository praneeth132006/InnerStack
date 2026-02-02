import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Dashboard } from "@/components/Dashboard"

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = () => {
    setUser({ name: "Demo User" })
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main>
        {user ? (
          <Dashboard user={user} />
        ) : (
          <Hero />
        )}
      </main>
    </div>
  )
}

export default App
