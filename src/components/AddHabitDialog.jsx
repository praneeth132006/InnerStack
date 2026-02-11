import { useState } from "react";
import { useHabits } from "@/context/HabitContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CalendarIcon, Repeat, Settings2, Trophy, Clock, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateLocal } from "@/lib/utils";

const ICONS = ["🎯", "💪", "📚", "🏃", "🧘", "💧", "🍎", "😴", "✍️", "🎨", "💻", "🎸"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

const CHALLENGE_PRESETS = [
    { label: "1 Week", days: 7 },
    { label: "21 Days", days: 21 },
    { label: "1 Month", days: 30 },
    { label: "1 Year", days: 365 },
];

export function AddHabitDialog() {
    const { addHabit } = useHabits();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("🎯");
    const [frequency, setFrequency] = useState("daily");
    const [customDays, setCustomDays] = useState([]);
    const [targetDate, setTargetDate] = useState(null);
    const [category, setCategory] = useState("general");
    const [challengeDays, setChallengeDays] = useState(7);
    const [isCustomChallenge, setIsCustomChallenge] = useState(false);
    const [betStake, setBetStake] = useState(0);
    const [betDeadline, setBetDeadline] = useState(null);

    const resetForm = () => {
        setStep(1);
        setName("");
        setDescription("");
        setIcon("🎯");
        setFrequency("daily");
        setCustomDays([]);
        setTargetDate(null);
        setCategory("general");
        setChallengeDays(7);
        setIsCustomChallenge(false);
        setBetStake(0);
        setBetDeadline(null);
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        addHabit({
            name,
            description,
            icon,
            frequency,
            customDays,
            targetDate: targetDate ? formatDateLocal(targetDate) : null,
            category,
            duration: frequency === "challenge" ? challengeDays : null,
            bet: betStake > 0 ? {
                stake: betStake,
                deadline: betDeadline ? formatDateLocal(betDeadline) : formatDateLocal(new Date(Date.now() + 86400000)), // tomorrow
                resolved: false,
                won: false
            } : null,
        });
        resetForm();
        setOpen(false);
    };

    const toggleCustomDay = (dayIndex) => {
        setCustomDays((prev) =>
            prev.includes(dayIndex)
                ? prev.filter((d) => d !== dayIndex)
                : [...prev, dayIndex]
        );
    };

    const FREQUENCY_OPTIONS = [
        {
            value: "daily",
            label: "Daily",
            description: "Every single day",
            icon: Repeat,
            color: "text-blue-500",
        },
        {
            value: "custom",
            label: "Custom Days",
            description: "Select which days to log",
            icon: Settings2,
            color: "text-emerald-500",
        },
        {
            value: "challenge",
            label: "Challenge Yourself",
            description: "Set a goal for a specific period",
            icon: Flag,
            color: "text-purple-500",
        },
        {
            value: "till-date",
            label: "Till Date",
            description: "Log daily till a target date",
            icon: Clock,
            color: "text-amber-500",
        },
    ];

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" /> Add Habit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 && "New Habit"}
                        {step === 2 && "Set Frequency"}
                        {step === 3 && "Accountability Bet"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1 && "What habit do you want to build?"}
                        {step === 2 && "How often will you do this?"}
                        {step === 3 && (
                            <div className="flex flex-col gap-1">
                                <span>Optional: Stake points to stay committed.</span>
                                <span className="text-xs text-muted-foreground font-normal">You can skip this step if you don't want to bet.</span>
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Habit Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Morning Meditation"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                                id="description"
                                placeholder="Why is this important?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Icon</Label>
                            <div className="flex flex-wrap gap-2">
                                {ICONS.map((i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setIcon(i)}
                                        className={cn(
                                            "text-2xl p-2 rounded-lg border-2 transition-all",
                                            icon === i ? "border-primary bg-primary/10" : "border-transparent hover:bg-muted"
                                        )}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="health">Health & Fitness</SelectItem>
                                    <SelectItem value="productivity">Productivity</SelectItem>
                                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                                    <SelectItem value="learning">Learning</SelectItem>
                                    <SelectItem value="social">Social</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-4 py-4">
                        <RadioGroup value={frequency} onValueChange={setFrequency} className="grid gap-2.5">
                            {FREQUENCY_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                return (
                                    <label
                                        key={opt.value}
                                        htmlFor={`freq-${opt.value}`}
                                        className={cn(
                                            "flex items-center gap-3.5 rounded-xl border-2 p-3.5 cursor-pointer transition-all",
                                            frequency === opt.value
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-border hover:bg-muted/50 hover:border-muted-foreground/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
                                            frequency === opt.value ? "bg-primary/15" : "bg-muted"
                                        )}>
                                            <Icon className={cn("h-4.5 w-4.5", opt.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-sm">{opt.label}</span>
                                            <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                                        </div>
                                        <RadioGroupItem value={opt.value} id={`freq-${opt.value}`} className="shrink-0" />
                                    </label>
                                );
                            })}
                        </RadioGroup>

                        {frequency === "custom" && (
                            <div className="mt-1 p-3.5 rounded-lg bg-muted/30 border">
                                <Label className="text-xs text-muted-foreground mb-3 block">Repeat on</Label>
                                <div className="flex gap-2">
                                    {DAYS.map((day, idx) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleCustomDay(idx)}
                                            className={cn(
                                                "w-10 h-10 rounded-full text-xs font-semibold transition-all flex items-center justify-center",
                                                customDays.includes(idx)
                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                    : "bg-background border border-input text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            {DAY_LETTERS[idx]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {frequency === "challenge" && (
                            <div className="space-y-4 mt-1 p-3.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
                                <div className="flex items-start gap-2.5 mb-2">
                                    <Trophy className="h-4 w-4 text-purple-500 mt-0.5" />
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Complete this challenge to earn a special badge!
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {CHALLENGE_PRESETS.map((preset) => (
                                        <Button
                                            key={preset.days}
                                            type="button"
                                            variant={challengeDays === preset.days && !isCustomChallenge ? "default" : "outline"}
                                            className="text-xs h-9"
                                            onClick={() => {
                                                setChallengeDays(preset.days);
                                                setIsCustomChallenge(false);
                                            }}
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}
                                    <Button
                                        type="button"
                                        variant={isCustomChallenge ? "default" : "outline"}
                                        className="text-xs h-9"
                                        onClick={() => setIsCustomChallenge(true)}
                                    >
                                        Custom
                                    </Button>
                                </div>

                                {isCustomChallenge && (
                                    <div className="pt-2">
                                        <Label className="text-xs text-muted-foreground mb-1.5 block">Number of days</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={999}
                                            value={challengeDays}
                                            onChange={(e) => setChallengeDays(Math.max(1, Number(e.target.value)))}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {frequency === "till-date" && (
                            <div className="grid gap-2 mt-1 p-3 rounded-lg bg-muted/30 border">
                                <Label className="text-xs text-muted-foreground">Log daily until</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("justify-start text-left font-normal h-9", !targetDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {targetDate ? targetDate.toLocaleDateString() : "Select end date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={targetDate} onSelect={setTargetDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="grid gap-6 py-6">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                            <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-1">Double Support</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Win your bet → Get 2x points + 1 Rest Day Token.
                                    <br />
                                    Lose your bet → Points are forfeited.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="stake" className="text-sm font-medium">Points to Stake</Label>
                            <Input
                                id="stake"
                                type="number"
                                placeholder="0"
                                value={betStake}
                                onChange={(e) => setBetStake(Math.max(0, Number(e.target.value)))}
                                className="h-11 text-lg font-bold"
                            />
                            <p className="text-[10px] text-muted-foreground">You currently have 500 points.</p>
                        </div>

                        <div className="grid gap-3">
                            <Label className="text-sm font-medium">Deadline for first completion</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("justify-start text-left font-normal h-11", !betDeadline && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {betDeadline ? betDeadline.toLocaleDateString() : "Select deadline date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={betDeadline} onSelect={setBetDeadline} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                )}

                <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                            Back
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    <div className="flex gap-2">
                        {step === 3 && (
                            <Button variant="secondary" onClick={() => { setBetStake(0); handleSubmit(); }}>
                                Skip & Create
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button onClick={() => setStep((s) => s + 1)} disabled={step === 1 && !name.trim()}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit}>Create with Bet</Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
