import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { LayoutDashboard, User, LogOut, Settings } from "lucide-react"
import { AuthDialog } from "./AuthDialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar({ user, onLogout, currentPage, onNavigate }) {
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
                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden md:flex gap-1 text-sm font-medium mr-4">
                            <Button
                                variant={currentPage === "dashboard" ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => onNavigate?.("dashboard")}
                                className="gap-2"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </div>
                    )}

                    {!user && (
                        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                            <a href="#features" className="hover:text-foreground transition">Features</a>
                            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <ModeToggle />

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border">
                                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                                            {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onNavigate?.("profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onNavigate?.("dashboard")}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button size="sm" onClick={() => onNavigate?.("auth")}>Sign In</Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
