import Image from "next/image";
import { cn } from "@/lib/utils";

/** Official brand marks via Devicon (W3C / vendor-standard artwork) */
const stack = [
  { name: "HTML5", src: "/tech/html5.svg", alt: "HTML5 logo" },
  { name: "CSS3", src: "/tech/css3.svg", alt: "CSS3 logo" },
  { name: "JavaScript", src: "/tech/javascript.svg", alt: "JavaScript logo" },
  { name: "React", src: "/tech/react.svg", alt: "React logo" },
] as const;

export function TechStackLogos({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 sm:gap-6",
        className
      )}
      aria-label="Technologies you'll learn: HTML5, CSS3, JavaScript, and React"
    >
      {stack.map(({ name, src, alt }) => (
        <li key={name}>
          <div
            className="flex flex-col items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-3 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-lg light:border-zinc-200 light:bg-white light:shadow-sm light:hover:border-zinc-300 sm:px-5 sm:py-4"
            title={name}
          >
            <Image
              src={src}
              alt={alt}
              width={56}
              height={56}
              className="h-12 w-12 sm:h-14 sm:w-14"
              unoptimized
            />
            <span className="text-[11px] font-semibold text-zinc-500 light:text-zinc-600 sm:text-xs">
              {name}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
