# LarpLang

[![Java 21](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![CheerpJ 5.0](https://img.shields.io/badge/WebAssembly-CheerpJ_5.0-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)](https://cheerpj.com/)
[![Status](https://img.shields.io/badge/Status-Phase_6_Live-blue?style=for-the-badge)](#roadmap)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A custom interpreted programming language crafted from first principles in **Java 21**, complete with an interactive in-browser playground running on **WebAssembly**.

---

## Preview

![LarpLang Preview](web/public/larplang.png)

---

## What is LarpLang?

The term *"larp"* originally stands for Live-Action Roleplay, but in internet slang, to larp is to pretend to be something you're not in an exaggerated, tongue-in-cheek way. 

LarpLang was born out of a college compiler design course. Instead of just studying Context-Free Grammars, recursive descent, and Abstract Syntax Trees on slides, the best way to understand them was to build a language engine from scratch. Despite the playful name, the codebase implements genuine compiler architecture principles: clean token scanning, precedence climbing, and robust tree-walking evaluation.

Even better: thanks to **CheerpJ 5.0**, the exact compiled Java engine runs client-side in the browser via WebAssembly without requiring a backend runtime.

---

## Language Syntax & Features

LarpLang swaps standard boilerplate for expressive, lighthearted keywords:

| Keyword | Purpose | Example |
| :--- | :--- | :--- |
| `yap` | Standard output (print line) | `yap "hello world"` |
| `t` / `f` | Boolean literals (`true` / `false`) | `yap (10 > 5) == t` |
| `ghost` | Sentinel null / nil value (evaluates falsy) | `yap !ghost` |
| `take` | Variable definition & binding | `take score = 100` |
| `if` / `else` | Conditional branching based on truthiness | `if (x > 0) { yap "positive" }` |
| `until` | Loop execution repeating while condition holds | `until (i < 5) { i = i + 1 }` |
| `func` / `gimme` | First-class functions and return statements | `func add(a, b) { gimme a + b }` |

### Sample Program

```larp
# Recursive Fibonacci function
func fib(n) {
  if (n <= 1) gimme n
  gimme fib(n - 1) + fib(n - 2)
}

# Loop until 8 numbers are printed
take i = 0
until (i < 8) {
  yap fib(i)
  i = i + 1
}
```

---

## Architecture Pipeline

LarpLang follows a traditional multi-pass interpreter architecture:

```
Source Code (.larp)
        │
        ▼
   [ Lexer.java ]        Scanner converting source characters into Token records with line numbers
        │
        ▼
   [ Parser.java ]       Recursive descent parser handling precedence and constructing AST nodes
        │
        ▼
[ Interpreter.java ]     Tree-walking evaluator executing statements and managing expressions
```

* **AST Representation (`Expr.java`, `Stmt.java`):** Sealed interfaces using Java pattern-matching records (`Binary`, `Unary`, `Literal`, `Grouping`, `Print`).
* **Runtime (`Larp.java`):** Entry point managing parsing pipelines, stream buffering, and exception propagation.

---

## Build Guide

### Prerequisites

* **JDK 21 or newer** (with `javac` and `jar` on your system `PATH`)
* **Node.js 18+** (for running the web playground locally)

---

### 1. Building the Java Engine

From the project root:

**Windows (using build script):**
```cmd
build.bat
```

**Linux / macOS (manual):**
```bash
mkdir -p out
javac --release 21 -d out src/larp/*.java
jar cf web/public/larp.jar -C out .
```

This compiles the class files to `out/` and packages the deployable archive into `web/public/larp.jar` for the web playground.

---

### 2. Running LarpLang via CLI

To run a script from the command line:

```bash
java -cp out larp.Larp test.larp
```

---

### 3. Running the Web Playground Locally

The web frontend is built with Next.js (App Router) and Tailwind CSS:

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site, explore the gallery, or run code interactively in the WebAssembly playground.

---

## Project Structure

## Project Structure

```
LarpLang/
├── src/
│   └── larp/
│       ├── Environment.java     # Symbol table: variable scopes chained by parent
│       ├── Expr.java            # Sealed interface for expression nodes (Binary, Unary, Literal, Grouping, Variable, Assign, Logical, Call)
│       ├── Interpreter.java     # Tree-walking evaluator: statements, expressions, blocks, loop limit
│       ├── Larp.java            # Entry point: run(source) used by the CLI and the web playground
│       ├── LarpCallable.java    # Interface for anything callable (arity + call)
│       ├── LarpFunction.java    # User-defined function with its closure environment
│       ├── Lexer.java           # Token scanner: numbers, strings, identifiers, keywords, comments
│       ├── Parser.java          # Recursive descent parser with operator precedence
│       ├── ReturnSignal.java    # Exception used by gimme to return from a function
│       ├── Stmt.java            # Statement nodes (Print, ExprStmt, Take, Block, If, Until, Func, Return)
│       ├── Token.java           # Immutable token record (type, lexeme, literal, line)
│       └── TokenType.java       # Token types for operators, literals and keywords
├── web/
│   ├── public/
│   │   ├── adr.jpeg             # Developer portrait
│   │   ├── larp.jar             # Compiled interpreter, run in the browser by CheerpJ
│   │   ├── larplang.png         # Project showcase preview
│   │   └── retro-tv.gif         # Visual asset
│   ├── src/
│   │   ├── app/                 # Next.js App Router (About, Playground, Gallery, Contact)
│   │   ├── components/          # UI components (Navbar, Stickers, Icons)
│   │   └── data/content.js      # Central site content & runnable examples
│   └── package.json
├── build.bat                    # Windows build script: compiles Java and writes web/public/larp.jar
├── phases.md                    # Roadmap & compiler phase notes
├── test.larp                    # Sample LarpLang test file
└── README.md
```

---

## Roadmap

- [x] **Phase 1: Lexer** - Full token scanning, keyword mapping, line tracking
- [x] **Phase 2: Parser** - Precedence climbing with recursive descent, grouping
- [x] **Phase 3: Interpreter** - Tree-walking evaluator, truthiness logic, `yap` standard output
- [x] **Phase 4: Environments & Variables** - Lexical scoping with `take` and mutable assignments
- [x] **Phase 5: Control Flow** - Conditional branching (`if`/`else`) and loops (`until`)
- [x] **Phase 6: Functions & Closures** - First-class callables (`func`, `gimme`) and lexical environments
- [🕰️] **Future Scope: Diagnostics & VM** - Rich error recovery and bytecode compilation

---

## Other References

A huge thank you to : [This book](https://craftinginterpreters.com/)

Curious? : [My friend grilled me about this project](Docs/FAQ.md)

[I made a post about this](https://lnkd.in/p/dCkHuFfk)

[TRY IT OUT](https://larp-lang.vercel.app/)

---

## License

This project is open-source under the [MIT License](LICENSE).
