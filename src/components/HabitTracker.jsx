import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export function HabitTracker() {
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem("innerstack-habits")
        return saved ? JSON.parse(saved) : []
    })
    const [newHabit, setNewHabit] = useState("")

    useEffect(() => {
        localStorage.setItem("innerstack-habits", JSON.stringify(habits))
    }, [habits])

    const addHabit = (e) => {
        e.preventDefault()
        if (!newHabit.trim()) return
        const habit = {
            id: Date.now(),
            name: newHabit,
            completedDates: {} // map of date string -> boolean
        }
        setHabits([...habits, habit])
        setNewHabit("")
    }

    const toggleHabit = (id) => {
        const today = new Date().toISOString().split('T')[0]
        setHabits(habits.map(h => {
            if (h.id === id) {
                const isCompleted = !!h.completedDates[today]
                const newCompleted = { ...h.completedDates }
                if (isCompleted) {
                    delete newCompleted[today]
                } else {
                    newCompleted[today] = true
                }
                return { ...h, completedDates: newCompleted }
            }
            return h
        }))
    }

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id))
    }

    const today = new Date().toISOString().split('T')[0]

    return (
        <Card className="w-full max-w-3xl mx-auto mt-8 border-none shadow-md bg-card/60 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Daily Habits</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={addHabit} className="flex gap-2 mb-8">
                    <Input
                        placeholder="Add a new habit (e.g., Drink water, Read 30 mins)..."
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        className="flex-1 h-12 text-lg"
                    />
                    <Button type="submit" size="lg" className="h-12 px-6">
                        <Plus className="mr-2 h-5 w-5" /> Add
                    </Button>
                </form>

                <div className="space-y-4">
                    {habits.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg border-muted">
                            <p className="text-muted-foreground text-lg">
                                No habits yet. Start your journey by adding one!
                            </p>
                        </div>
                    )}
                    {habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="flex items-center justify-between p-4 border rounded-xl bg-card hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-4">
                                <Checkbox
                                    checked={!!habit.completedDates[today]}
                                    onCheckedChange={() => toggleHabit(habit.id)}
                                    id={`habit-${habit.id}`}
                                    className="w-6 h-6 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary/50"
                                />
                                <label
                                    htmlFor={`habit-${habit.id}`}
                                    className={`text-lg font-medium cursor-pointer transition-all ${habit.completedDates[today]
                                            ? "line-through text-muted-foreground decoration-primary/50 decoration-2"
                                            : "text-foreground"
                                        }`}
                                >
                                    {habit.name}
                                </label>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteHabit(habit.id)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
