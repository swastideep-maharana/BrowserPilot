import { cn } from "@/lib/utils"

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6 shrink-0", className)}
    >
      {/* ── Connecting Arrows ────────────────────────── */}
      {/* Top Arrow: Green -> Blue */}
      <line x1="43" y1="30" x2="57" y2="30" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <polygon points="56,26 62,30 56,34" fill="#1E293B" />

      {/* Left Arrow: Green -> Red */}
      <line x1="30" y1="43" x2="30" y2="57" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <polygon points="26,56 30,62 34,56" fill="#1E293B" />

      {/* Right Arrow: Blue -> Yellow */}
      <line x1="70" y1="43" x2="70" y2="56" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <polygon points="66,55 70,61 74,55" fill="#1E293B" />

      {/* ── 1. Top-Left: Green Circle ────────────────── */}
      <circle
        cx="30"
        cy="30"
        r="13.5"
        fill="#22C55E"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* ── 2. Top-Right: Blue Diamond ──────────────── */}
      <rect
        x="60"
        y="20"
        width="20"
        height="20"
        rx="3.5"
        transform="rotate(45 70 30)"
        fill="#3B82F6"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* ── 3. Bottom-Left: Red Rounded Square ───────── */}
      <rect
        x="18"
        y="58"
        width="24"
        height="24"
        rx="5.5"
        fill="#EF4444"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* ── 4. Bottom-Right: Yellow Circle ──────────── */}
      <circle
        cx="70"
        cy="70"
        r="13.5"
        fill="#F59E0B"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
    </svg>
  )
}

export function Logo({
  className,
  iconClassName,
  showText = true,
}: {
  className?: string
  iconClassName?: string
  showText?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-9 items-center justify-center rounded-xl bg-card border border-border shadow-xs p-1">
        <LogoIcon className={cn("size-6", iconClassName)} />
      </div>
      {showText && (
        <span className="text-sm font-bold tracking-tight text-foreground">
          BrowserPilot
        </span>
      )}
    </div>
  )
}
