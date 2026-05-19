import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechStackLogos } from "@/components/hero/TechStackLogos";

const highlights = [
  "Swipe-through slide lessons — no endless videos",
  "Build in VS Code on your own machine",
  "Submit projects · get mentor feedback · earn certificates",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bao/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl text-center">
        <TechStackLogos className="mb-10" />

        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-bao-light">
          BAO Academy · Full-Stack Development
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-50 light:text-zinc-900 md:text-5xl md:leading-[1.15]">
          Build. <span className="text-bao-light">Ship.</span> Get hired.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-bao-muted light:text-zinc-600">
          Full-stack skills from the ground up — frontend, backend, databases,
          and APIs — through bite-size slides, projects you build in VS Code,
          and mentor-reviewed submissions.
        </p>

        <p className="mx-auto mt-4 max-w-xl text-base font-medium text-zinc-400 light:text-zinc-500">
          Learn by Building, Not by Watching.
        </p>

        <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-2.5 text-left sm:max-w-md">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-zinc-400 light:text-zinc-600"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bao" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Student login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/learn/html-css-js">
            <Button variant="outline" size="lg">
              Preview the curriculum
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
