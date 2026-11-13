"use client";

import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Sticker from "@/components/Sticker";
import { siteConfig } from "@/data/content";

// Module-level CheerpJ promise cache
let cheerpjPromise = null;

function getLarpRuntime() {
  if (typeof window !== "undefined" && window.__larpRuntime) {
    return Promise.resolve(window.__larpRuntime);
  }

  if (!cheerpjPromise) {
    cheerpjPromise = (async () => {
      if (typeof window === "undefined" || !window.cheerpjInit) {
        throw new Error("CheerpJ loader script is not ready yet.");
      }

      // Initialize CheerpJ with Java 21; safely ignore if already initialized in this window
      try {
        await window.cheerpjInit({ version: 21 });
      } catch (initErr) {
        const msg = String(initErr?.message || initErr).toLowerCase();
        if (!msg.includes("already initialized")) {
          throw initErr;
        }
      }

      // Load the larp jar
      let lib = window.__larpLibrary;
      if (!lib) {
        lib = await window.cheerpjRunLibrary("/app/larp.jar");
        window.__larpLibrary = lib;
      }

      const Larp = await lib.larp.Larp;
      window.__larpRuntime = Larp;
      return Larp;
    })().catch((err) => {
      if (typeof window !== "undefined" && window.__larpRuntime) {
        return window.__larpRuntime;
      }
      cheerpjPromise = null; // Reset to allow retry on genuine failure
      throw err;
    });
  }
  return cheerpjPromise;
}

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const exampleId = searchParams.get("example");

  const defaultExample = siteConfig.examples[0];
  const [code, setCode] = useState(defaultExample.code);
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [output, setOutput] = useState("");
  const [runtimeStatus, setRuntimeStatus] = useState("loading"); // "loading" | "ready" | "running" | "error"
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for Java runtime...",
  );
  const textareaRef = useRef(null);

  // Sync example from URL search params
  useEffect(() => {
    if (exampleId) {
      const match = siteConfig.examples.find((ex) => ex.id === exampleId);
      if (match) {
        setCode(match.code);
        setSelectedExampleId(match.id);
      }
    }
  }, [exampleId]);

  // Attempt CheerpJ warm-up once loader script is ready
  const handleScriptReady = useCallback(async () => {
    try {
      setStatusMessage("Connecting to Java runtime...");
      await getLarpRuntime();
      setRuntimeStatus("ready");
      setStatusMessage("Java runtime ready!");
    } catch (err) {
      const msg = String(err?.message || err).toLowerCase();
      if (msg.includes("already initialized")) {
        setRuntimeStatus("ready");
        setStatusMessage("Java runtime ready!");
        return;
      }
      console.error("CheerpJ Init Error:", err);
      setRuntimeStatus("error");
      setStatusMessage("Failed to load Java runtime.");
      setOutput(
        `[JVM Initialization Error]\n${err?.message || err}\n\n` +
          `If web/public/larp.jar is missing, compile it from the repository root:\n` +
          `  javac --release 21 -d out src\\larp\\*.java\n` +
          `  jar cf web\\public\\larp.jar -C out .`,
      );
    }
  }, []);

  // If script was already loaded (e.g. navigation), initialize immediately
  useEffect(() => {
    if (typeof window !== "undefined" && window.cheerpjInit) {
      handleScriptReady();
    }
  }, [handleScriptReady]);

  const handleRun = async () => {
    if (runtimeStatus === "loading" || runtimeStatus === "running") return;

    setRuntimeStatus("running");
    setOutput("Running code in CheerpJ JVM...\n");

    const capturedLogs = [];
    const originalLog = console.log;
    const originalError = console.error;

    // Intercept System.out forwarded to console by CheerpJ
    console.log = (...args) => {
      capturedLogs.push(
        args
          .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
          .join(" "),
      );
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      capturedLogs.push(
        args
          .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
          .join(" "),
      );
      originalError.apply(console, args);
    };

    try {
      const Larp = await getLarpRuntime();
      const res = await Larp.run(code);
      const returnedStr = String(res ?? "").trim();
      const consoleOutput = capturedLogs.join("\n").trim();

      // Display returned string or captured console output
      let finalOutput = "";
      if (returnedStr && consoleOutput) {
        finalOutput =
          returnedStr === consoleOutput
            ? returnedStr
            : `${returnedStr}\n${consoleOutput}`;
      } else {
        finalOutput = returnedStr || consoleOutput;
      }

      setOutput(finalOutput || "(Program executed with no stdout output)");
      setRuntimeStatus("ready");
    } catch (err) {
      console.error("Execution error:", err);
      setRuntimeStatus("error");
      setOutput(
        `[Runtime Error]\n${err?.message || err}\n\n` +
          `Check console logs. If the JAR file is missing, build it via:\n` +
          `  javac --release 21 -d out src\\larp\\*.java\n` +
          `  jar cf web\\public\\larp.jar -C out .`,
      );
    } finally {
      console.log = originalLog;
      console.error = originalError;
    }
  };

  const handleSelectExample = (e) => {
    const id = e.target.value;
    setSelectedExampleId(id);
    const match = siteConfig.examples.find((ex) => ex.id === id);
    if (match) {
      setCode(match.code);
    }
  };

  const handleClear = () => {
    setCode("");
    setOutput("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
      return;
    }

    // Tab key indents with 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newCode = `${code.substring(0, selectionStart)}  ${code.substring(selectionEnd)}`;
      setCode(newCode);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart + 2;
          textareaRef.current.selectionEnd = selectionStart + 2;
        }
      });
    }
  };

  const isJavaLoading = runtimeStatus === "loading";
  const isRunning = runtimeStatus === "running";

  return (
    <>
      {/* CheerpJ 5.0 CDN Loader */}
      <Script
        src="https://cjrtnc.leaningtech.com/5.0/loader.js"
        strategy="afterInteractive"
        onReady={handleScriptReady}
      />

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="retro-card p-4 sm:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-pixel text-3xl sm:text-4xl font-bold">
                ▶ Playground
              </h1>
              <Sticker color="matcha" rotate={1} size="sm">
                CHEERPJ 5.0
              </Sticker>
            </div>
            <p className="font-mono text-xs sm:text-sm text-black/70">
              Run your LarpLang programs client-side via CheerpJ Java
              WebAssembly.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`inline-block w-3 h-3 rounded-full border-2 border-black ${
                runtimeStatus === "ready"
                  ? "bg-[#a3c97d]"
                  : runtimeStatus === "running"
                    ? "bg-[#fed156] animate-pulse"
                    : runtimeStatus === "error"
                      ? "bg-[#fca5a5]"
                      : "bg-black/30 animate-pulse"
              }`}
            />
            <span className="font-bold text-black/80">{statusMessage}</span>
          </div>
        </div>

        {/* Toolbar: Examples Dropdown & Controls */}
        <div className="retro-card-sm p-4 bg-[#faf7ee] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="example-select"
              className="font-mono text-xs font-bold uppercase tracking-wide text-black"
            >
              Load Example:
            </label>
            <select
              id="example-select"
              value={selectedExampleId}
              onChange={handleSelectExample}
              className="retro-card-sm py-1.5 px-3 font-mono text-xs sm:text-sm bg-white cursor-pointer focus:outline-none"
            >
              {siteConfig.examples.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.kind === "breaks" ? "✕ " : "✓ "} {ex.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="retro-btn px-3 py-1.5 bg-white hover:bg-black/5 font-mono text-xs font-bold uppercase"
            >
              Clear
            </button>

            <button
              type="button"
              disabled={isJavaLoading || isRunning}
              onClick={handleRun}
              className={`retro-btn px-5 py-2 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase inline-flex items-center gap-2 ${
                isJavaLoading
                  ? "bg-[#fed156]/50 cursor-wait"
                  : isRunning
                    ? "bg-[#fed156] cursor-wait"
                    : "bg-[#a3c97d] hover:bg-[#a3c97d]/90 text-black"
              }`}
            >
              {isJavaLoading ? (
                <>
                  <span className="animate-spin inline-block text-sm">⟳</span>
                  <span>Loading Java...</span>
                </>
              ) : isRunning ? (
                <>
                  <span className="animate-spin inline-block text-sm">⟳</span>
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <span>▶ Run</span>
                  <span className="hidden sm:inline text-[10px] opacity-70">
                    (Ctrl+Enter)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Split Grid: Editor & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="retro-card bg-white flex flex-col">
            <div className="p-3 border-b-2 border-black bg-[#faf7ee] flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                ● MyProgram.larp
              </span>
              <span className="font-mono text-[10px] text-black/60">
                Press Ctrl+Enter to Run
              </span>
            </div>
            <div className="p-4 flex-1">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={14}
                spellCheck={false}
                placeholder="Write LarpLang code here (e.g. yap 1 + 2 * 3)..."
                className="w-full h-full min-h-[300px] p-3 font-mono text-sm sm:text-base border-2 border-black bg-[#faf7ee] text-black resize-y focus:outline-none focus:bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="retro-card bg-white flex flex-col">
            <div className="p-3 border-b-2 border-black bg-[#faf7ee] flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                ★ Standard Output
              </span>
              <span className="font-mono text-[10px] text-black/60 font-bold">
                From The Console
              </span>
            </div>
            <div className="p-4 flex-1">
              <pre className="w-full h-full min-h-[300px] p-4 font-mono text-sm sm:text-base border-2 border-black bg-[#121212] text-[#4ade80] font-bold overflow-auto whitespace-pre-wrap leading-relaxed">
                {output || (
                  <span className="text-zinc-400 font-normal italic">
                    Output will appear here after clicking &quot;Run&quot; or
                    pressing Ctrl+Enter...
                  </span>
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="retro-card p-10 text-center font-mono text-sm">
          <span className="animate-spin inline-block mr-2">⟳</span>
          Loading Playground...
        </div>
      }
    >
      <PlaygroundContent />
    </Suspense>
  );
}
