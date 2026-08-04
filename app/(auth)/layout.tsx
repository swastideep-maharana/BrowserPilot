import Link from "next/link"
import { LogoIcon } from "@/components/logo"
import {
  MousePointerClick,
  Users,
  Cloud,
  CheckCircle2,
  Globe,
  Bell,
  Sparkles,
} from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-svh w-full grid lg:grid-cols-12 bg-zinc-950 text-white overflow-x-hidden">
      {/* ── Seamless Full-Page Ambient Lighting & Grid Background (Covers 100% of screen) ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.2),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* ── Left Column: Product Showcase & Interactive Preview ── */}
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 flex-col justify-between p-10 xl:p-14 relative z-10 border-r border-zinc-800/40">
        {/* Brand Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 group transition-transform hover:scale-[1.02]"
            title="BrowserPilot - Home"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md p-1 group-hover:border-zinc-700 transition-colors">
              <LogoIcon className="size-6" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">
                BrowserPilot
              </span>
              <p className="text-xs text-zinc-400">
                Visual Browser Automation
              </p>
            </div>
          </Link>
        </div>

        {/* Centerpiece: Showcase & Live Pipeline Preview */}
        <div className="my-8 space-y-6 max-w-lg">
          <div className="space-y-2">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Automate web tasks with visual workflows.
            </h1>
            <p className="text-sm xl:text-base text-zinc-400 leading-relaxed">
              Build, run, and collaborate on browser automations using an intuitive canvas. No complex scripting needed.
            </p>
          </div>

          {/* Workflow Card Preview */}
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/90 p-5 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-zinc-200">
                  Example: Daily Price Monitor
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 bg-zinc-800/70 px-2 py-0.5 rounded-md border border-zinc-700/40">
                Cloud Workflow
              </span>
            </div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300">
                <Globe className="size-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate">1. Open Site</div>
                  <div className="text-[10px] text-zinc-500">Store page</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950/70 border border-emerald-500/30 text-xs text-zinc-200">
                <Sparkles className="size-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate text-emerald-400">2. Extract Data</div>
                  <div className="text-[10px] text-zinc-400">Get prices</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300">
                <Bell className="size-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate">3. Send Alert</div>
                  <div className="text-[10px] text-zinc-500">Slack notification</div>
                </div>
              </div>
            </div>

            {/* Clean Status Box */}
            <div className="rounded-lg bg-black/60 border border-zinc-800/60 p-3 text-xs space-y-1.5 text-zinc-400">
              <div className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span>Navigated to catalog page</span>
              </div>
              <div className="text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 shrink-0 text-blue-400" />
                <span>Extracted latest item prices successfully</span>
              </div>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-4 pt-1">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <MousePointerClick className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Visual Canvas</h4>
                <p className="text-[11px] text-zinc-400">Drag and drop nodes</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Users className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Collaboration</h4>
                <p className="text-[11px] text-zinc-400">Real-time team workflows</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Cloud className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Cloud Powered</h4>
                <p className="text-[11px] text-zinc-400">Runs in the background</p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Footer */}
        <div className="text-xs text-zinc-500 pt-4">
          <p>&copy; {new Date().getFullYear()} BrowserPilot Inc. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right Column: Authentication Form (Seamless Dark Theme) ── */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 relative z-10">
        {/* Mobile Header Logo */}
        <div className="flex lg:hidden items-center justify-between pb-6 border-b border-zinc-800/60">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-xs p-1">
              <LogoIcon className="size-6" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              BrowserPilot
            </span>
          </Link>
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
            Account
          </span>
        </div>

        {/* Center Container for Clerk SignIn/SignUp */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Auth Page Footer */}
        <div className="text-center text-[11px] text-zinc-500 pt-4 space-y-1">
          <p>
            By continuing, you agree to BrowserPilot&apos;s{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-zinc-300">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-zinc-300">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
