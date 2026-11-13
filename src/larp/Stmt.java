package larp;
public sealed interface Stmt{
    record Print(Expr e) implements Stmt{}
    record ExprStmt(Expr e) implements Stmt{}
}
// the statement is basically a full completed expression