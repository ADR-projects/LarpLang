const fs = require("node:fs");
const path = require("node:path");
const { compile } = require("@tailwindcss/node");
const { Scanner } = require("@tailwindcss/oxide");

async function build() {
  const cssPath = path.resolve(__dirname, "../src/app/globals.css");
  const rawCss = fs.readFileSync(cssPath, "utf8");

  // If already compiled, grab only the base rules if needed or recompile
  const compiler = await compile(rawCss, {
    base: path.resolve(__dirname, "../src/app"),
    from: cssPath,
    onDependency: () => {},
  });

  const scanner = new Scanner({
    sources: [
      {
        base: path.resolve(__dirname, "../src"),
        pattern: "**/*",
        negated: false,
      },
    ],
  });

  const candidates = scanner.scan();
  const outputCss = compiler.build([...candidates]);
  fs.writeFileSync(cssPath, outputCss);
  console.log(
    `[build:css] Compiled ${candidates.length} Tailwind utilities into src/app/globals.css`,
  );
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
