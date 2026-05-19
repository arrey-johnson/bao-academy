import {
  ArrowRight,
  BookOpen,
  Code2,
  MessageSquare,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    icon: BookOpen,
    title: "Learn in slides",
    desc: "Short, interactive lessons — one idea per screen. Swipe forward like stories, not hour-long lectures.",
  },
  {
    step: "02",
    icon: Code2,
    title: "Build in VS Code",
    desc: "Apply every concept on your machine. Full-stack projects from frontend layouts to APIs and databases.",
  },
  {
    step: "03",
    icon: Send,
    title: "Submit your work",
    desc: "Push to GitHub, deploy a live link, or upload your project. Real deliverables, not checkbox quizzes.",
  },
  {
    step: "04",
    icon: MessageSquare,
    title: "Get mentor review",
    desc: "Human feedback, revisions, and approval — then certificates that prove you can ship.",
  },
] as const;

export function HowWeTrainSection() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 border-t border-zinc-800 px-4 py-24 light:border-zinc-200 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-zinc-950 light:bg-zinc-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(88,38,166,0.12),transparent)] light:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(88,38,166,0.06),transparent)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-bao-light">
            Our method
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 light:text-zinc-900 md:text-4xl">
            How We Train You
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-bao-muted light:text-zinc-600">
            A four-step loop built for builders — from first slide to approved
            project, with mentors in the loop.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map(({ step, icon: Icon, title, desc }, index) => (
            <div key={step} className="relative flex flex-col">
              {index < steps.length - 1 && (
                <div
                  className="absolute -right-3 top-12 z-10 hidden text-bao/40 lg:block"
                  aria-hidden
                >
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}

              <article
                className={cn(
                  "group relative flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition-all duration-300",
                  "hover:-translate-y-1 hover:border-bao/40 hover:shadow-xl hover:shadow-bao/10",
                  "light:border-zinc-200 light:bg-white light:hover:border-bao/30 light:hover:shadow-lg"
                )}
              >
                <span className="absolute -top-3 left-6 rounded-full bg-bao px-2.5 py-0.5 text-xs font-bold text-white shadow-md shadow-bao/30">
                  {step}
                </span>

                <div className="mb-5 mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-bao/15 ring-1 ring-bao/25 transition-colors group-hover:bg-bao/25">
                  <Icon className="h-6 w-6 text-bao-light light:text-bao" />
                </div>

                <h3 className="text-lg font-semibold text-zinc-100 light:text-zinc-900">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
                  {desc}
                </p>
              </article>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-dashed border-bao/30 bg-bao/5 px-6 py-5 text-center light:bg-bao/[0.03]">
          <p className="text-sm font-medium text-zinc-300 light:text-zinc-700 md:text-base">
            <span className="text-bao-light light:text-bao">Slides</span>
            {" → "}
            <span className="text-bao-light light:text-bao">Tasks</span>
            {" → "}
            <span className="text-bao-light light:text-bao">Projects</span>
            {" → "}
            <span className="text-bao-light light:text-bao">Review</span>
            {" → "}
            <span className="text-bao-light light:text-bao">Certification</span>
          </p>
          <p className="mt-2 text-xs text-zinc-500 light:text-zinc-500">
            Learn by Building, Not by Watching
          </p>
        </div>
      </div>
    </section>
  );
}
