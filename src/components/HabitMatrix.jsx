import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval as eachDayOfIntervalDateFns } from "date-fns";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useHabits } from "@/context/HabitContext";
import { cn } from "@/lib/utils";

export function HabitMatrix({ habits, mode = "month" }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const days = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                        Performance Matrix
                    </p>
                </div>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shadow-2xl">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevMonth}
                        className="h-8 w-8 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all active:scale-90"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextMonth}
                        className="h-8 w-8 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all active:scale-90"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-[#0b0c0e]/50 rounded-[32px] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-6 text-left min-w-[180px] bg-[#0b0c0e]/80 sticky left-0 z-20">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HABIT / ROUTINE</span>
                                </th>
                                {days.map(day => {
                                    const isTodayDate = isToday(day);
                                    return (
                                        <th key={day.toString()} className={cn(
                                            "p-3 min-w-[44px] text-center transition-colors duration-500",
                                            isTodayDate ? "bg-primary/10" : ""
                                        )}>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-tighter",
                                                    isTodayDate ? "text-primary" : "text-slate-600"
                                                )}>
                                                    {format(day, "EEE")[0]}
                                                </span>
                                                <span className={cn(
                                                    "text-sm font-black",
                                                    isTodayDate ? "text-white" : "text-slate-400"
                                                )}>
                                                    {format(day, "d")}
                                                </span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit, habitIdx) => (
                                <tr key={habit.id} className={cn(
                                    "group transition-colors duration-300",
                                    habitIdx % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent",
                                    "hover:bg-white/[0.03]"
                                )}>
                                    <td className="p-6 bg-[#0b0c0e]/80 sticky left-0 z-20 border-r border-white/5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl grayscale group-hover:grayscale-0 transition-all duration-500">{habit.icon || "🎯"}</span>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{habit.name}</span>
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{habit.category || "General"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {days.map(day => {
                                        const dateStr = format(day, "yyyy-MM-dd");
                                        const isCompleted = habit.history?.[dateStr];
                                        const isTodayDate = isToday(day);

                                        return (
                                            <td key={dateStr} className={cn(
                                                "p-1 text-center border-r border-white/5 last:border-r-0 transition-colors duration-500",
                                                isTodayDate ? "bg-primary/5" : ""
                                            )}>
                                                <div className="flex items-center justify-center py-4">
                                                    {isCompleted ? (
                                                        <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-in zoom-in-50 duration-500">
                                                            <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                                                        </div>
                                                    ) : (
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full transition-all duration-500",
                                                            isTodayDate ? "bg-primary/40" : "bg-white/10 group-hover:bg-white/20"
                                                        )} />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend / Stats */}
            <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Record</span>
                </div>
            </div>
        </div>
    );
}
