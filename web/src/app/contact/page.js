import Image from "next/image";
import { FaEnvelope, FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import Sticker from "@/components/Sticker";
import { siteConfig } from "@/data/content";

function getSocialIcon(type) {
  switch (type) {
    case "github":
      return <FaGithub />;
    case "linkedin":
      return <FaLinkedin />;
    case "portfolio":
      return <FaGlobe />;
    default:
      return <FaEnvelope />;
  }
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Contact Card */}
      <div className="retro-card p-6 sm:p-10 bg-white relative">
        <div className="washi-tape-tl" />
        <div className="washi-tape-tr" />

        {/* Stickers */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Sticker color="matcha" rotate={-2}>
            SAY HELLO OR COLLAB?
          </Sticker>
        </div>

        {/* Title */}
        <h1 className="font-pixel text-3xl sm:text-5xl font-bold mb-6 text-center sm:text-left">
          Meet The Developer!
        </h1>

        <div className="flex flex-col items-center justify-center text-center my-6">
          <div className="retro-card p-4 sm:p-5 bg-white relative rotate-1 hover:rotate-0 transition-transform mb-5">
            <div className="washi-tape-tl" />
            <div className="w-44 h-44 sm:w-56 sm:h-56 border-2 border-black overflow-hidden bg-[#faf7ee]">
              <Image
                src="/adr.jpeg"
                alt="Meet the developer"
                width={140}
                height={140}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pt-3 pb-1 text-center">
              <span className="font-pixel text-xl sm:text-2xl font-bold text-black block tracking-wide">
                Adrija Das
              </span>
              <span className="font-mono text-xs text-black/60 block mt-0.5">
                Creator & Maintainer
              </span>
            </div>
          </div>
        </div>

        <div className="retro-card-sm p-4 sm:p-6 bg-[#faf7ee] ruled-lines font-mono text-xs sm:text-sm text-black/85 mb-8">
          <p className="mb-3">
            Hey there! Thanks for exploring <strong>{siteConfig.title}</strong>.
          </p>
          <p className="mb-3">
            This language is an open-source project built from scratch in Java
            to craft compilers, lexers, and tree-walking interpreters from first
            principles.
          </p>
          <p>
            Feel free to reach out via the direct links below!{" "}
            <strong>I would love to collaborate on new projects.</strong>
          </p>
        </div>

        {/* Links list */}
        <div className="space-y-3 font-mono">
          <h2 className="font-pixel text-xl sm:text-2xl font-bold text-black mb-2 flex items-center gap-2">
            <span>★</span>
            <span>Direct Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {siteConfig.socialLinks.map((item, idx) => {
              const bgColors = [
                "bg-[#fed156]",
                "bg-[#72a7f9]",
                "bg-[#a2e8dd]",
                "bg-[#a3c97d]",
              ];
              const bg = bgColors[idx % bgColors.length];

              return (
                <a
                  key={item.label}
                  href={item.url}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`retro-btn p-3.5 ${bg} text-black font-bold text-xs sm:text-sm flex items-center justify-between group`}
                >
                  <span className="flex items-center gap-3 text-lg">
                    {getSocialIcon(item.type)}
                    <span className="ml-2">{item.label}</span>
                  </span>
                  <span className="font-pixel text-base group-hover:translate-x-1 transition-transform">
                    {item.external ? "↗" : "→"}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-8 pt-4 border-t-2 border-black/10 flex items-center justify-between text-xs font-mono text-black/60">
          <span>{siteConfig.contact.location}</span>
          <Image
            src="/sign.png"
            alt="my logo- it says 'ADR'"
            width={70}
            height={70}
          />
        </div>
      </div>
    </div>
  );
}
