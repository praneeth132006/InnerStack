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
import { Plus, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = ["🎯", "💪", "📚", "🏃", "🧘", "💧", "🍎", "😴", "✍️", "🎨", "💻", "🎸"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

    const resetForm = () => {
        setStep(1);
        setName("");
        setDescription("");
        setIcon("🎯");
        setFrequency("daily");
        setCustomDays([]);
        setTargetCount(3);
        setTargetDate(null);
        setTargetDate(null);
        setCategory(category);
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
            targetDate: targetDate ? targetDate.toISOString().split("T")[0] : null,
            category,
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

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" /> Add Habit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
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
                        <RadioGroup value={frequency} onValueChange={setFrequency} className="grid gap-3">
                            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="daily" id="daily" />
                                <Label htmlFor="daily" className="flex-1 cursor-pointer">
                                    <span className="font-medium">Daily</span>
                                    <p className="text-sm text-muted-foreground">Every single day</p>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="weekly" id="weekly" />
                                <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                                    <span className="font-medium">Weekly</span>
                                    <p className="text-sm text-muted-foreground">A set number of times per week</p>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="custom" id="custom" />
                                <Label htmlFor="custom" className="flex-1 cursor-pointer">
                                    <span className="font-medium">Custom Days</span>
                                    <p className="text-sm text-muted-foreground">e.g., Mon, Wed, Fri</p>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="one-time" id="one-time" />
                                <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                                    <span className="font-medium">One-time</span>
                                    <p className="text-sm text-muted-foreground">A single goal on a specific date</p>
                                </Label>
                            </div>
                        </RadioGroup>

                        {frequency === "weekly" && (
                            <div className="grid gap-2 mt-2">
                                <Label>Times per week</Label>
                                <Select value={String(targetCount)} onValueChange={(v) => setTargetCount(Number(v))}>
                                    <SelectTrigger>
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

                        {frequency === "custom" && (
                            <div className="grid gap-2 mt-2">
                                <Label>Select Days</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {DAYS.map((day, idx) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleCustomDay(idx)}
                                            className={cn(
                                                "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                                                customDays.includes(idx)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "border-input hover:bg-muted"
                                            )}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {frequency === "one-time" && (
                            <div className="grid gap-2 mt-2">
                                <Label>Target Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("justify-start text-left font-normal", !targetDate && "text-muted-foreground")}>
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
