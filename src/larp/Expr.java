package larp;
import java.util.List;
import java.util.ArrayList;

public sealed interface Expr{
    record Unary(Token operator, Expr right) implements Expr{}
    record Binary(Expr left, Token operator, Expr right) implements Expr{}
    record Literal(Object value) implements Expr{}
    record Grouping(Expr expression) implements Expr{}
    record Variable(Token name) implements Expr{}
    record Assign(Token name, Expr value) implements Expr{}
    record Logical(Expr left, Token operator, Expr right) implements Expr{}
    record Call(Expr callee, Token paren, List<Expr> arguments) implements Expr{}
 }
// Expr is something that produces a value like 1+2
// the interpreter evaluates it.
// Each component in a record is a method not field. Remember