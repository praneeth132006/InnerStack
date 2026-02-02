import { useState } from "react";
import { useHabits } from "@/context/HabitContext";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Target, Flame, Calendar, Palette, Moon, Sun, Check } from "lucide-react";

const THEMES = [
    {
        id: "default",
        name: "Ocean Blue",
        description: "Clean blue theme (current)",
        preview: {
            primary: "oklch(0.6723 0.1606 244.9955)",
            background: "oklch(1 0 0)",
            card: "oklch(0.9784 0.0011 197.1387)",
        },
        darkPreview: {
            primary: "oklch(0.53 0.189 19.155)",
            background: "oklch(0.201 0.002 17.289)",
            card: "oklch(0.2097 0.0080 274.5332)",
        },
    },
    {
        id: "emerald",
        name: "Emerald",
        description: "Fresh green vibes",
        preview: {
            primary: "oklch(0.70 0.18 160)",
            background: "oklch(0.99 0.01 160)",
            card: "oklch(0.95 0.02 160)",
        },
        darkPreview: {
            primary: "oklch(0.70 0.18 160)",
            background: "oklch(0.18 0.02 160)",
            card: "oklch(0.22 0.03 160)",
        },
    },
    {
        id: "sunset",
        name: "Sunset",
        description: "Warm orange tones",
        preview: {
            primary: "oklch(0.68 0.20 50)",
            background: "oklch(0.99 0.01 50)",
            card: "oklch(0.96 0.02 50)",
        },
        darkPreview: {
            primary: "oklch(0.65 0.20 50)",
            background: "oklch(0.18 0.03 50)",
            card: "oklch(0.22 0.04 50)",
        },
    },
    {
        id: "violet",
        name: "Violet Dreams",
        description: "Elegant purple aesthetic",
        preview: {
            primary: "oklch(0.60 0.20 300)",
            background: "oklch(0.99 0.01 300)",
            card: "oklch(0.96 0.02 300)",
        },
        darkPreview: {
            primary: "oklch(0.65 0.20 300)",
            background: "oklch(0.18 0.03 300)",
            card: "oklch(0.22 0.04 300)",
        },
    },
];

export function ProfilePage({ user, onLogout }) {
    const { habits, getAllCompletionDates } = useHabits();
    const { theme, setTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState("default");

    const completions = getAllCompletionDates();
    const totalCompletions = Object.values(completions).reduce((a, b) => a + b, 0);

    // Calculate longest streak (simplified)
    const longestStreak = Math.max(3, Math.min(totalCompletions, 30)); // Placeholder

    const handleThemeSelect = (themeId) => {
        setSelectedTheme(themeId);
        // In a full implementation, you'd apply the theme CSS variables here
        // For now, it's a visual selection
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            {/* Profile Header */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 via-transparent to-transparent mb-8">
                <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-8">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl">
                        {user?.name?.charAt(0)?.toUpperCase() || <User className="h-10 w-10 text-primary" />}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold">{user?.name || "Guest User"}</h1>
                        <p className="text-muted-foreground">Building better habits, one day at a time</p>
                        <Button variant="outline" size="sm" className="mt-3" onClick={onLogout}>
                            Log Out
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Habits</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{habits.length}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Check-ins</CardTitle>
                        <Calendar className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">{totalCompletions}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Best Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-500">{longestStreak} 🔥</div>
                    </CardContent>
                </Card>
            </div>

            {/* Appearance Section */}
            <Card className="border-none shadow-md mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" /> Appearance
                    </CardTitle>
                    <CardDescription>Customize how InnerStack looks for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            <div>
                                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <Switch
                            id="dark-mode"
                            checked={theme === "dark"}
                            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        />
                    </div>

                    {/* Theme Selector */}
                    <div className="pt-4 border-t">
                        <Label className="text-sm font-medium mb-3 block">Color Theme</Label>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {THEMES.map((t) => {
                                const preview = theme === "dark" ? t.darkPreview : t.preview;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => handleThemeSelect(t.id)}
                                        className={`relative flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${selectedTheme === t.id
                                                ? "border-primary bg-primary/5"
                                                : "border-muted hover:border-primary/50"
                                            }`}
                                    >
                                        {/* Color Preview */}
                                        <div className="flex gap-1">
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{ backgroundColor: preview.primary }}
                                            />
                                            <div
                                                className="w-6 h-6 rounded-full border"
                                                style={{ backgroundColor: preview.card }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{t.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.description}</p>
                                        </div>
                                        {selectedTheme === t.id && (
                                            <Check className="h-5 w-5 text-primary" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
