import Link from "next/link";
import Sticker from "@/components/Sticker";
import { siteConfig } from "@/data/content";

export default function GalleryPage() {
  // Only show working showcase examples in the gallery
  const workingExamples = siteConfig.examples.filter(
    (item) => item.kind === "works",
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="retro-card p-6 sm:p-8 bg-white relative">
        <div className="washi-tape-tl" />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <h1 className="font-pixel text-3xl sm:text-5xl font-bold">
              &lt;/&gt; Code Gallery
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Sticker color="matcha" rotate={1}>
              5 EXAMPLES
            </Sticker>
          </div>
        </div>
        <p className="font-mono text-sm sm:text-base text-black/75 max-w-2xl leading-relaxed">
          Try out these code examples!
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workingExamples.map((item, idx) => {
          const hasWashiTape = idx % 2 === 0;

          return (
            <div
              key={item.id}
              className="retro-card p-6 bg-white flex flex-col justify-between relative group hover:-translate-y-1 transition-transform"
            >
              {hasWashiTape && <div className="washi-tape-tr" />}

              <div>
                {/* Card Title & Status Sticker */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="font-pixel text-xl sm:text-2xl font-bold text-black">
                    {item.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="font-mono text-xs sm:text-sm text-black/80 mb-4 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Code Block with High-Contrast Text */}
                <div className="retro-card-sm bg-[#18181b] p-4 mb-5 overflow-x-auto border-2 border-black">
                  <pre className="font-mono text-xs sm:text-sm text-white font-medium whitespace-pre leading-relaxed">
                    <code>{item.code}</code>
                  </pre>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-black/10 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-black/60 font-bold">
                  {item.id}
                </span>
                <Link
                  href={`/playground?example=${encodeURIComponent(item.id)}`}
                  className="retro-btn px-4 py-2 font-mono text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 bg-[#fed156] hover:bg-[#fed156]/90 text-black"
                >
                  <span>Open in playground</span>
                  <span className="font-pixel text-base">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
