import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"

export function Navbar({ user, onLogin, onLogout }) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md sticky">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="text-2xl font-bold text-primary">InnerStack</div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                        {!user && (
                            <>
                                <a href="#" className="hover:text-primary transition">Features</a>
                                <a href="#" className="hover:text-primary transition">Pricing</a>
                                <a href="#" className="hover:text-primary transition">About</a>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    {user ? (
                        <Button onClick={onLogout} variant="ghost">Logout</Button>
                    ) : (
                        <Button onClick={onLogin}>Login</Button>
                    )}
                </div>
            </div>
        </nav>
    )
}
