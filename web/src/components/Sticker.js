export default function Sticker({
  children,
  color = "yellow",
  rotate = 0,
  className = "",
  size = "md",
}) {
  const colorMap = {
    yellow: "bg-[#fed156] text-black",
    matcha: "bg-[#a3c97d] text-black",
    blue: "bg-[#72a7f9] text-black",
    mint: "bg-[#a2e8dd] text-black",
    pink: "bg-[#fca5a5] text-black",
    cream: "bg-[#fdfbf7] text-black",
    white: "bg-white text-black",
  };

  const sizeMap = {
    sm: "px-2 py-0.5 text-xs font-bold",
    md: "px-2.5 py-1 text-xs sm:text-sm font-bold",
    lg: "px-3 py-1.5 text-sm sm:text-base font-bold",
  };

  const rotationStyles = {
    "-3": "-rotate-3",
    "-2": "-rotate-2",
    "-1": "-rotate-1",
    0: "rotate-0",
    1: "rotate-1",
    2: "rotate-2",
    3: "rotate-3",
    4: "rotate-4",
    "-4": "-rotate-4",
  };

  const rotClass = rotationStyles[rotate] || "rotate-0";
  const bg = colorMap[color] || colorMap.yellow;
  const sz = sizeMap[size] || sizeMap.md;

  return (
    <span
      className={`inline-flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_#000] rounded-sm select-none hover-wiggle uppercase tracking-wider font-mono ${bg} ${sz} ${rotClass} ${className}`}
    >
      {children}
    </span>
  );
}
