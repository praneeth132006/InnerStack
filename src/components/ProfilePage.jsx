import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { User, Target, Flame, Calendar, Moon, Sun, Mail, Phone, MapPin, Send, HelpCircle, FileText } from "lucide-react";
import { useHabits } from "@/context/HabitContext";

export function ProfilePage({ user, onLogout }) {
    const { habits, getAllCompletionDates } = useHabits();
    const { theme, setTheme } = useTheme();

    const completions = getAllCompletionDates();
    const totalCompletions = Object.values(completions).reduce((a, b) => a + b, 0);

    // Calculate longest streak (simplified)
    const longestStreak = Math.max(3, Math.min(totalCompletions, 30)); // Placeholder

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500 space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Card */}
                <Card className="flex-1 border-none shadow-lg bg-card">
                    <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-8">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || <User className="h-10 w-10 text-primary" />}
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-3xl font-bold">{user?.name || "Guest User"}</h1>
                            <p className="text-muted-foreground mb-4">{user?.email}</p>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <Button variant="outline" size="sm" onClick={onLogout}>
                                    Log Out
                                </Button>
                                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                                    {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                    <Switch
                                        id="dark-mode"
                                        checked={theme === "dark"}
                                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                        className="scale-75"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 md:w-[400px]">
                    <Card className="border-none shadow-sm flex flex-col justify-center items-center p-4 text-center">
                        <Target className="h-6 w-6 text-primary mb-2" />
                        <div className="text-2xl font-bold">{habits.length}</div>
                        <div className="text-xs text-muted-foreground">Habits</div>
                    </Card>
                    <Card className="border-none shadow-sm flex flex-col justify-center items-center p-4 text-center">
                        <Calendar className="h-6 w-6 text-green-500 mb-2" />
                        <div className="text-2xl font-bold">{totalCompletions}</div>
                        <div className="text-xs text-muted-foreground">Check-ins</div>
                    </Card>
                    <Card className="border-none shadow-sm flex flex-col justify-center items-center p-4 text-center">
                        <Flame className="h-6 w-6 text-orange-500 mb-2" />
                        <div className="text-2xl font-bold">{longestStreak}</div>
                        <div className="text-xs text-muted-foreground">Best Streak</div>
                    </Card>
                </div>
            </div>

            {/* Contact Us Section */}
            <div className="grid lg:grid-cols-3 rounded-2xl overflow-hidden border shadow-lg">
                {/* Contact Info (Green Panel) */}
                <div className="bg-[#10B981] p-8 text-white flex flex-col justify-between min-h-[400px]">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                        <p className="text-emerald-50 mb-8">
                            Explore new destinations, indulge in local cuisines, and immerse yourself in diverse cultures.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Phone className="h-5 w-5" />
                                <span>+1-316-555-1258</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="h-5 w-5" />
                                <span>hadams@gmail.com</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 shrink-0 mt-1" />
                                <span>802 Pension Rd, Maine 96812, USA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2 bg-card p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <Label>Your Name</Label>
                            <Input placeholder="Enter your name here..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Your Email</Label>
                            <Input placeholder="Enter your email here..." />
                        </div>
                    </div>
                    <div className="space-y-2 mb-6">
                        <Label>Your Subject</Label>
                        <Input placeholder="Enter your subject here..." />
                    </div>
                    <div className="space-y-2 mb-6">
                        <Label>Message</Label>
                        <Textarea
                            placeholder="Type here"
                            className="min-h-[120px] resize-none"
                        />
                    </div>
                    <Button className="bg-[#10B981] hover:bg-[#059669] text-white">
                        Send Message <Send className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* FAQ & Terms Section */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* FAQ */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                    </div>
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
                            <AccordionTrigger>Is InnerStack free to use?</AccordionTrigger>
                            <AccordionContent>
                                InnerStack offers a generous free tier that includes unlimited habits and basic tracking. Advanced analytics are part of our premium plan.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Terms */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Terms & Conditions</h2>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-6 text-sm text-muted-foreground space-y-4 max-h-[400px] overflow-y-auto border">
                        <p>
                            <strong>1. Acceptance of Terms:</strong> By accessing and using InnerStack, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                        <p>
                            <strong>2. User Accounts:</strong> You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                        <p>
                            <strong>3. Privacy Policy:</strong> Your use of the application is also governed by our Privacy Policy. We respect your privacy and handle your data with care.
                        </p>
                        <p>
                            <strong>4. Usage Restrictions:</strong> You agree not to misuse the services or help anyone else do so. You may not copy, modify, distribute, sell, or lease any part of our services or software.
                        </p>
                        <p>
                            <strong>5. Changes to Terms:</strong> We reserve the right to modify these terms at any time. We will provide notice of any significant changes.
                        </p>

                        <div className="pt-4 mt-4 border-t flex gap-4">
                            <Button variant="link" className="px-0">Privacy Policy</Button>
                            <Button variant="link" className="px-0">Usage Guidelines</Button>
                            <Button variant="link" className="px-0">Support</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
