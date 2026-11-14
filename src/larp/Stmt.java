package larp;
import java.util.ArrayList;
import java.util.List;

public sealed interface Stmt{
    record Print(Expr expression) implements Stmt{}
    record ExprStmt(Expr expression) implements Stmt{}
    record Take(Token name, Expr initializer) implements Stmt{}
    record Block(List<Stmt> statements) implements Stmt{}
    record If(Expr condition, Stmt thenBranch, Stmt elseBranch) implements Stmt{}
    record Until(Expr condition, Stmt body) implements Stmt{}
}
// the statement is basically something that does an action
// it does not give a value back
// eg. print statements or variable declaration
// Expr = Evaluated; Stmt = Executed