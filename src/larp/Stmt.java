package larp;
public sealed interface Stmt{
    record Print(Expr expression) implements Stmt{}
    record ExprStmt(Expr expression) implements Stmt{}
}
// the statement is basically a full completed expression