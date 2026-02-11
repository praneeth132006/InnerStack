import { useState, useEffect } from "react";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Users, Share2, Copy, Zap, Globe, Lock, Crown, ArrowRight, Plus, Search, Flame, Dumbbell, Brain, Briefcase, Swords, Skull, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { createChallenge, getPublicChallenges, joinPublicChallenge, getChallengeByCode, getCreatedChallenges } from "@/lib/databaseService";

// Boss Battle Removed
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

export function SocialPage({ user }) {
    const { addHabit, userStats } = useHabits();
    const [inviteCode, setInviteCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [communityChallenges, setCommunityChallenges] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [joinCode, setJoinCode] = useState("");
    const [createdCode, setCreatedCode] = useState(null); // Code to show in modal
    const [myChallenges, setMyChallenges] = useState([]);

    // Create Challenge State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: "",
        description: "",
        category: "general",
        duration: 7,
        isPublic: false,
        habits: [{ name: "", icon: "🎯" }]
    });

    useEffect(() => {
        loadCommunityChallenges();
        if (user?.uid) {
            loadUserChallenges();
        }
    }, [user]);

    const loadCommunityChallenges = async () => {
        const challenges = await getPublicChallenges();
        setCommunityChallenges(challenges);
    };

    const loadUserChallenges = async () => {
        if (!user?.uid) return;
        const challenges = await getCreatedChallenges(user.uid);
        setMyChallenges(challenges);
    };

    const handleCreateChallenge = async () => {
        if (!newChallenge.title || !newChallenge.habits[0].name) return;

        const challenge = {
            ...newChallenge,
            creatorName: user?.name || "Anonymous",
            participants: 1,
            icon: CATEGORY_ICONS[newChallenge.category] || "🏆",
            isPublic: newChallenge.isPublic,
            code: !newChallenge.isPublic ? "PVT-" + Math.random().toString(36).substring(2, 8).toUpperCase() : null
        };

        if (newChallenge.isPublic) {
            await createChallenge(user?.uid, challenge);
            loadCommunityChallenges();
            alert("Challenge created and published to the community!");
        } else {
            // Create Private Challenge in DB
            const created = await createChallenge(user?.uid, challenge);
            setCreatedCode(created.code); // Show this in a modal
        }

        loadUserChallenges(); // Refresh my list

        // Auto-join creator
        newChallenge.habits.forEach(h => {
            addHabit({
                name: h.name,
                icon: h.icon,
                frequency: "challenge",
                duration: parseInt(newChallenge.duration),
                category: newChallenge.category
            });
        });

        setIsCreateOpen(false);
        setNewChallenge({ title: "", description: "", category: "general", duration: 7, isPublic: false, habits: [{ name: "", icon: "🎯" }] });
    };

    const CATEGORY_ICONS = {
        fitness: "💪",
        mindfulness: "🧘",
        productivity: "🚀",
        general: "🏆"
    };

    const filteredChallenges = communityChallenges.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "all" || c.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

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
            // Check if already joined (simple check: do we have habits with this frequency/category? No, duplicate allowed)
            joinPublicChallenge(challenge.id); // Increment count

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

    const handleJoinByCode = async () => {
        if (!joinCode) return;

        try {
            const challenge = await getChallengeByCode(joinCode.toUpperCase());
            if (challenge) {
                joinChallenge(challenge);
                setJoinCode("");
            } else {
                alert("Invalid code. Please check and try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error joining challenge.");
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

            {/* Code Reveal Dialog */
                createdCode && (
                    <Dialog open={!!createdCode} onOpenChange={() => setCreatedCode(null)}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Challenge Created Successfully! 🎉</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center space-y-4 py-4">
                                <p className="text-center text-muted-foreground">
                                    Share this code with your friends so they can join your challenge.
                                </p>
                                <div className="text-4xl font-mono font-bold tracking-widest text-primary bg-muted p-4 rounded-xl border border-primary/20 w-full text-center select-all">
                                    {createdCode}
                                </div>
                                <Button
                                    className="w-full gap-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(createdCode);
                                        alert("Code copied to clipboard!");
                                    }}
                                >
                                    <Copy className="h-4 w-4" /> Copy Code
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

            <Tabs defaultValue="explore" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
                    <TabsTrigger value="explore">Explore</TabsTrigger>
                    <TabsTrigger value="friends">Friend Zone</TabsTrigger>
                </TabsList>

                <TabsContent value="explore" className="space-y-8">
                    {/* Actions & Filters */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/30 p-4 rounded-xl border">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search challenges..."
                                className="pl-10 bg-background"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                            <Button
                                variant={activeCategory === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategory("all")}
                                className="rounded-full"
                            >
                                All
                            </Button>
                            {["fitness", "mindfulness", "productivity"].map(cat => (
                                <Button
                                    key={cat}
                                    variant={activeCategory === cat ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveCategory(cat)}
                                    className="capitalize rounded-full"
                                >
                                    {cat === "fitness" && <Dumbbell className="h-3 w-3 mr-1" />}
                                    {cat === "mindfulness" && <Brain className="h-3 w-3 mr-1" />}
                                    {cat === "productivity" && <Briefcase className="h-3 w-3 mr-1" />}
                                    {cat}
                                </Button>
                            ))}
                        </div>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 whitespace-nowrap">
                                    <Plus className="h-4 w-4" /> Create Challenge
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create New Challenge</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Challenge Title</Label>
                                        <Input
                                            placeholder="e.g. Morning 5K Run"
                                            value={newChallenge.title}
                                            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Select
                                                value={newChallenge.category}
                                                onValueChange={(val) => setNewChallenge({ ...newChallenge, category: val })}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">General</SelectItem>
                                                    <SelectItem value="fitness">Fitness</SelectItem>
                                                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                                                    <SelectItem value="productivity">Productivity</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Duration (Days)</Label>
                                            <Input
                                                type="number"
                                                value={newChallenge.duration}
                                                onChange={(e) => setNewChallenge({ ...newChallenge, duration: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Core Habit</Label>
                                        <Input
                                            placeholder="Habit Name"
                                            value={newChallenge.habits[0].name}
                                            onChange={(e) => {
                                                const habits = [...newChallenge.habits];
                                                habits[0].name = e.target.value;
                                                setNewChallenge({ ...newChallenge, habits });
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 mb-2">
                                        <input
                                            type="checkbox"
                                            id="public"
                                            checked={newChallenge.isPublic}
                                            onChange={(e) => setNewChallenge({ ...newChallenge, isPublic: e.target.checked })}
                                            className="rounded border-gray-300 h-4 w-4"
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="public" className="cursor-pointer font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Make Public (List on Explore)
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Uncheck to create a private challenge with an invite code.
                                            </p>
                                        </div>
                                    </div>
                                    <Button onClick={handleCreateChallenge} className="w-full mt-2">
                                        {newChallenge.isPublic ? "Launch to World 🌍" : "Create Private Group 🔒"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* InnerStack Originals */}
                    {activeCategory === "all" && !searchQuery && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Crown className="h-5 w-5 text-yellow-500" /> InnerStack Originals
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {GLOBAL_CHALLENGES.map((challenge) => (
                                    <ChallengeCard key={challenge.id} challenge={challenge} onJoin={joinChallenge} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Community Stream */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-500" /> Community Creations
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredChallenges.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border-dashed border-2">
                                    <Trophy className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    <p>No community challenges found matching your filters.</p>
                                    <Button variant="link" onClick={() => setIsCreateOpen(true)}>Create one now!</Button>
                                </div>
                            ) : (
                                filteredChallenges.map((challenge) => (
                                    <ChallengeCard key={challenge.id} challenge={challenge} onJoin={joinChallenge} isCommunity />
                                ))
                            )}
                        </div>
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
                                    <Input
                                        placeholder="ENTER-CODE-HERE"
                                        className="font-mono uppercase"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full" variant="secondary" onClick={handleJoinByCode} disabled={!joinCode}>
                                    Validate & Join
                                </Button>
                            </CardContent>
                            <CardFooter className="bg-muted/20 border-t pt-4">
                                <p className="text-xs text-muted-foreground text-center w-full">
                                    Joining a challenge will add the shared habits to your dashboard automatically.
                                </p>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* My Challenges List */}
                    {myChallenges.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Crown className="h-5 w-5 text-yellow-500" /> My Active Challenges
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {myChallenges.map((challenge) => (
                                    <Card key={challenge.id} className="bg-muted/20 border-l-4 border-l-primary">
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <div className="font-bold flex items-center gap-2">
                                                    {challenge.title}
                                                    {!challenge.isPublic && <Lock className="h-3 w-3 text-muted-foreground" />}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {challenge.participants} Participant{challenge.participants !== 1 && 's'} • {challenge.duration} Days
                                                </div>
                                                {!challenge.isPublic && challenge.code && (
                                                    <div className="mt-2 p-1.5 bg-background rounded border font-mono text-xs flex items-center gap-2 w-fit">
                                                        <span className="select-all font-bold tracking-wider">{challenge.code}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-5 w-5"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(challenge.code);
                                                                alert("Copied!");
                                                            }}
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-2xl opacity-50">{challenge.icon || "🏆"}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ChallengeCard({ challenge, onJoin, isCommunity }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Card className={cn("overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group h-full flex flex-col", challenge.color || "border-border")}>
                    <CardHeader className="pb-3 flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{challenge.icon || "🏆"}</span>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/50 text-xs font-medium border shadow-sm text-foreground">
                                <Users className="h-3 w-3" /> {challenge.participants}
                            </div>
                        </div>
                        {isCommunity && challenge.participants > 10 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full w-fit mb-2">
                                <Flame className="h-3 w-3" /> TRENDING
                            </span>
                        )}
                        <CardTitle className="leading-tight">{challenge.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{challenge.description || "Join this community challenge!"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isCommunity && (
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">Core Habits</div>
                                <div className="flex flex-wrap gap-1">
                                    {challenge.habits.slice(0, 3).map((h, i) => (
                                        <span key={i} className="text-xs bg-muted/50 px-2 py-1 rounded-md border text-muted-foreground">
                                            {h.icon} {h.name}
                                        </span>
                                    ))}
                                    {challenge.habits.length > 3 && <span className="text-xs text-muted-foreground self-center">+{challenge.habits.length - 3}</span>}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-3">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {challenge.duration}d</span>
                            {isCommunity && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {challenge.category}</span>}
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-5xl">{challenge.icon || "🏆"}</span>
                        <div>
                            <DialogTitle className="text-2xl">{challenge.title}</DialogTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium text-xs">{challenge.participants} Builders</span>
                                <span>•</span>
                                <span>{challenge.duration} Days</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <p className="text-muted-foreground">{challenge.description || "Ready to change your life? Join this challenge and commit to consistency."}</p>

                    <div className="space-y-2 border rounded-lg p-4 bg-muted/20">
                        <h4 className="font-medium flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> Challenge Habits</h4>
                        <ul className="space-y-2">
                            {challenge.habits.map((h, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm bg-background p-2 rounded-md border shadow-sm">
                                    <span className="text-xl">{h.icon}</span>
                                    <span className="font-medium">{h.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button className="w-full gap-2 text-lg h-12" onClick={() => {
                        onJoin(challenge);
                        setOpen(false);
                    }}>
                        Accept Challenge <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
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
