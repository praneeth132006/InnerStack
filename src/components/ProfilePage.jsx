import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Target, Flame, Calendar, Moon, Sun, Mail, Phone, MapPin, Send, HelpCircle, FileText, Settings, LogOut, LayoutDashboard, Share2 } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ProfilePage({ user, onLogout }) {
    const { habits, getAllCompletionDates } = useHabits();
    const { theme, setTheme } = useTheme();

    const completions = getAllCompletionDates();
    const totalCompletions = Object.values(completions).reduce((a, b) => a + b, 0);
    const longestStreak = Math.max(3, Math.min(totalCompletions, 30)); // Placeholder

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border">
                <div className="p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl shrink-0 border-4 border-background shadow-xl">
                        {user?.name?.charAt(0)?.toUpperCase() || <User className="h-10 w-10 text-primary" />}
                    </div>
                    <div className="text-center md:text-left space-y-2 flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{user?.name || "Guest User"}</h1>
                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                            <Mail className="h-4 w-4" /> {user?.email}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={onLogout}>
                            <LogOut className="h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/50 backdrop-blur border-muted/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{habits.length}</div>
                        <p className="text-xs text-muted-foreground">Active goals tracking</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur border-muted/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
                        <Calendar className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCompletions}</div>
                        <p className="text-xs text-muted-foreground">Total milestones reached</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur border-muted/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{longestStreak} Days</div>
                        <p className="text-xs text-muted-foreground">Keep the fire burning!</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="settings" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="help">Help & FAQ</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>Customize how InnerStack looks on your device.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4 text-muted-foreground" />
                                        <Switch
                                            checked={theme === "dark"}
                                            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                        />
                                        <Moon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data & Privacy</CardTitle>
                                <CardDescription>Manage your data and account preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Export Data</Label>
                                        <p className="text-sm text-muted-foreground">Download a copy of your habit history</p>
                                    </div>
                                    <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-2" /> Export JSON</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Help Tab */}
                    <TabsContent value="help" className="space-y-4">
                        {/* Habit Ecosystem Guide */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-xl">🌿</span> Spatial Habit Ecosystem
                                </CardTitle>
                                <CardDescription>
                                    Learn how your habits come to life as Digital Artifacts on your dashboard.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="eco-1">
                                        <AccordionTrigger>What is the Habit Ecosystem?</AccordionTrigger>
                                        <AccordionContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                            <p>
                                                The <strong className="text-foreground">Spatial Habit Ecosystem</strong> is a visual dashboard feature that transforms your habit tracking into a living, breathing work of generative art.
                                            </p>
                                            <p>
                                                Instead of boring lists and charts, each of your <strong className="text-foreground">habit categories</strong> is represented by a unique <strong className="text-foreground">Digital Artifact</strong> — a glowing, animated shape that grows, changes color, and pulses based on how consistently you complete your habits.
                                            </p>
                                            <p>
                                                The more consistent you are, the more alive your ecosystem becomes — with brighter artifacts, denser particle effects, and higher vitality scores.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="eco-2">
                                        <AccordionTrigger>What are the Digital Artifacts?</AccordionTrigger>
                                        <AccordionContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                            <p>Each habit category has its own unique artifact shape and color palette:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                                    <span className="text-lg">💎</span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground">Vitality Crystal</p>
                                                        <p className="text-xs">Health & Fitness — green crystal</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                                    <span className="text-lg">🪷</span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground">Zen Lotus</p>
                                                        <p className="text-xs">Mindfulness — purple flower</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                                    <span className="text-lg">🗿</span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground">Focus Monolith</p>
                                                        <p className="text-xs">Productivity — blue tower</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                                    <span className="text-lg">⭐</span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground">Knowledge Star</p>
                                                        <p className="text-xs">Learning — amber star</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                                    <span className="text-lg">💗</span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground">Bond Heart</p>
                                                        <p className="text-xs">Social — pink heart</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                                    <span className="text-lg">✨</span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground">Prism Gem</p>
                                                        <p className="text-xs">General — silver diamond</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="eco-3">
                                        <AccordionTrigger>How do artifacts grow?</AccordionTrigger>
                                        <AccordionContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                            <p>
                                                Each artifact goes through <strong className="text-foreground">5 growth stages</strong> based on your 30-day consistency percentage for that category:
                                            </p>
                                            <div className="space-y-1.5 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                                                    <span><strong className="text-foreground">Dormant</strong> — No habits in this category yet (faded outline only)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-red-400" />
                                                    <span><strong className="text-foreground">Seedling</strong> — Below 20% consistency (just starting to form)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                                                    <span><strong className="text-foreground">Budding</strong> — 20–49% consistency (taking shape, faint glow)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                                    <span><strong className="text-foreground">Growing</strong> — 50–79% consistency (vibrant colors, clear glow)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                                    <span><strong className="text-foreground">Thriving</strong> — 80%+ consistency (full size, bright glow, pulsing ring)</span>
                                                </div>
                                            </div>
                                            <p className="mt-2">
                                                As consistency rises, artifacts physically grow larger (up to 1.35x), their colors intensify, and they gain a glowing aura.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="eco-4">
                                        <AccordionTrigger>What is Ecosystem Vitality?</AccordionTrigger>
                                        <AccordionContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                            <p>
                                                <strong className="text-foreground">Ecosystem Vitality</strong> is the progress bar at the top of the ecosystem section. It represents the <em>average consistency</em> across all your active habit categories.
                                            </p>
                                            <p>
                                                It controls the floating particle density in the background — higher vitality means more particles, creating a more "alive" atmosphere. The gradient color also changes:
                                            </p>
                                            <div className="space-y-1 mt-2">
                                                <p>🔴 <strong className="text-foreground">0–30%</strong> — Red to orange gradient</p>
                                                <p>🟡 <strong className="text-foreground">30–60%</strong> — Gold to pink gradient</p>
                                                <p>🟢 <strong className="text-foreground">60%+</strong> — Green to purple to blue gradient</p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="eco-5">
                                        <AccordionTrigger>How do I build my ecosystem?</AccordionTrigger>
                                        <AccordionContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                            <p>Follow these steps to bring your ecosystem to life:</p>
                                            <ol className="list-decimal list-inside space-y-2 mt-2">
                                                <li><strong className="text-foreground">Create habits across different categories</strong> — Each category you add a habit to will "awaken" its dormant artifact.</li>
                                                <li><strong className="text-foreground">Check in daily</strong> — Mark your habits as completed every day. Consistency over the last 30 days determines artifact growth.</li>
                                                <li><strong className="text-foreground">Build streaks</strong> — Longer streaks mean higher consistency. The streak fire icon 🔥 appears on active categories.</li>
                                                <li><strong className="text-foreground">Diversify categories</strong> — More active categories = more glowing artifacts = higher overall vitality.</li>
                                                <li><strong className="text-foreground">Stay consistent</strong> — It only takes 24 days of check-ins in 30 days to reach "Thriving" status (80%).</li>
                                            </ol>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="eco-6">
                                        <AccordionTrigger>What are Rest Days?</AccordionTrigger>
                                        <AccordionContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                            <p>
                                                <strong className="text-foreground">Rest Days</strong> are a special frequency option you can set when creating a habit. It allows you to take 1 random day off per week without breaking your streak.
                                            </p>
                                            <p>
                                                This is perfect for habits like exercise where rest is actually beneficial. Your streak counter will skip over rest days when calculating your consistency.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* General FAQ */}
                        <Card>
                            <CardHeader>
                                <CardTitle>General FAQ</CardTitle>
                                <CardDescription>Common questions about InnerStack.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>How do I reset my progress?</AccordionTrigger>
                                        <AccordionContent>
                                            You can delete individual habits or reset your entire account data from the settings menu. Deleting a habit will also remove its history.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Is my data synced across devices?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes, if you are signed in with your account, your data is securely synced to the cloud and available on all your devices.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Can I export my data?</AccordionTrigger>
                                        <AccordionContent>
                                            Currently, we support exporting your habit history as a JSON file. We are working on adding CSV export support soon.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>What happens if I log on a non-scheduled day?</AccordionTrigger>
                                        <AccordionContent>
                                            If you try to log a habit on a day that's not part of your scheduled frequency (e.g., logging a Mon/Wed/Fri habit on a Tuesday), you'll see a confirmation dialog asking if you're sure. You can still log it — the activity will be recorded, but the day was not in your original plan.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Legal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span>Terms of Service</span>
                                        <Button variant="link" className="h-auto p-0">View</Button>
                                    </div>
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span>Privacy Policy</span>
                                        <Button variant="link" className="h-auto p-0">View</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contact Tab */}
                    <TabsContent value="contact">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Contact Info */}
                            <Card className="bg-primary text-primary-foreground border-none">
                                <CardHeader>
                                    <CardTitle>Get in Touch</CardTitle>
                                    <CardDescription className="text-primary-foreground/80">We'd love to hear from you.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5" />
                                        <span>support@innerstack.app</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5" />
                                        <span>San Francisco, CA</span>
                                    </div>
                                    <p className="text-sm opacity-80 pt-4">
                                        Our support team usually responds within 24 hours.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Contact Form */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Send us a Message</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Name</Label>
                                            <Input placeholder="Your name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input placeholder="Your email" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Select defaultValue="general">
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">General Inquiry</SelectItem>
                                                <SelectItem value="bug">Bug Report</SelectItem>
                                                <SelectItem value="feature">Feature Request</SelectItem>
                                                <SelectItem value="billing">Billing Issue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Message</Label>
                                        <Textarea placeholder="How can we help?" className="min-h-[120px]" />
                                    </div>
                                    <Button className="w-full sm:w-auto">Send Message</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

