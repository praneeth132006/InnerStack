import { useMemo, useRef, useEffect, useState, useId } from "react";
import { useHabits } from "@/context/HabitContext";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateLocal } from "@/lib/utils";
import { Sparkles, Eye, EyeOff } from "lucide-react";

// ─── Category Config ─────────────────────────────────────────────
const CATEGORY_CONFIG = {
    health: {
        label: "Health & Fitness",
        artifactName: "Vitality Crystal",
        emoji: "💎",
        baseColor: [120, 220, 160],
        glowColor: "rgba(74, 222, 128, 0.6)",
        shape: "crystal",
    },
    mindfulness: {
        label: "Mindfulness",
        artifactName: "Zen Lotus",
        emoji: "🪷",
        baseColor: [180, 130, 255],
        glowColor: "rgba(167, 139, 250, 0.6)",
        shape: "lotus",
    },
    productivity: {
        label: "Productivity",
        artifactName: "Focus Monolith",
        emoji: "🗿",
        baseColor: [100, 180, 255],
        glowColor: "rgba(96, 165, 250, 0.6)",
        shape: "monolith",
    },
    learning: {
        label: "Learning",
        artifactName: "Knowledge Star",
        emoji: "⭐",
        baseColor: [255, 200, 60],
        glowColor: "rgba(251, 191, 36, 0.6)",
        shape: "star",
    },
    social: {
        label: "Social",
        artifactName: "Bond Heart",
        emoji: "💗",
        baseColor: [255, 130, 170],
        glowColor: "rgba(244, 114, 182, 0.6)",
        shape: "heart",
    },
    general: {
        label: "General",
        artifactName: "Prism Gem",
        emoji: "✨",
        baseColor: [200, 200, 220],
        glowColor: "rgba(200, 200, 240, 0.5)",
        shape: "diamond",
    },
};

// ─── Utility: Calculate category consistency ──────────────────────
function getCategoryStats(habits, category) {
    const categoryHabits = habits.filter(h => h.category === category);
    if (categoryHabits.length === 0) return { count: 0, consistency: 0, streak: 0, totalCompletions: 0 };

    const today = new Date();
    let totalConsistency = 0;
    let bestStreak = 0;
    let totalCompletions = 0;

    categoryHabits.forEach(habit => {
        const history = habit.history || {};
        const completions = Object.values(history).filter(Boolean).length;
        totalCompletions += completions;

        let daysHit = 0;
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = formatDateLocal(d);
            if (history[dateStr]) daysHit++;
        }
        totalConsistency += daysHit / 30;

        let streak = 0;
        const date = new Date(today);
        for (let i = 0; i < 365; i++) {
            const dateStr = formatDateLocal(date);
            if (history[dateStr]) {
                streak++;
                date.setDate(date.getDate() - 1);
            } else break;
        }
        if (streak > bestStreak) bestStreak = streak;
    });

    return {
        count: categoryHabits.length,
        consistency: categoryHabits.length > 0 ? totalConsistency / categoryHabits.length : 0,
        streak: bestStreak,
        totalCompletions,
    };
}

// ─── Floating Particles Canvas ──────────────────────────────────
function ParticleField({ vitality }) {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        const count = Math.floor(25 + vitality * 80);
        particlesRef.current = Array.from({ length: count }, () => ({
            x: Math.random() * (canvas.width / dpr),
            y: Math.random() * (canvas.height / dpr),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3 - 0.12,
            size: Math.random() * 2.2 + 0.4,
            opacity: Math.random() * 0.4 + 0.1,
            hue: Math.random() * 80 + 200,
            life: Math.random() * 100,
        }));

        const animate = () => {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            ctx.clearRect(0, 0, w, h);

            particlesRef.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life += 0.3;
                p.opacity = (Math.sin(p.life * 0.04) * 0.3 + 0.25) * Math.max(0.15, vitality);

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.opacity})`;
                ctx.fill();
            });
            animRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [vitality]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}

// ─── SVG Artifact Shapes (each uses unique id prefix) ───────────
function CrystalShape({ scale, color, uid, dormant }) {
    const opacity = dormant ? 0.15 : 0.9;
    return (
        <svg viewBox="0 0 100 120" width={60 * scale} height={72 * scale}>
            <defs>
                <linearGradient id={`${uid}-cg`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`, stopOpacity: opacity }} />
                    <stop offset="100%" style={{ stopColor: `rgb(${Math.max(0, color[0] - 40)}, ${Math.max(0, color[1] - 40)}, ${Math.max(0, color[2] - 20)})`, stopOpacity: opacity }} />
                </linearGradient>
                <filter id={`${uid}-cf`}>
                    <feGaussianBlur stdDeviation={dormant ? "2" : "4"} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <polygon
                points="50,5 85,35 75,115 25,115 15,35"
                fill={`url(#${uid}-cg)`}
                filter={`url(#${uid}-cf)`}
            />
            <polygon
                points="50,5 85,35 50,50 15,35"
                fill={`rgba(${color[0] + 30}, ${color[1] + 30}, ${color[2] + 30}, ${dormant ? 0.08 : 0.35})`}
            />
            <line x1="50" y1="5" x2="50" y2="115" stroke={`rgba(255,255,255,${dormant ? 0.05 : 0.15})`} strokeWidth="0.5" />
        </svg>
    );
}

function LotusShape({ scale, color, uid, dormant }) {
    const petalCount = 6;
    const petals = Array.from({ length: petalCount }, (_, i) => {
        const angle = (i * 360 / petalCount) - 90;
        const rad = angle * Math.PI / 180;
        return `M 50 50 Q ${50 + Math.cos(rad - 0.4) * 30 * scale} ${50 + Math.sin(rad - 0.4) * 30 * scale}, ${50 + Math.cos(rad) * 42} ${50 + Math.sin(rad) * 42} Q ${50 + Math.cos(rad + 0.4) * 30 * scale} ${50 + Math.sin(rad + 0.4) * 30 * scale}, 50 50`;
    });

    return (
        <svg viewBox="0 0 100 100" width={65 * scale} height={65 * scale}>
            <defs>
                <filter id={`${uid}-lf`}>
                    <feGaussianBlur stdDeviation={dormant ? "2" : "3"} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            {petals.map((d, i) => (
                <path
                    key={i}
                    d={d}
                    fill={`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${dormant ? 0.08 + i * 0.01 : 0.45 + i * 0.08})`}
                    filter={`url(#${uid}-lf)`}
                />
            ))}
            <circle cx="50" cy="50" r={6} fill={`rgba(${color[0] + 40}, ${color[1] + 40}, ${color[2] + 40}, ${dormant ? 0.15 : 0.85})`} />
        </svg>
    );
}

function MonolithShape({ scale, color, uid, dormant }) {
    const height = 40 + scale * 50;
    return (
        <svg viewBox="0 0 60 120" width={40 * scale} height={80 * scale}>
            <defs>
                <linearGradient id={`${uid}-mg`} x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: `rgb(${Math.max(0, color[0] - 60)}, ${Math.max(0, color[1] - 60)}, ${Math.max(0, color[2] - 40)})`, stopOpacity: dormant ? 0.1 : 1 }} />
                    <stop offset="100%" style={{ stopColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`, stopOpacity: dormant ? 0.12 : 0.85 }} />
                </linearGradient>
                <filter id={`${uid}-mf`}>
                    <feGaussianBlur stdDeviation={dormant ? "2" : "3"} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <rect
                x={10} y={120 - height} width={40} height={height}
                rx={3} ry={3}
                fill={`url(#${uid}-mg)`}
                filter={`url(#${uid}-mf)`}
            />
            <rect
                x={18} y={120 - height + 5} width={4} height={height - 15}
                rx={2}
                fill={`rgba(255,255,255,${dormant ? 0.03 : 0.12})`}
            />
        </svg>
    );
}

function StarShape({ scale, color, uid, dormant }) {
    const points = 5;
    const outerR = 35 * scale;
    const innerR = 15 * scale;
    const cx = 50, cy = 50;
    let d = "";
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI / points) - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        d += (i === 0 ? "M" : "L") + ` ${x} ${y} `;
    }
    d += "Z";

    return (
        <svg viewBox="0 0 100 100" width={60 * scale} height={60 * scale}>
            <defs>
                <filter id={`${uid}-sf`}>
                    <feGaussianBlur stdDeviation={dormant ? "2" : "4"} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <path d={d} fill={`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${dormant ? 0.12 : 0.85})`} filter={`url(#${uid}-sf)`} />
            <circle cx={cx} cy={cy} r={8 * scale} fill={`rgba(255, 255, 240, ${dormant ? 0.08 : 0.55})`} />
        </svg>
    );
}

function HeartShape({ scale, color, uid, dormant }) {
    return (
        <svg viewBox="0 0 100 100" width={55 * scale} height={55 * scale}>
            <defs>
                <filter id={`${uid}-hf`}>
                    <feGaussianBlur stdDeviation={dormant ? "2" : "3.5"} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <path
                d="M50 88 C25 65, 5 50, 5 33 C5 18, 18 8, 30 8 C38 8, 45 13, 50 20 C55 13, 62 8, 70 8 C82 8, 95 18, 95 33 C95 50, 75 65, 50 88Z"
                fill={`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${dormant ? 0.12 : 0.85})`}
                filter={`url(#${uid}-hf)`}
            />
        </svg>
    );
}

function DiamondShape({ scale, color, uid, dormant }) {
    return (
        <svg viewBox="0 0 100 120" width={50 * scale} height={60 * scale}>
            <defs>
                <linearGradient id={`${uid}-dg`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: `rgb(${color[0] + 20}, ${color[1] + 20}, ${color[2] + 30})`, stopOpacity: dormant ? 0.12 : 0.9 }} />
                    <stop offset="100%" style={{ stopColor: `rgb(${color[0] - 30}, ${color[1] - 30}, ${color[2]})`, stopOpacity: dormant ? 0.1 : 0.95 }} />
                </linearGradient>
                <filter id={`${uid}-df`}>
                    <feGaussianBlur stdDeviation={dormant ? "2" : "4"} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <polygon points="50,5 90,45 50,115 10,45" fill={`url(#${uid}-dg)`} filter={`url(#${uid}-df)`} />
            <polygon points="50,5 90,45 50,45" fill={`rgba(255,255,255,${dormant ? 0.03 : 0.1})`} />
        </svg>
    );
}

const SHAPE_COMPONENTS = {
    crystal: CrystalShape,
    lotus: LotusShape,
    monolith: MonolithShape,
    star: StarShape,
    heart: HeartShape,
    diamond: DiamondShape,
};

// ─── Single Artifact Card ─────────────────────────────────────────
function ArtifactCard({ category, config, stats, index }) {
    const uid = useId().replace(/:/g, "");
    const { consistency, streak, count, totalCompletions } = stats;
    const isActive = count > 0;

    // Scale: 0.65 base (dormant) to 1.35 (fully consistent)
    const artifactScale = isActive ? 0.7 + consistency * 0.65 : 0.6;
    // Color intensity
    const colorIntensity = isActive ? 0.35 + consistency * 0.65 : 0.15;
    const scaledColor = config.baseColor.map(c => Math.round(c * colorIntensity + (1 - colorIntensity) * 30));

    const ShapeComponent = SHAPE_COMPONENTS[config.shape];

    // Status label based on consistency
    const getStatus = () => {
        if (!isActive) return { text: "Dormant", dotColor: "bg-zinc-600" };
        if (consistency >= 0.8) return { text: "Thriving", dotColor: "bg-emerald-400" };
        if (consistency >= 0.5) return { text: "Growing", dotColor: "bg-yellow-400" };
        if (consistency >= 0.2) return { text: "Budding", dotColor: "bg-orange-400" };
        return { text: "Seedling", dotColor: "bg-red-400" };
    };
    const status = getStatus();

    return (
        <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.08, duration: 0.5, type: "spring", stiffness: 120, damping: 15 }}
            className="relative group"
        >
            <div
                className="relative rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-white/[0.015] backdrop-blur-sm p-4 sm:p-5 flex flex-col items-center gap-2.5 overflow-hidden transition-all duration-500 hover:border-white/[0.14] hover:from-white/[0.07] hover:to-white/[0.03] hover:shadow-2xl cursor-default min-h-[200px] justify-center"
                style={{
                    boxShadow: isActive
                        ? `0 0 ${15 + consistency * 35}px ${config.glowColor.replace(/[\d.]+\)$/, `${consistency * 0.25})`)}, inset 0 1px 0 rgba(255,255,255,0.05)`
                        : "inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
            >
                {/* Pulsing ring behind active artifacts */}
                {isActive && (
                    <motion.div
                        className="absolute rounded-full border"
                        style={{
                            width: 75 + consistency * 35,
                            height: 75 + consistency * 35,
                            borderColor: `rgba(${config.baseColor.join(",")}, 0.15)`,
                            top: "42%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.08, 0.22, 0.08],
                        }}
                        transition={{
                            duration: 3.5 + index * 0.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}

                {/* Artifact — always shows shape, dormant = faded outline */}
                <motion.div
                    className="relative z-10 flex items-center justify-center"
                    style={{ minHeight: 65 }}
                    animate={isActive ? { y: [0, -3, 0] } : {}}
                    transition={{
                        duration: 4.5 + index * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <ShapeComponent
                        scale={artifactScale}
                        color={scaledColor}
                        uid={uid}
                        dormant={!isActive}
                    />
                </motion.div>

                {/* Info */}
                <div className="text-center z-10 space-y-0.5">
                    <p className={`text-[10px] font-semibold tracking-wider uppercase ${isActive ? "text-white/50" : "text-white/25"}`}>
                        {config.artifactName}
                    </p>
                    <p className={`text-sm font-medium ${isActive ? "text-white/80" : "text-white/40"}`}>
                        {config.label}
                    </p>
                </div>

                {/* Status dot + label */}
                <div className="flex items-center gap-1.5 z-10">
                    <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                    <span className="text-[10px] uppercase tracking-widest text-white/35 font-medium">
                        {status.text}
                    </span>
                </div>

                {/* Stats row (active only) */}
                {isActive && (
                    <div className="flex items-center gap-2.5 text-[11px] text-white/30 z-10 flex-wrap justify-center">
                        <span>{count} habit{count !== 1 && "s"}</span>
                        <span className="text-white/10">•</span>
                        <span>{Math.round(consistency * 100)}%</span>
                        {streak > 0 && (
                            <>
                                <span className="text-white/10">•</span>
                                <span className="text-orange-400/60">🔥 {streak}d</span>
                            </>
                        )}
                    </div>
                )}

                {/* Hover glow overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                    style={{
                        background: `radial-gradient(circle at 50% 40%, ${config.glowColor.replace(/[\d.]+\)$/, `${isActive ? 0.1 : 0.04})`)}, transparent 70%)`,
                    }}
                />
            </div>
        </motion.div>
    );
}

// ─── Main Ecosystem Component ────────────────────────────────────
export function HabitEcosystem() {
    const { habits } = useHabits();
    const [collapsed, setCollapsed] = useState(false);

    const categoryData = useMemo(() => {
        return Object.keys(CATEGORY_CONFIG).map(cat => ({
            category: cat,
            config: CATEGORY_CONFIG[cat],
            stats: getCategoryStats(habits, cat),
        }));
    }, [habits]);

    const vitality = useMemo(() => {
        if (habits.length === 0) return 0;
        const active = categoryData.filter(c => c.stats.count > 0);
        if (active.length === 0) return 0;
        return Math.min(1, active.reduce((s, c) => s + c.stats.consistency, 0) / active.length);
    }, [categoryData, habits]);

    const sortedCategories = useMemo(() => {
        return [...categoryData].sort((a, b) => {
            if (a.stats.count === 0 && b.stats.count > 0) return 1;
            if (a.stats.count > 0 && b.stats.count === 0) return -1;
            return b.stats.consistency - a.stats.consistency;
        });
    }, [categoryData]);

    const activeCount = categoryData.filter(c => c.stats.count > 0).length;
    const totalCompletions = categoryData.reduce((s, c) => s + c.stats.totalCompletions, 0);

    return (
        <div className="relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden">
            {/* Particle background */}
            <ParticleField vitality={vitality} />

            {/* Header */}
            <div className="relative z-10 px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        {vitality > 0.3 && (
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                                style={{ background: "radial-gradient(circle, rgba(167,139,250,0.4), transparent)" }}
                            />
                        )}
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-semibold text-white/90 tracking-tight">
                            Habit Ecosystem
                        </h2>
                        <p className="text-[11px] sm:text-xs text-white/30 mt-0.5">
                            {activeCount > 0
                                ? `${activeCount} active artifact${activeCount !== 1 ? "s" : ""} · ${totalCompletions} total actions`
                                : "Add habits to awaken your digital artifacts"
                            }
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-white/25 hover:text-white/55"
                    title={collapsed ? "Expand ecosystem" : "Collapse ecosystem"}
                >
                    {collapsed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
            </div>

            {/* Vitality Bar */}
            <div className="relative z-10 mx-5 sm:mx-6 mb-3 sm:mb-4">
                <div className="flex items-center justify-between text-[10px] text-white/25 mb-1.5 uppercase tracking-widest font-medium">
                    <span>Ecosystem Vitality</span>
                    <span>{Math.round(vitality * 100)}%</span>
                </div>
                <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(vitality * 100, 1)}%` }}
                        transition={{ duration: 1.3, ease: "easeOut" }}
                        style={{
                            background: vitality > 0.6
                                ? "linear-gradient(90deg, #4ade80, #a78bfa, #60a5fa)"
                                : vitality > 0.3
                                    ? "linear-gradient(90deg, #fbbf24, #f472b6)"
                                    : "linear-gradient(90deg, #ef4444, #f97316)",
                        }}
                    />
                </div>
            </div>

            {/* Artifact Grid */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="relative z-10 px-5 sm:px-6 pb-5 sm:pb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
                            {sortedCategories.map((item, i) => (
                                <ArtifactCard
                                    key={item.category}
                                    category={item.category}
                                    config={item.config}
                                    stats={item.stats}
                                    index={i}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
