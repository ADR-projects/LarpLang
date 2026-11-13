package larp;
/*
a component of a compiler, interpreter, or software program
that analyzes a sequence of input tokens or text
and converts it into a structured representation,
such as a parse tree or Abstract Syntax Tree (AST)

expression -> equality
equality   -> comparison ( ("==" | "!=") comparison )*
comparison -> term ( (">" | ">=" | "<" | "<=") term )*
term       -> factor ( ("+" | "-") factor )*
factor     -> unary ( ("*" | "/" | "%") unary )*
unary      -> ("!" | "-") unary | primary
primary    -> NUMBER | STRING | t | f | ghost | "(" expression ")"
**/

import java.util.List;
import static larp.TokenType.*;
import java.util.ArrayList;

public class Parser {
    private final List<Token> tokens;
    private int current = 0;

    public Parser(List<Token> tokens) {
        this.tokens = tokens;
    }

    public List<Stmt> parse() {
        List<Stmt> statements = new ArrayList<>();
        while (!isAtEnd()) {
            statements.add(statement());
        }
        return statements;
    }
    private Stmt statement(){
        if(match(YAP)) return printStatement();
        return expressionStatement();
    }
    private Stmt printStatement(){
        Expr value = expression();
        return new Stmt.Print(value);
    }
    private Stmt expressionStatement() {
        // for any statment that contains valid expression.
        Expr expr = expression();
//        match(SEMICOLON);
        return new Stmt.ExprStmt(expr);
    }
    private Expr expression() {
        return equality();
    }

    private Expr equality() {
        Expr left = comparison();
        while (match(BANG_EQUAL, EQUAL_EQUAL)) {
            Token op = previous();
            Expr right = comparison();
            left = new Expr.Binary(left, op, right);
        }
        return left;
    }

    private Expr comparison() {
        Expr left = term();
        while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
            Token op = previous();
            Expr right = term();
            left = new Expr.Binary(left, op, right);
        }
        return left;
    }

    private Expr term() {
        Expr left = factor();
        while (match(PLUS, MINUS)) {
            Token op = previous();
            Expr right = factor();
            left = new Expr.Binary(left, op, right);
        }
        return left;
    }

    private Expr factor() {
        Expr left = unary();
        while (match(STAR, SLASH, MODULO)) {
            Token op = previous();
            Expr right = unary();
            left = new Expr.Binary(left, op, right);
        }
        return left;
    }

    private Expr unary() {
        if (match(BANG, MINUS)) {
            Token op = previous();
            Expr right = unary();          // recursion allows --5 and !!t
            return new Expr.Unary(op, right);
        }
        return primary();
    }

    private Expr primary() {
        if (match(NUMBER, STRING, T, F, GHOST)) {
            return new Expr.Literal(previous().literal());
        }
        if (match(LEFT_PAREN)) {
            Expr expr = expression();
            consume(RIGHT_PAREN, "expected ')'");
            return new Expr.Grouping(expr);
        }
        throw error(peek(), "expected expression");
    }

    // helper functions

    private boolean match(TokenType... types) {   // if current token matches, consume it
        for (TokenType type : types) {
            if (check(type)) {
                advance();
                return true;
            }
        }
        return false;
    }

    private boolean check(TokenType type) {
        return peek().type() == type;
    }

    private Token advance() {
        if (!isAtEnd()) current++;
        return previous();
    }

    private boolean isAtEnd() {
        return peek().type() == EOF;
    }

    private Token peek() {
        return tokens.get(current);
    }

    private Token previous() {
        return tokens.get(current - 1);
    }

    private Token consume(TokenType type, String message) {
        if (check(type)) return advance();
        throw error(peek(), message);
    }

    private RuntimeException error(Token token, String message) {
        return new RuntimeException("line " + token.line() + ": " + message);
    }
}