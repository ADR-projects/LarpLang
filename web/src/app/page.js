import Image from "next/image";
import Link from "next/link";
import Sticker from "@/components/Sticker";
import { siteConfig } from "@/data/content";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative retro-card p-6 sm:p-10 bg-white">
        <div className="washi-tape-tl" />
        <div className="washi-tape-tr" />

        {/* Stickers */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Sticker color="matcha" rotate={1}>
            🡺 CUSTOM PROGRAMMING LANGUAGE
          </Sticker>
        </div>

        {/* Title Box */}
        <div className="border-[3px] border-black bg-[#faf7ee] p-6 sm:p-8 shadow-[4px_4px_0px_#000] text-center my-4">
          <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black">
            {siteConfig.name}
          </h1>
          <p className="mt-4 font-mono text-sm sm:text-lg text-black/80 max-w-2xl mx-auto leading-relaxed">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Status Notice & CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-black/10">
          <div className="text-xs sm:text-sm font-mono text-black/80 font-bold">
            {siteConfig.status}
          </div>
          <Link
            href="/playground"
            className="retro-btn px-6 py-3 bg-[#fed156] hover:bg-[#fed156]/90 text-black font-bold text-base sm:text-lg inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span>▶ Try the playground</span>
            <span className="font-pixel text-xl">→</span>
          </Link>
        </div>
      </section>

      {/* Second White Section: What is LarpLang? + Retro TV Gif */}
      <section className="retro-card p-6 sm:p-10 bg-white relative">
        <div className="washi-tape-tl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side: Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sticker color="mint" rotate={-1}>
                ★ ABOUT THIS PROJECT
              </Sticker>
            </div>
            <h2 className="font-pixel text-3xl sm:text-5xl font-bold text-black tracking-tight mt-4 mb-2">
              What is LarpLang?
            </h2>
            <div className="space-y-3 font-mono text-xs sm:text-sm text-black/80 leading-relaxed">
              <p className="text-justify">
                The word &quot;Larp&quot; has been trending lately. It
                originally meant &quot;Live-Action Roleplay&quot; but now is
                used as a verb: to larp is to pretend to be something
                you&apos;re not in an exaggerated way.
              </p>
              <p className="text-justify">
                In my current semester, we are studying Compiler Design. I
                thought that the best way to learn Lexers, Parsers, CFGs and
                ASTs was to try using them myself. Of course it had to have a
                funny name, despite being a very serious project. I am still
                working on making LarpLang even more like a real programming
                language.
              </p>
              <p className="text-justify">
                Through the power of <strong>CheerpJ WebAssembly</strong>, the
                full compiled Java interpreter runs directly in your web
                browser. No local Java installations required. I hope you will
                have fun with this playground!
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/playground"
                className="retro-btn px-4 py-2 bg-[#a3c97d] font-mono text-xs sm:text-sm font-bold text-black inline-flex items-center gap-1.5"
              >
                <span>Launch Playground</span>
                <span>▶</span>
              </Link>
              <Link
                href="/gallery"
                className="retro-btn px-4 py-2 bg-[#72a7f9] font-mono text-xs sm:text-sm font-bold text-black inline-flex items-center gap-1.5"
              >
                <span>Browse Gallery</span>
                <span>&lt;/&gt;</span>
              </Link>
            </div>
          </div>

          {/* Right Side: Retro TV GIF (Frameless) */}
          <div className="flex justify-center items-center md:pl-6">
            <Image
              src="/retro-tv.gif"
              alt="Retro TV animation"
              width={320}
              height={260}
              unoptimized
              className="w-full max-w-xs h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Code Sample Preview with High-Contrast Text */}
      <section className="retro-card p-6 sm:p-10 bg-white">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xl sm:text-2xl font-bold">
              ★ Code Sample
            </span>
            <span className="text-xs font-mono text-black/70 font-bold">
              (live in browser)
            </span>
          </div>
          <Sticker color="mint" rotate={2} size="sm">
            hello.larp
          </Sticker>
        </div>

        <div className="retro-card-sm bg-[#18181b] p-6 sm:p-8 font-mono text-xs sm:text-sm overflow-x-auto border-2 border-black">
          <pre className="p-2 space-y-1.5 leading-relaxed">
            <code>
              <span className="text-[#86efac] font-medium">
                {`# Arithmetic precedence and groupings`}
              </span>
              {"\n"}
              <span className="text-[#38bdf8] font-bold">yap</span>{" "}
              <span className="text-[#fbbf24] font-bold">1</span>{" "}
              <span className="text-white">+</span>{" "}
              <span className="text-[#fbbf24] font-bold">2</span>{" "}
              <span className="text-white">*</span>{" "}
              <span className="text-[#fbbf24] font-bold">3</span>{" "}
              <span className="text-[#86efac] font-medium">{`// prints 7`}</span>
              {"\n"}
              <span className="text-[#38bdf8] font-bold">yap</span>{" "}
              <span className="text-white">(</span>
              <span className="text-[#fbbf24] font-bold">1</span>{" "}
              <span className="text-white">+</span>{" "}
              <span className="text-[#fbbf24] font-bold">2</span>
              <span className="text-white">)</span>{" "}
              <span className="text-white">*</span>{" "}
              <span className="text-[#fbbf24] font-bold">3</span>{" "}
              <span className="text-[#86efac] font-medium">{`// prints 9`}</span>
              {"\n\n"}
              <span className="text-[#86efac] font-medium">
                {`# String concatenation & truthiness`}
              </span>
              {"\n"}
              <span className="text-[#38bdf8] font-bold">yap</span>{" "}
              <span className="text-[#f472b6] font-bold">
                &quot;score: &quot;
              </span>{" "}
              <span className="text-white">+</span>{" "}
              <span className="text-white">(</span>
              <span className="text-[#fbbf24] font-bold">10</span>{" "}
              <span className="text-white">&gt;</span>{" "}
              <span className="text-[#fbbf24] font-bold">5</span>
              <span className="text-white">)</span>
              {"\n"}
              <span className="text-[#38bdf8] font-bold">yap</span>{" "}
              <span className="text-white">!</span>
              <span className="text-[#c084fc] font-bold">ghost</span>{" "}
              <span className="text-[#86efac] font-medium">{`// prints t (ghost is falsy)`}</span>
            </code>
          </pre>
        </div>
      </section>

      {/* Keywords Table */}
      <section className="retro-card p-6 sm:p-8 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-2 border-black mb-6">
          <h2 className="font-pixel text-2xl sm:text-3xl font-bold">
            ★ Keyword Glossary
          </h2>
        </div>

        <p className="font-mono text-xs sm:text-sm text-black/80 mb-6">
          LarpLang grammar uses playful keywords. Here is the reference for the
          language design:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteConfig.keywords.map((kw) => (
            <div
              key={kw.name}
              className="retro-card-sm p-3.5 bg-[#faf7ee] flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-mono text-sm sm:text-base font-bold px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] rounded-sm ${
                    kw.color === "matcha"
                      ? "bg-[#a3c97d]"
                      : kw.color === "yellow"
                        ? "bg-[#fed156]"
                        : kw.color === "blue"
                          ? "bg-[#72a7f9]"
                          : "bg-[#a2e8dd]"
                  }`}
                >
                  {kw.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-black font-bold bg-white text-black/70">
                  {kw.category}
                </span>
              </div>
              <p className="font-mono text-xs text-black/80 leading-relaxed font-medium">
                {kw.meaning}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Text-Only Pipeline */}
      <section className="retro-card p-6 sm:p-8 bg-white relative">
        <div className="washi-tape-tl" />
        <div className="flex items-center justify-between pb-4 border-b-2 border-black mb-6">
          <h2 className="font-pixel text-2xl sm:text-3xl font-bold">
            ▶ Architecture Pipeline
          </h2>
          <Sticker color="blue" rotate={-1}>
            PURE JAVA
          </Sticker>
        </div>

        <div className="p-4 bg-[#faf7ee] border-2 border-black shadow-[3px_3px_0px_#000] mb-6">
          <p className="font-mono text-sm sm:text-base font-bold text-center">
            Lexer -&gt; Parser -&gt; Interpreter, built in Java
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {siteConfig.pipeline.map((step, idx) => (
            <div
              key={step.step}
              className="retro-card-sm p-3 bg-white flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-black/50 block font-bold">
                  STEP 0{idx + 1}
                </span>
                <span className="font-pixel text-lg font-bold block mt-1">
                  {step.step}
                </span>
                <p className="font-mono text-xs text-black/70 mt-2 font-medium">
                  {step.desc}
                </p>
              </div>
              {idx < siteConfig.pipeline.length - 1 && (
                <div className="hidden lg:block text-right font-pixel text-lg text-black/30 mt-2">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
