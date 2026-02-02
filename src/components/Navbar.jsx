import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { LayoutDashboard, User } from "lucide-react"

export function Navbar({ user, onLogin, onLogout, currentPage, onNavigate }) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <button
                    onClick={() => onNavigate?.("dashboard")}
                    className="text-2xl font-bold text-primary hover:opacity-80 transition"
                >
                    InnerStack
                </button>
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="hidden md:flex gap-1 text-sm font-medium">
                            <Button
                                variant={currentPage === "dashboard" ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => onNavigate?.("dashboard")}
                                className="gap-2"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Button>
                            <Button
                                variant={currentPage === "profile" ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => onNavigate?.("profile")}
                                className="gap-2"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </Button>
                        </div>
                    )}
                    {!user && (
                        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                            <a href="#features" className="hover:text-primary transition">Features</a>
                            <a href="#pricing" className="hover:text-primary transition">Pricing</a>
                            <a href="#about" className="hover:text-primary transition">About</a>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    {user ? (
                        <Button onClick={onLogout} variant="outline" size="sm">
                            Logout
                        </Button>
                    ) : (
                        <Button onClick={onLogin} size="sm">
                            Get Started
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}
