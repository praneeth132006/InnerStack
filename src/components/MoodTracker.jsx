import { useState } from "react";
import { useHabits } from "@/context/HabitContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Frown, Meh, Zap, Brain } from "lucide-react";

const MOODS = [
    { value: 1, icon: Frown, label: "Bad", color: "text-red-500" },
    { value: 2, icon: Frown, label: "Low", color: "text-orange-500" },
    { value: 3, icon: Meh, label: "Okay", color: "text-yellow-500" },
    { value: 4, icon: Smile, label: "Good", color: "text-lime-500" },
    { value: 5, icon: Smile, label: "Great", color: "text-green-500" },
];

export function MoodTracker() {
    const { getDailyLog, logDailyStats } = useHabits();
    const today = new Date().toISOString().split("T")[0];
    const log = getDailyLog(today);

    const [mood, setMood] = useState(log?.mood || 3);
    const [energy, setEnergy] = useState(log?.energy || 50);
    const [stress, setStress] = useState(log?.stress || 50);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        logDailyStats(today, { mood, energy, stress });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <Card className="border-none shadow-md bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    How are you feeling today?
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Mood Selection */}
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Mood</p>
                    <div className="flex justify-between gap-2">
                        {MOODS.map((m) => {
                            const Icon = m.icon;
                            return (
                                <button
                                    key={m.value}
                                    onClick={() => setMood(m.value)}
                                    className={`flex-1 flex flex-col items-center py-3 rounded-xl border-2 transition-all ${mood === m.value
                                            ? "border-primary bg-primary/10"
                                            : "border-transparent bg-muted/50 hover:bg-muted"
                                        }`}
                                >
                                    <Icon className={`h-6 w-6 ${mood === m.value ? m.color : "text-muted-foreground"}`} />
                                    <span className="text-xs mt-1">{m.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Energy Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Zap className="h-4 w-4" /> Energy
                        </p>
                        <span className="text-sm font-medium">{energy}%</span>
                    </div>
                    <Slider
                        value={[energy]}
                        onValueChange={(v) => setEnergy(v[0])}
                        max={100}
                        step={5}
                        className="[&>span:first-child]:bg-yellow-500"
                    />
                </div>

                {/* Stress Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">😵‍💫 Stress</p>
                        <span className="text-sm font-medium">{stress}%</span>
                    </div>
                    <Slider
                        value={[stress]}
                        onValueChange={(v) => setStress(v[0])}
                        max={100}
                        step={5}
                        className="[&>span:first-child]:bg-red-500"
                    />
                </div>

                <Button onClick={handleSave} className="w-full" variant={saved ? "secondary" : "default"}>
                    {saved ? "✓ Saved!" : "Log Today's Stats"}
                </Button>
            </CardContent>
        </Card>
    );
}
