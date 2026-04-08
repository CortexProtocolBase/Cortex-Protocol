interface BadgeProps { children: React.ReactNode; variant?: "primary" | "muted" | "success" | "warning" | "danger"; size?: "sm" | "md"; }
const variants = { primary: "bg-primary/10 text-primary", muted: "bg-card-solid text-muted", success: "bg-green-500/10 text-green-500", warning: "bg-yellow-500/10 text-yellow-500", danger: "bg-red-500/10 text-red-500" };
const sizes = { sm: "text-xs px-1.5 py-0.5", md: "text-sm px-2 py-0.5" };
export default function Badge({ children, variant = "primary", size = "sm" }: BadgeProps) { return <span className={`rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>{children}</span>; }
