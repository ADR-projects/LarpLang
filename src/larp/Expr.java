package larp;

public sealed interface Expr{
    record Unary(Token operator, Expr right) implements Expr{};
    record Binary(Expr left, Token operator, Expr right) implements Expr{};
    record Literal(Object value) implements Expr{};
    record Grouping(Expr expression) implements Expr{};
}