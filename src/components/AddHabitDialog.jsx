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
import { Plus, CalendarIcon, Repeat, CalendarDays, Coffee, Target, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateLocal } from "@/lib/utils";

const ICONS = ["🎯", "💪", "📚", "🏃", "🧘", "💧", "🍎", "😴", "✍️", "🎨", "💻", "🎸"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export function AddHabitDialog() {
    const { habits, addHabit } = useHabits();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("🎯");
    const [frequency, setFrequency] = useState("daily");
    const [customDays, setCustomDays] = useState([]);
    const [targetCount, setTargetCount] = useState(3);
    const [targetDate, setTargetDate] = useState(null);
    const [category, setCategory] = useState("general");
    const [repeatInterval, setRepeatInterval] = useState(1);
    const [endsOption, setEndsOption] = useState("never");
    const [endsDate, setEndsDate] = useState(null);
    const [endsAfterCount, setEndsAfterCount] = useState(4);
    const [restDaysPerWeek, setRestDaysPerWeek] = useState(1);

    const resetForm = () => {
        setStep(1);
        setName("");
        setDescription("");
        setIcon("🎯");
        setFrequency("daily");
        setCustomDays([]);
        setTargetCount(3);
        setTargetDate(null);
        setCategory(category);
        setRepeatInterval(1);
        setEndsOption("never");
        setEndsDate(null);
        setEndsAfterCount(4);
        setRestDaysPerWeek(1);
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        addHabit({
            name,
            description,
            icon,
            frequency,
            customDays,
            targetCount,
            targetDate: targetDate ? formatDateLocal(targetDate) : null,
            category,
            repeatInterval,
            endsOption,
            endsDate: endsDate ? formatDateLocal(endsDate) : null,
            endsAfterCount,
            restDaysPerWeek: frequency === "rest-day" ? restDaysPerWeek : 0,
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
            value: "weekly",
            label: "Weekly",
            description: "A set number of times per week",
            icon: CalendarDays,
            color: "text-violet-500",
        },
        {
            value: "custom",
            label: "Custom Days",
            description: "e.g., Mon, Wed, Fri",
            icon: Settings2,
            color: "text-emerald-500",
        },
        {
            value: "rest-day",
            label: "Rest Day",
            description: "1 random rest day per week — streak preserved",
            icon: Coffee,
            color: "text-amber-500",
        },
        {
            value: "one-time",
            label: "One-time",
            description: "A single goal on a specific date",
            icon: Target,
            color: "text-rose-500",
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
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1 && "What habit do you want to build?"}
                        {step === 2 && "How often will you do this?"}
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
                        {/* Frequency options as styled cards */}
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

                        {/* Weekly: times per week */}
                        {frequency === "weekly" && (
                            <div className="grid gap-2 mt-1 p-3 rounded-lg bg-muted/30 border">
                                <Label className="text-xs text-muted-foreground">Times per week</Label>
                                <Select value={String(targetCount)} onValueChange={(v) => setTargetCount(Number(v))}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                            <SelectItem key={n} value={String(n)}>{n}x per week</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Custom Days: full options */}
                        {frequency === "custom" && (
                            <div className="space-y-4 mt-1 p-3.5 rounded-lg bg-muted/30 border">
                                {/* Repeat interval */}
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Every</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={12}
                                        value={repeatInterval}
                                        onChange={(e) => setRepeatInterval(Math.max(1, Number(e.target.value)))}
                                        className="w-16 h-8 text-center text-sm"
                                    />
                                    <Label className="text-xs text-muted-foreground">week(s)</Label>
                                </div>

                                {/* Day of week chips */}
                                <div>
                                    <Label className="text-xs text-muted-foreground mb-2 block">Repeat on</Label>
                                    <div className="flex gap-1.5">
                                        {DAYS.map((day, idx) => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleCustomDay(idx)}
                                                className={cn(
                                                    "w-9 h-9 rounded-full text-xs font-semibold transition-all flex items-center justify-center",
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

                                {/* Ends option */}
                                <div>
                                    <Label className="text-xs text-muted-foreground mb-2 block">Ends</Label>
                                    <RadioGroup value={endsOption} onValueChange={setEndsOption} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="never" id="ends-never" />
                                            <Label htmlFor="ends-never" className="text-sm cursor-pointer">Never</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="on" id="ends-on" />
                                            <Label htmlFor="ends-on" className="text-sm cursor-pointer">On</Label>
                                            {endsOption === "on" && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" size="sm" className={cn("h-8 text-xs", !endsDate && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-1.5 h-3 w-3" />
                                                            {endsDate ? endsDate.toLocaleDateString() : "Pick date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar mode="single" selected={endsDate} onSelect={setEndsDate} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="after" id="ends-after" />
                                            <Label htmlFor="ends-after" className="text-sm cursor-pointer">After</Label>
                                            {endsOption === "after" && (
                                                <div className="flex items-center gap-1.5">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={999}
                                                        value={endsAfterCount}
                                                        onChange={(e) => setEndsAfterCount(Math.max(1, Number(e.target.value)))}
                                                        className="w-16 h-8 text-center text-sm"
                                                    />
                                                    <span className="text-xs text-muted-foreground">times</span>
                                                </div>
                                            )}
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        )}

                        {/* Rest Day: explanation */}
                        {frequency === "rest-day" && (
                            <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20 mt-1">
                                <div className="flex items-start gap-2.5">
                                    <Coffee className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                    <div className="space-y-1.5">
                                        <p className="text-sm text-foreground font-medium">Rest Day Mode</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            This habit works like a daily habit, but you're allowed <strong>1 random rest day per week</strong> without breaking your streak. Perfect for exercise or intense study routines.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* One-time: target date */}
                        {frequency === "one-time" && (
                            <div className="grid gap-2 mt-1 p-3 rounded-lg bg-muted/30 border">
                                <Label className="text-xs text-muted-foreground">Target Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("justify-start text-left font-normal h-9", !targetDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {targetDate ? targetDate.toLocaleDateString() : "Pick a date"}
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

                <DialogFooter>
                    {step > 1 && (
                        <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                            Back
                        </Button>
                    )}
                    {step < 2 ? (
                        <Button onClick={() => setStep((s) => s + 1)} disabled={step === 1 && !name.trim()}>
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit}>Create Habit</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
