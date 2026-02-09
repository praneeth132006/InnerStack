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
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                                <CardDescription>Find answers to common questions about InnerStack.</CardDescription>
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

