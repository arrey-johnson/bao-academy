import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const exploreLinks = [
  { href: "/learn/html-css-js", label: "Courses" },
  { href: "/#how-it-works", label: "How we train you" },
  { href: "/signup", label: "Sign up" },
  { href: "/login", label: "Log in" },
];

const PHONE_DISPLAY = "654 547 772";
const PHONE_TEL = "+237654547772";
const EMAIL = "contact@baotechnologies.com";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-800/60 bg-black light:border-zinc-200/80 light:bg-white">
      <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-bao/40 to-transparent light:via-bao/25" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo height={34} className="shrink-0" />
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
              Full-stack developer training for builders. Learn by Building,
              Not by Watching.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 sm:gap-16">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 light:text-zinc-700">
                Explore
              </h3>
              <ul className="mt-4 space-y-2.5">
                {exploreLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-400 transition-colors hover:text-bao-light light:text-zinc-600 light:hover:text-bao"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 light:text-zinc-700">
                Contact
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="inline-flex items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-bao-light light:text-zinc-600 light:hover:text-bao"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-bao" />
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-bao-light light:text-zinc-600 light:hover:text-bao"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-bao" />
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-800/60 pt-8 text-center text-xs text-zinc-500 light:border-zinc-200 light:text-zinc-500 sm:flex-row sm:text-left">
          <p>© {year} BAO Academy · BAO Technologies. All rights reserved.</p>
          <p>Built for developers who ship.</p>
        </div>
      </div>
    </footer>
  );
}
