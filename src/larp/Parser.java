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
            statements.add(declaration());
        }
        return statements;
    }
    private Stmt declaration(){
        if(match(TAKE)) return takeDeclaration();
        if(match(FUNC)) return funcDeclaration();
        return statement();
    }
    private Stmt takeDeclaration(){
        Token name = consume(IDENT, "expected variable name");
        Expr initializer = null;
        if(match(EQUAL)) initializer = expression();
        return new Stmt.Take(name, initializer);
    }
    private Stmt statement(){
        if(match(YAP)) return printStatement();
        if(match(IF)) return ifStatement();
        if(match(UNTIL)) return untilStatement();
        if(match(LEFT_BRACE)) return new Stmt.Block(block());
        if(match(GIMME)) return returnStatement();
        return expressionStatement();
    }
    private Stmt funcDeclaration(){
        Token name = consume(IDENT, "expected function name");
        consume(LEFT_PAREN, "expected '(' after function name");
        List<Token> params = new ArrayList<>();
        if (!check(RIGHT_PAREN)){
            do {
                params.add(consume(IDENT, "expected parameter name"));
            } while (match(COMMA));
        }
        consume(RIGHT_PAREN, "expected ')' after parameters");
        consume(LEFT_BRACE, "expected '{' before function body");
        List<Stmt> body = block();
        return new Stmt.Func(name, params, body);
    }

    private Stmt returnStatement(){
        Token keyword = previous();
        Expr value = expression();          // gives always needs a value, use "gives ghost" for nothing
        return new Stmt.Return(keyword, value);
    }
    private Stmt printStatement(){
        Expr value = expression();
        return new Stmt.Print(value);
    }
    private Stmt ifStatement(){
        consume(LEFT_PAREN, "expected '(' after 'if'");
        Expr condition = expression();
        consume(RIGHT_PAREN, "expected ')' afer condition");

        Stmt thenBranch = statement();
        Stmt elseBranch = null;
        if(match(ELSE)) elseBranch = statement();

        return new Stmt.If(condition, thenBranch, elseBranch);
    }

    private Stmt untilStatement(){
        consume(LEFT_PAREN, "expected '(' after 'if'");
        Expr condition = expression();
        consume(RIGHT_PAREN, "expected ')' afer condition");
        Stmt body = statement();
        return new Stmt.Until(condition, body);
    }

    private List<Stmt> block(){
        List<Stmt> statements = new ArrayList<>();
        while(!check(RIGHT_BRACE) && !isAtEnd()){
            statements.add(declaration());
        }
        consume(RIGHT_BRACE, "expected '}'");
        return statements;
    }

    private Stmt expressionStatement() {
        // for any statment that contains valid expression.
        Expr expr = expression();
//        match(SEMICOLON);
        return new Stmt.ExprStmt(expr);
    }

    private Expr expression() {
        return assignment();
    }

    private Expr assignment(){
        Expr expr = logicOr();
        if(match(EQUAL)) {
            Token equals = previous();
            Expr value = assignment(); // allow a = b = 5
            if(expr instanceof Expr.Variable v){
                return new Expr.Assign(v.name(), value);
            }
            throw error(equals, "invalid assignment target");
        }
        return expr;
    }

    private Expr logicOr() {
        Expr left = logicAnd();
        while (match(OR)) {
            Token op = previous();
            Expr right = logicAnd();
            left = new Expr.Logical(left, op, right);
        }
        return left;
    }

    private Expr logicAnd() {
        Expr left = equality();
        while (match(AND)) {
            Token op = previous();
            Expr right = equality();
            left = new Expr.Logical(left, op, right);
        }
        return left;
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
        return call();
    }
    private Expr call(){
        Expr expr = primary();
        while(match(LEFT_PAREN)){
            expr = finishCall(expr);
        }
        return expr;
    }
    private Expr finishCall(Expr callee){
        List<Expr> arguments = new ArrayList<>();
        if(!check(RIGHT_PAREN)){
            do{
                arguments.add(expression());
            } while(match(COMMA));
        }
        Token paren = consume(RIGHT_PAREN, "expected ')' after the args");
        return new Expr.Call(callee, paren, arguments);
    }
    private Expr primary() {
        if(match(IDENT))
            return new Expr.Variable(previous());

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