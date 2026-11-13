import { Pixelify_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/data/content";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono-body",
  display: "swap",
});

export const metadata = {
  title: "LARPLANG — Toy Programming Language in Java",
  description:
    "A toy interpreted programming language crafted in Java with an interactive in-browser CheerpJ playground.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${pixelify.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col justify-between selection:bg-[#fed156] selection:text-black">
        <div>
          <Navbar />
          <main className="w-full max-w-5xl mx-auto px-4 py-6">{children}</main>
        </div>

        <footer className="w-full max-w-5xl mx-auto px-4 py-8 text-center text-xs text-black/70">
          <div className="border-t-2 border-black/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
            <div>
              <span>★ {siteConfig.name} — Handcrafted in Java 21</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black"
              >
                GitHub Repo
              </a>
              <span>●</span>
              <span>Runs client-side via CheerpJ</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
