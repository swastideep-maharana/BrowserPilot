import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "bg-zinc-900/90 border border-zinc-800/90 shadow-2xl rounded-2xl p-6 sm:p-7 backdrop-blur-xl",
          headerTitle: "text-xl font-bold text-white tracking-tight text-left",
          headerSubtitle: "text-xs text-zinc-400 text-left",
          socialButtonsBlockButton:
            "border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-200 font-medium rounded-xl h-10 transition-all text-xs shadow-2xs hover:border-zinc-700",
          socialButtonsBlockButtonText: "font-medium text-xs text-zinc-200",
          dividerRow: "my-4",
          dividerLine: "bg-zinc-800",
          dividerText: "text-[11px] text-zinc-500 uppercase font-semibold tracking-wider",
          formFieldLabel: "text-xs font-semibold text-zinc-300",
          formFieldInput:
            "h-10 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all placeholder:text-zinc-600 shadow-2xs",
          formButtonPrimary:
            "h-10 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 shadow-sm transition-all cursor-pointer",
          footerAction: "border-t border-zinc-800/80 pt-4 mt-3",
          footerActionText: "text-xs text-zinc-400",
          footerActionLink: "text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline",
          footer: "[&>div:last-child]:hidden [&>.cl-internal-phfxk3]:hidden [&>.cl-developmentBadge]:hidden",
          developmentBadge: "hidden",
          footerPages: "hidden",
        },
      }}
    />
  )
}
