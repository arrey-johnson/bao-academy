import { Award, Flame, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const pillars = [
  {
    icon: Flame,
    title: "Daily streaks",
    desc: "Show up every day. Your streak grows when you learn or submit work — consistency beats cramming.",
    accent: "from-orange-500/20 to-bao/10",
  },
  {
    icon: TrendingUp,
    title: "Visible progress",
    desc: "Track every slide, lesson, and course. See exactly how far you've come and what's next.",
    accent: "from-bao/20 to-bao/5",
  },
  {
    icon: Award,
    title: "Earned milestones",
    desc: "Badges for streaks and completed projects. Certificates when mentors approve your capstones.",
    accent: "from-bao-light/20 to-bao/5",
  },
] as const;

export function MomentumSection() {
  return (
    <section className="relative overflow-hidden border-t border-zinc-800 px-4 py-24 light:border-zinc-200 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-black light:bg-white" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bao/50 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-bao-light">
              Stay in the loop
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 light:text-zinc-900 md:text-4xl">
              Streaks. Progress. Momentum.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-bao-muted light:text-zinc-600">
              Learning to code is a marathon. We keep you moving with daily
              wins, clear progress, and rewards that mean something on your
              résumé.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-bao/25 bg-bao/10 px-5 py-4 lg:mt-0 lg:shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bao/20">
              <Zap className="h-6 w-6 text-bao-light" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold tabular-nums text-zinc-50 light:text-zinc-900">
                7+
              </p>
              <p className="text-xs font-medium text-zinc-400 light:text-zinc-500">
                day streak goal
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, desc, accent }) => (
            <article
              key={title}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition-all duration-300",
                "hover:border-bao/30 hover:shadow-lg hover:shadow-bao/5",
                "light:border-zinc-200 light:bg-zinc-50 light:hover:border-bao/20"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl",
                  accent
                )}
              />
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 ring-1 ring-zinc-800 light:bg-white light:ring-zinc-200">
                  <Icon className="h-5 w-5 text-bao" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 light:text-zinc-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
                  {desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
