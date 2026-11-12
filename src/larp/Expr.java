package larp;

public sealed interface Expr{
    record Unary(Token op, Expr right) implements Expr{};
    record Binary(Expr left, Token op, Expr left) implements Expr{};
    record Literal(Object value) implements Expr{};
    record Grouping(Expr expression) implements Expr{};
}