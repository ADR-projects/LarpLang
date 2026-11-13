"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/content";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "★ About", href: "/" },
    { label: "▶ Playground", href: "/playground" },
    { label: "</> Gallery", href: "/gallery" },
    { label: "● Contact", href: "/contact" },
  ];

  return (
    <header className="w-full max-w-5xl mx-auto px-4 pt-6 pb-2">
      <nav
        aria-label="Main Navigation"
        className="retro-card px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-[#faf7ee]"
      >
        {/* Brand / Logo pill */}
        <Link
          href="/"
          className="flex items-center gap-2 group text-black focus:outline-none"
        >
          <span className="font-pixel text-2xl sm:text-3xl tracking-wider font-bold bg-[#fed156] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            LARP
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-black/70 hidden sm:inline-block">
            v0.1-java
          </span>
        </Link>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`retro-btn px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-bold tracking-wide rounded-sm ${
                  isActive
                    ? "bg-[#72a7f9] text-black translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_#000]"
                    : "bg-white hover:bg-[#a2e8dd] text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* GitHub external link */}
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="retro-btn px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-bold tracking-wide bg-[#a3c97d] text-black rounded-sm inline-flex items-center gap-1"
          >
            <span>GitHub</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
