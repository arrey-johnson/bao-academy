"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Full wordmark aspect ratio (354×62) */
const LOGO_ASPECT = 354 / 62;

type LogoProps = {
  className?: string;
  height?: number;
  href?: string | false;
  /** auto = white on dark, colored on light */
  variant?: "auto" | "white" | "color";
};

function useIsDark() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const read = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function Logo({
  className,
  height = 40,
  href = "/",
  variant = "auto",
}: LogoProps) {
  const isDark = useIsDark();
  const width = Math.round(height * LOGO_ASPECT);
  const imageClass = cn("h-auto w-auto max-w-full object-contain", className);

  const src =
    variant === "white"
      ? "/logo-white.png"
      : variant === "color"
        ? "/logo.png"
        : isDark
          ? "/logo-white.png"
          : "/logo.png";

  const img = (
    <Image
      src={src}
      alt="Bao Academy"
      width={width}
      height={height}
      className={imageClass}
      priority
    />
  );

  if (href !== false) {
    return (
      <Link href={href || "/"} className="inline-flex shrink-0 items-center">
        {img}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{img}</span>;
}
