import Image from "next/image";
import { BookOpen, Flame, Layers, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const perks = [
  {
    icon: Layers,
    text: "Swipe-through slide lessons — no endless videos",
  },
  {
    icon: Zap,
    text: "Build real projects in VS Code on your machine",
  },
  {
    icon: BookOpen,
    text: "Mentor feedback, streaks, and certificates",
  },
];

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center py-6 md:py-10 lg:flex-row lg:items-stretch lg:gap-12 lg:py-16">
      <div
        className={cn(
          "relative mb-8 w-full overflow-hidden rounded-3xl border border-white/10 p-8 md:p-10",
          "bg-gradient-to-br from-bao/30 via-zinc-900/90 to-zinc-950",
          "light:border-bao/20 light:from-bao/15 light:via-white light:to-zinc-100",
          "lg:mb-0 lg:flex lg:max-w-md lg:flex-col lg:justify-between"
        )}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-bao/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-bao-light/20 blur-3xl" />

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bao-light light:border-bao/20 light:bg-bao/10">
            <Sparkles className="h-3.5 w-3.5" />
            Student portal
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="auth-float relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-2 light:border-bao/20 light:bg-white">
              <Image
                src="/icon.png"
                alt=""
                width={40}
                height={40}
                className="h-auto w-auto object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-bao/30 bg-bao/10 px-4 py-2.5">
              <Flame className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-xs font-medium text-zinc-400 light:text-zinc-500">
                  Keep your
                </p>
                <p className="text-sm font-bold text-zinc-100 light:text-zinc-900">
                  streak alive
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900 md:text-4xl md:leading-tight">
            Pick up where you{" "}
            <span className="bg-gradient-to-r from-bao-light to-violet-300 bg-clip-text text-transparent">
              left off.
            </span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
            Your streak, progress, and next lesson are waiting. Sign in with the
            credentials from your enrollment email.
          </p>
        </div>

        <ul className="relative mt-8 space-y-3.5 border-t border-white/10 pt-8 light:border-zinc-200">
          {perks.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-3 text-sm text-zinc-300 light:text-zinc-600"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bao/20 text-bao-light light:bg-bao/10">
                <Icon className="h-4 w-4" />
              </div>
              {text}
            </li>
          ))}
        </ul>

        <p className="relative mt-8 hidden text-xs font-medium uppercase tracking-widest text-zinc-500 lg:block">
          Learn by Building, Not by Watching
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col justify-center lg:max-w-[420px]">
        {children}
      </div>
    </div>
  );
}
