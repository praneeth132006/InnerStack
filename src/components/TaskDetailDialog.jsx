import { useState, useEffect } from "react";
import { useHabits } from "@/context/HabitContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, Calendar, Trash2, Edit2, Check, X, Target } from "lucide-react";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { Card, CardContent } from "@/components/ui/card";

const ICONS = ["🎯", "💧", "🏃", "🧘", "📚", "💊", "💪", "🥗", "🧠", "💼", "🧹", "🪴", "🎨", "🎵", "💰"];

export function TaskDetailDialog({ habit, open, onOpenChange }) {
    const { updateHabit, deleteHabit, getStreak, getAllCompletionDates } = useHabits();
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [name, setName] = useState(habit?.name || "");
    const [description, setDescription] = useState(habit?.description || "");
    const [icon, setIcon] = useState(habit?.icon || "🎯");
    const [frequency, setFrequency] = useState(habit?.frequency || "daily");

    // Reset state when habit changes
    useEffect(() => {
        if (habit) {
            setName(habit.name);
            setDescription(habit.description || "");
            setIcon(habit.icon || "🎯");
            setFrequency(habit.frequency || "daily");
        }
        setIsEditing(false);
    }, [habit, open]);

    if (!habit) return null;

    const streak = getStreak(habit.id);
    const totalCompletions = habit.history ? Object.values(habit.history).filter(Boolean).length : 0;

    // Calculate completion rate (simplified)
    const createdAt = habit.createdAt ? new Date(habit.createdAt) : new Date();
    const daysSinceCreation = Math.max(1, Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)));
    const completionRate = Math.round((totalCompletions / daysSinceCreation) * 100);

    const handleSave = async () => {
        await updateHabit(habit.id, {
            name,
            description,
            icon,
            frequency
        });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this habit? This cannot be undone.")) {
            await deleteHabit(habit.id);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-background border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-8">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <span className="text-3xl bg-primary/10 p-2 rounded-xl">{habit.icon}</span>
                            {isEditing ? "Edit Habit" : habit.name}
                        </DialogTitle>
                        {!isEditing && (
                            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                {isEditing ? (
                    <div className="space-y-6 py-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Habit Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Description (Optional)</Label>
                                <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Frequency</Label>
                                    <Select value={frequency} onValueChange={setFrequency}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="custom">Custom Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Icon</Label>
                                    <Select value={icon} onValueChange={setIcon}>
                                        <SelectTrigger>
                                            <span className="mr-2">{icon}</span>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <div className="grid grid-cols-5 gap-1 p-2">
                                                {ICONS.map((ic) => (
                                                    <div
                                                        key={ic}
                                                        className="cursor-pointer hover:bg-muted rounded p-1 text-center"
                                                        onClick={() => setIcon(ic)}
                                                    >
                                                        {ic}
                                                    </div>
                                                ))}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <div className="space-y-6 mt-4">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-muted/30 border-none">
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                    <Flame className="h-5 w-5 text-orange-500 mb-2" />
                                    <div className="text-2xl font-bold">{streak}</div>
                                    <div className="text-xs text-muted-foreground">Current Streak</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/30 border-none">
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                    <Check className="h-5 w-5 text-green-500 mb-2" />
                                    <div className="text-2xl font-bold">{totalCompletions}</div>
                                    <div className="text-xs text-muted-foreground">Total Days</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/30 border-none">
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                    <Target className="h-5 w-5 text-blue-500 mb-2" />
                                    <div className="text-2xl font-bold">{completionRate}%</div>
                                    <div className="text-xs text-muted-foreground">Completion Rate</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Description */}
                        {habit.description && (
                            <div className="bg-muted/20 p-4 rounded-lg">
                                <h4 className="text-sm font-medium mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground">{habit.description}</p>
                            </div>
                        )}

                        {/* Delete Option */}
                        <div className="pt-4 border-t">
                            <Button
                                variant="ghost"
                                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive justify-start px-0"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Habit
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
