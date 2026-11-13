// All editable content for LarpLang website
export const siteConfig = {
  name: "LARPLANG",
  title: "LarpLang",
  tagline: "A toy interpreted language built from scratch in Java.",
  description:
    "LarpLang is an educational programming language crafted from first principles in Java. It features an interactive in-browser playground powered by CheerpJ.",
  status:
    "Status: Phase 3: Lexer, recursive descent parser, and expression tree interpreter are live.",
  githubUrl: "https://github.com/placeholder/larplang",
  contact: {
    email: "creator@larplang.dev",
    twitter: "https://x.com/placeholder",
    discord: "https://discord.gg/placeholder",
    author: "LarpLang Team",
    location: "The Internet",
  },
  socialLinks: [
    {
      label: "★ GitHub",
      url: "https://github.com/placeholder/larplang",
      external: true,
    },
    {
      label: "✦ Twitter / X",
      url: "https://x.com/placeholder",
      external: true,
    },
    {
      label: "● Discord Community",
      url: "https://discord.gg/placeholder",
      external: true,
    },
    {
      label: "✉ creator@larplang.dev",
      url: "mailto:creator@larplang.dev",
      external: false,
    },
  ],
  pipeline: [
    { step: "Source Code", desc: ".larp plain text input" },
    {
      step: "Lexer",
      desc: "Character stream to token stream with line tracking",
    },
    {
      step: "Parser",
      desc: "Recursive descent parser producing AST expressions",
    },
    {
      step: "Interpreter",
      desc: "Tree-walking evaluator executing statements in Java",
    },
  ],
  keywords: [
    {
      name: "yap",
      meaning: "Prints expression value followed by newline to stdout",
      category: "I/O",
      color: "matcha",
    },
    {
      name: "let",
      meaning: "Declares a block-scoped variable binding with lexical scoping",
      category: "Binding",
      color: "yellow",
    },
    {
      name: "if / else",
      meaning: "Conditional branching evaluated by truthiness",
      category: "Control",
      color: "blue",
    },
    {
      name: "until",
      meaning: "Loop execution repeating until condition holds true",
      category: "Control",
      color: "mint",
    },
    {
      name: "func",
      meaning: "Defines a reusable callable closure function",
      category: "Functions",
      color: "yellow",
    },
    {
      name: "gives",
      meaning: "Returns an evaluated value from an active function",
      category: "Functions",
      color: "matcha",
    },
    {
      name: "t / f",
      meaning: "Boolean literal values representing true and false",
      category: "Literal",
      color: "mint",
    },
    {
      name: "ghost",
      meaning: "Sentinel representing null / no-value; evaluates falsy",
      category: "Literal",
      color: "blue",
    },
  ],
  examples: [
    {
      id: "arithmetic-precedence",
      title: "Math & Precedence",
      description:
        "Standard PEMDAS order of operations and grouped parentheses.",
      kind: "works",
      code: `yap 1 + 2 * 3
yap (1 + 2) * 3
yap 10 - 4 - 2`,
    },
    {
      id: "division-modulo",
      title: "Division & Modulo",
      description:
        "Floating-point division, remainder operations, and unary negation.",
      kind: "works",
      code: `yap 10 / 4
yap 10 % 3
yap -5 + 20`,
    },
    {
      id: "strings-concat",
      title: "Strings & Concatenation",
      description:
        "String literals and automatic coercion when concatenating numbers.",
      kind: "works",
      code: `yap "Hello, " + "LarpLang!"
yap "Level: " + 99`,
    },
    {
      id: "comparisons",
      title: "Relational Comparisons",
      description: "Testing greater-than, less-than, and exact equality.",
      kind: "works",
      code: `yap 10 > 5
yap 3 <= 2
yap 1 == 1
yap "a" == "b"`,
    },
    {
      id: "booleans-and-ghost",
      title: "Truthiness & Ghost",
      description:
        "Logical NOT with boolean literals and the ghost (null) sentinel.",
      kind: "works",
      code: `yap !ghost
yap !f
yap !t
yap ghost`,
    },
    {
      id: "syntax-error",
      title: "Syntax Error Check",
      description:
        "Demonstrates parser error reporting on missing closing parenthesis.",
      kind: "breaks",
      code: `yap (1 + 2`,
    },
  ],
};
