import { useState } from "react";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, Users, Share2, Copy, Zap, Globe, Lock, Crown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const GLOBAL_CHALLENGES = [
    {
        id: "winter-arc",
        title: "Winter Arc",
        description: "The ultimate end-of-year grind. Commit to 3 core habits to finish the year strong.",
        participants: "12.5k",
        duration: "30 Days",
        icon: "❄️",
        color: "bg-blue-500/10 border-blue-500/20",
        btnColor: "bg-blue-600 hover:bg-blue-700",
        habits: [
            { name: "Morning Workout", icon: "💪", frequency: "daily" },
            { name: "Read 10 Pages", icon: "📚", frequency: "daily" },
            { name: "No Sugar", icon: "🚫", frequency: "daily" }
        ]
    },
    {
        id: "monk-mode",
        title: "Monk Mode",
        description: "Pure focus. Eliminate distractions and build deep work capability.",
        participants: "8.2k",
        duration: "21 Days",
        icon: "🧘",
        color: "bg-amber-500/10 border-amber-500/20",
        btnColor: "bg-amber-600 hover:bg-amber-700",
        habits: [
            { name: "Deep Work (4h)", icon: "🧠", frequency: "daily" },
            { name: "Meditation", icon: "🧘", frequency: "daily" },
            { name: "No Social Media", icon: "📵", frequency: "daily" }
        ]
    },
    {
        id: "75-hard",
        title: "75 Hard",
        description: "The mental toughness challenge. No compromises, no excuses.",
        participants: "45k",
        duration: "75 Days",
        icon: "🔥",
        color: "bg-red-500/10 border-red-500/20",
        btnColor: "bg-red-600 hover:bg-red-700",
        habits: [
            { name: "2 Workouts", icon: "🏋️", frequency: "daily" },
            { name: "Read 10 Pages", icon: "📖", frequency: "daily" },
            { name: "Drink 1 Gallon Water", icon: "💧", frequency: "daily" }
        ]
    }
];

export function SocialPage() {
    const { addHabit, userStats } = useHabits();
    const [inviteCode, setInviteCode] = useState("");
    const [copied, setCopied] = useState(false);

    const generateInvite = () => {
        // Mock invite generation
        const code = "JOIN-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        setInviteCode(code);
    };

    const copyToClipboard = () => {
        if (!inviteCode) return;
        navigator.clipboard.writeText(`Join my InnerStack Challenge! Use code: ${inviteCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const joinChallenge = (challenge) => {
        if (confirm(`Join the ${challenge.title} challenge? This will add ${challenge.habits.length} habits to your dashboard.`)) {
            challenge.habits.forEach(h => {
                addHabit({
                    name: h.name,
                    icon: h.icon,
                    frequency: "challenge",
                    duration: parseInt(challenge.duration),
                    category: "general"
                });
            });
            alert(`Welcome to the ${challenge.title}! Time to lock in. 🔒`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        Social Hub <Globe className="h-6 w-6 text-primary" />
                    </h1>
                    <p className="text-muted-foreground">
                        Join global movements or challenge your friends.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-bold">{12543 + (userStats?.points || 0)}</span>
                    <span className="text-xs text-muted-foreground">Builders Online</span>
                </div>
            </div>

            <Tabs defaultValue="explore" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
                    <TabsTrigger value="explore">Global Challenges</TabsTrigger>
                    <TabsTrigger value="friends">Friend Zone</TabsTrigger>
                </TabsList>

                <TabsContent value="explore" className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {GLOBAL_CHALLENGES.map((challenge) => (
                            <Card key={challenge.id} className={cn("overflow-hidden transition-all hover:shadow-lg border-2", challenge.color)}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-4xl">{challenge.icon}</span>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/50 text-xs font-medium border shadow-sm">
                                            <Users className="h-3 w-3" /> {challenge.participants}
                                        </div>
                                    </div>
                                    <CardTitle>{challenge.title}</CardTitle>
                                    <CardDescription>{challenge.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Habits included</div>
                                        {challenge.habits.map((h, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm bg-background/50 p-2 rounded border">
                                                <span>{h.icon}</span>
                                                <span>{h.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" /> Duration: <span className="font-semibold text-foreground">{challenge.duration}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className={cn("w-full gap-2", challenge.btnColor)} onClick={() => joinChallenge(challenge)}>
                                        Join Challenge <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="friends">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Create Challenge */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-amber-500" /> Challenge a Friend
                                </CardTitle>
                                <CardDescription>
                                    Create a custom accountability pact and generate a link to share.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-muted/30 rounded-xl border-dashed border-2 flex flex-col items-center justify-center text-center gap-3">
                                    {inviteCode ? (
                                        <>
                                            <div className="text-3xl font-mono font-bold tracking-widest text-primary animate-in zoom-in">
                                                {inviteCode}
                                            </div>
                                            <p className="text-xs text-muted-foreground">Share this code with your friend</p>
                                        </>
                                    ) : (
                                        <div className="py-6">
                                            <Crown className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">Click generate to create a unique challenge link</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={generateInvite} className="flex-1" variant={inviteCode ? "outline" : "default"}>
                                        {inviteCode ? "Regenerate" : "Generate Code"}
                                    </Button>
                                    {inviteCode && (
                                        <Button onClick={copyToClipboard} className="gap-2">
                                            {copied ? "Copied!" : <><Copy className="h-4 w-4" /> Copy</>}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Join Challenge */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-emerald-500" /> Join Existing
                                </CardTitle>
                                <CardDescription>
                                    Enter a code from a friend to sync your habits.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Invite Code</label>
                                    <Input placeholder="ENTER-CODE-HERE" className="font-mono uppercase" />
                                </div>
                                <Button className="w-full" variant="secondary">
                                    Validate Code
                                </Button>
                            </CardContent>
                            <CardFooter className="bg-muted/20 border-t pt-4">
                                <p className="text-xs text-muted-foreground text-center w-full">
                                    Joining a challenge will add the shared habits to your dashboard automatically.
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Clock({ className }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
