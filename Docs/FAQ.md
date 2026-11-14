# LarpLang: FAQ

"LarpLang is a pretty small, custom programming language I built in Java, with its own syntax (`take`, `yap`, `until`, `func`, `gimme`). I wrote the lexer, a recursive descent parser, and a tree-walking interpreter with scopes, closures and recursion. It also runs live in the browser through a web playground."

```
source code -> Lexer -> tokens -> Parser -> Interpreter -> output
```

---

## What kind of questions might an Interviewer ask? (I am taking a guess)

**What is LarpLang?**
A dynamically typed, interpreted language written in Java 21. It has numbers, strings, booleans, `ghost` (null), variables, `if/else`, `until` loops, functions, closures and recursion.

**Compiler or interpreter?**
Interpreter. It builds a tree from the code and runs the tree directly. It has the front half of a compiler (lexing, parsing, syntax tree). If it were a compiler, it would also convert the tree into bytecode or machine code.

**What does the lexer do?**
Lexical analysis. It reads characters and groups them into tokens. It handles numbers, strings, identifiers, operators (including two-character ones like `==` and `>=`) and comments, and tracks line numbers. A keyword map decides if a word is a keyword or a variable name.

**What is a token?**
A record with four fields: `type` (kind), `lexeme` (exact text), `literal` (actual value) and `line` (for error messages).

**What does the parser do?**
Syntax analysis. It checks that tokens follow the grammar and builds the AST.

**What is recursive descent?**
A top-down parsing method. Each grammar rule is one method, and each rule calls the rules below it. One token of lookahead decides which path to take.

**How is operator precedence handled?**
By the order of method calls. The lowest-precedence rule is called first and calls the next one down: assignment, or, and, equality, comparison, term, factor, unary, call, primary. Higher-precedence operators end up deeper in the tree, so they run first. In `1 + 2 * 3`, the `2 * 3` is built before the `+`.

**How is associativity handled?**
Each binary rule uses a `while` loop, and each loop wraps the old left side in a new node. So `1 - 2 - 3` becomes `(1 - 2) - 3` (left-associative).

**What is the grammar type?**
A context-free grammar, written in EBNF-style notation in the Parser's comments.


**Why separate `Expr` and `Stmt`?**
An `Expr` produces a value (`1 + 2`, `x`). A `Stmt` performs an action and gives no value (`yap`, `take`, `if`). Keeping them apart stops invalid code like `1 + yap 2` at the type level. `ExprStmt` wraps an expression so it can stand alone as a line.

**Why records and sealed interfaces?**
Records are immutable data classes with automatic accessors. Sealed interfaces fix the list of subtypes, so the compiler checks that every `switch` handles all node types.

**How does the interpreter work?**
It is tree-walking. `execute(Stmt)` and `evaluate(Expr)` use a pattern-matching `switch` on the node type and call themselves recursively, following the shape of the tree.

**Why is the value type `Object`?**
The language is dynamically typed. A value can be a `Double`, `String`, `Boolean`, `null` (`ghost`) or a function. Types are checked at runtime with `instanceof`.

**What is truthy and falsy?**
Only `ghost` and `f` are false. Everything else is true, including `0` and `""`.

**How do variables and scope work?**
Through `Environment`, a symbol table. It holds a `HashMap` of names to values and a `parent` pointer to the outer scope. Lookup checks the current scope, then walks up the parent chain. Each `{ }` block creates a new `Environment`.

**`define` vs `assign`?**
`define` creates a variable in the current scope. `assign` updates an existing one, searching outward, and errors if none is found.

**What is a closure?**
A function plus the scope it was defined in. `LarpFunction` stores that scope. When called, it creates a new scope whose parent is the stored one, not the caller's. This is lexical scoping, and it is why a counter function can keep its variable alive after the outer function returns.

**How does `gimme` (return) work?**
It throws a `ReturnSignal` exception holding the value. The exception unwinds through blocks and loops back to `LarpFunction.call`, which catches it and returns the value. It is used as a jump, not as an error, so it skips stack-trace creation.

**How does short-circuiting work?**
For `and` / `or`, if the left side already decides the result, the right side is never evaluated. The operand itself is returned, so `ghost or "x"` gives `"x"`.

**How does recursion work?**
Every call creates a new `Environment`, and Java's own call stack handles the nesting. `StackOverflowError` is caught and reported as "too much recursion".

**How are errors reported?**
Tokens carry line numbers, so the lexer, parser and interpreter all throw messages like `line 3: undefined variable 'x'`. In the parser, `consume(type, message)` means "this token is required here, or fail with this message".

**How are infinite loops handled?**
A counter stops the program after 1,000,000 loop iterations, shared across all loops.

**How did you test it?**
With example `.larp` programs (math, variables, loops, `fib`, closures) compared against expected output, plus error cases like undefined variables and missing brackets.

---

## 3. Syllabus mapping

| Compiler design topic | In LarpLang |
|---|---|
| Lexical analysis | `Lexer`, `Token` |
| Context-free grammar | Grammar in Parser comments |
| Syntax analysis (parsing) | `Parser`, recursive descent |
| Syntax tree | `Expr`, `Stmt` |
| Symbol table, scope | `Environment` |
| Basic semantic checks | Runtime type checks, undefined variable errors |
| Error reporting | Line-numbered messages |

**Not covered: (FUTURE SCOPE)** intermediate code generation, code optimization, target code generation, and a separate semantic analysis pass.

---

## My friend is asking me a lot of questions too. 

**"Isn't this just a tutorial project?"**
The structure follows *Crafting Interpreters*, which I used to learn. I adapted it to Java records and pattern matching, designed my own syntax, and put it online with a browser playground. I can explain every file. Or at least try to...

**"So it's not a real compiler?"**
Correct, it's an interpreter. BUT hear me out, it implements the front end of a compiler. The next steps would be a resolver pass, constant folding, and bytecode with a stack VM.

**"Why does `until` run while the condition is true?"**
In most languages `until` means the opposite. I kept it as a while-style loop on purpose. Flipping it is one `!` in the `Until` case of the interpreter.

**"Why Java?"**
It's the language I'm most comfortable with.

**"Why slang keywords?"**
They make the language memorable. They're not bad words, it's just meant to be light-hearted.


**"Is it statically or dynamically typed?"**
Dynamically. There are no type declarations, and types are checked at runtime.

**"What does `1 / 0` do?"**
All numbers are Java `double`, so it gives `Infinity`, not an error.

**"Is it Turing complete?"**
In theory, yes. It has variables, conditionals, loops and recursion. The loop limit and memory restrict real programs.

**"How fast is variable lookup?"**
One hash lookup per scope, so it grows with how deeply scopes are nested. A resolver pass could replace this with fixed slots.

**"How would you make it faster?"**
Compile the AST to bytecode and run it on a stack VM, resolve variables ahead of time, and fold constants like `2 * 3`.

**"What's missing?"**
Arrays, classes, `for` loops, string escapes, a static resolver pass, and type checking. Also, without semicolons, `yap 1` followed by `-2` on the next line parses as `yap 1 - 2`. We yearn for Data structures.

**"What was the hardest part?"**
Understanding the precedence.

**"Can I crash it?"**
Infinite loops are capped, deep recursion is caught, and bad syntax gives a line-numbered message.

**"Is it safe to run anyone's code on your site?"**
The code runs inside the visitor's own browser, never on my server.

---

## How the CheerpJ playground works

**What is CheerpJ?**
A Java runtime compiled to WebAssembly by Leaning Technologies. It runs Java code inside the browser, so no Java server is needed. This matters because Vercel cannot run Java.

**Where did the script link come from?**
From CheerpJ's official docs (cheerpj.com, the "Run a Java library" page). The docs give a loader script tag:

```
https://cjrtnc.leaningtech.com/4.3/loader.js
```

- `leaningtech.com` is the company that makes CheerpJ. The URL is their CDN, which hosts the runtime.
- The number in the URL is the CheerpJ version. Check the docs for the current one before relying on it.
- Nothing is installed with npm. The script is loaded from the CDN at runtime.

**Steps the website follows**

1. **Build the jar.** `build.bat` compiles the Java with `--release 21` and packs it into `web/public/larp.jar`.
2. **Serve it as a static file.** Next.js serves `public/` at the site root. CheerpJ maps `/app/` to the web server root, so the jar path is `/app/larp.jar`.
3. **Load the loader script.** The playground component (`"use client"`) uses `next/script` with `onReady` to load it.
4. **Start the JVM.** `cheerpjInit({ version: 21 })` starts the in-browser Java runtime.
5. **Load the jar.** `cheerpjRunLibrary("/app/larp.jar")` returns a handle to it.
6. **Get the class.** `await lib.larp.Larp` returns the Java class `larp.Larp`.
7. **Call Java from JavaScript.** `await Larp.run(code)` calls the static method `run(String)`, which returns the program's output as a String.
8. **Show the output.** The String goes into the output panel.

**Why `run()` returns a String**
`Larp.run` creates a `ByteArrayOutputStream` and a `PrintStream`, hands the stream to the `Interpreter`, and returns whatever was printed. It also catches errors and adds their messages to the output. This is why the interpreter takes a `PrintStream` instead of using `System.out` directly.

**Init only once**
The init promise is cached at module level, so leaving and returning to the page does not start CheerpJ a second time.

**Updating the site after Java changes**

```
edit Java -> build.bat -> git add . -> git commit -> git push
```

Vercel then redeploys. If the old behavior still shows, hard refresh (Ctrl+Shift+R) because the jar may be cached.

**Why CheerpJ and not a Java backend?**
No server to run, pay for, or protect, and visitors' code runs in their own browser. The tradeoff is a slower first load while the runtime downloads.

**Gotchas**
- First load takes a few seconds, so the button says "Loading Java..." until ready.
- Class files must be compatible with the Java version CheerpJ is started with (21 here).
- Infinite loops would freeze the visitor's tab, which is why the loop limit exists.
- Check CheerpJ's license page if the site is ever used commercially.