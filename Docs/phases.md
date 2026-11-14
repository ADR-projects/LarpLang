No installs needed. Plain JDK 17+. Every phase ends with something you can run and see.

**Phase 0: Setup (10 min)**
- Create a class `Larp` with `main`. Read a file using `Files.readString(Path.of(args[0]))` (`java.nio.file.Files`, `java.nio.file.Path`).
- Make a file `test.larp`.
- **See:** it prints your file's text.

**Phase 1: Lexer**
- **Study:** what a token is, and how to loop over characters with an index.
- Create `enum TokenType` (`NUMBER`, `STRING`, `IDENT`, `PLUS`, `TAKE`, `YAP`, `EOF`, ...).
- Create `record Token(TokenType type, String lexeme, Object literal, int line)`.
- Create `class Lexer` with `List<Token> scan()`. Use `peek()` and `advance()` helpers.
- Put keywords in a `Map<String, TokenType>` (`java.util.Map`). After reading an identifier, check the map.
- **See:** `take x = 5` prints a list of tokens.
- remember to compile from src directory, javac larp/Larp.java then java larp/Larp

**Phase 2: Expression parser**
- **Study:** recursive descent and operator precedence.
- Create `sealed interface Expr` with records inside it: `Binary`, `Unary`, `Literal`, `Grouping`.
- Create `class Parser` taking `List<Token>`. One method per precedence level, lowest to highest: `equality()`, `comparison()`, `term()`, `factor()`, `unary()`, `primary()`. Each calls the next one.
- **See:** `1 + 2 * 3` prints a tree with `*` nested under `+`.

**Phase 3: Interpreter (first real output)**
- Create `sealed interface Stmt` with records `Print(Expr e)` and `ExprStmt(Expr e)`. Teach `Parser` to parse `yap`.
- Create `class Interpreter` with `Object evaluate(Expr e)`. Use `switch` with pattern matching on the record types.
- Decide truthiness: `ghost` and `f` are false, everything else is true.
- **See:** `yap 1 + 2 * 3` prints `7`.

**Phase 4: Variables**
- **Study:** scope and symbol tables.
- Create `class Environment` with a `HashMap<String, Object>` and a `parent` field. `define`, `get`, `assign`. If a name isn't found, look in `parent`.
- Add `Stmt.Let`, `Expr.Variable`, `Expr.Assign`.
- **See:** `take x = 5` then `yap x + 1` prints `6`.

**Phase 5: Control flow**
- Add `Stmt.Block` (new `Environment` with the current one as parent), `Stmt.If`, `Stmt.Until`, and `Expr.Logical` for `and`/`or`.
- In the interpreter, `Until` is just a Java `while` loop.
- **See:** a countdown loop prints 3, 2, 1.

**Phase 6: Functions**
- **Study:** closures. A function must remember the `Environment` it was defined in.
- Add `Stmt.Func`, `Expr.Call`, and `interface LarpCallable { Object call(Interpreter i, List<Object> args); }`.
- Create `class LarpFunction implements LarpCallable` that stores the declaration and its `Environment`.
- For `gimme`, create `class ReturnSignal extends RuntimeException` holding the value. Throw it in `gimme`, catch it in `LarpFunction.call`.
- **See:** a recursive `fib` function prints correct values.

**Phase 7: Error handling**
- Create `class LarpError extends RuntimeException` with a line number.
- In the parser, throw it on bad syntax. In `Larp`, catch it and print `line 4: expected ')'`.
- **See:** broken code gives a clear message instead of a Java stack trace.

**Reference:** *Crafting Interpreters*, chapters 4 to 10, matches these phases in order. Use it when you get stuck on a phase.

**Two small decisions to make early:**
- `until` normally means "loop until the condition becomes true". You listed it as a while loop. Pick one and stick to it.
- Making `t` and `f` keywords means nobody can name a variable `t` or `f`. Fine, just know it.

After Phase 7, say so and I'll map the next steps to your compiler syllabus (resolver pass, bytecode, VM).