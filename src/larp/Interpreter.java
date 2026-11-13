package larp;
import java.io.PrintStream;
import java.util.List;

public class Interpreter{
    private final PrintStream out;
    public Interpreter(PrintStream out){
        this.out = out;
    }
    public void interpret(List<Stmt> statements){
        for(Stmt stmt : statements){
            execute(stmt);
        }
    }
    // statements
    public void execute(Stmt stmt){
        switch (stmt){
            case Stmt.Print p -> out.println(stringify(evaluate(p.expression())));
            case Stmt.ExprStmt e -> evaluate(e.expression());
        }
    }
    // expression
    Object evaluate(Expr expr){
        return switch(expr){
            case Expr.Literal l -> l.value();
            case Expr.Grouping g -> evaluate(g.expression());
            case Expr.Unary u -> evalUnary(u);
            case Expr.Binary b -> evalBinary(b);
        };
    }
    private Object evalUnary(Expr.Unary u){
        Object right = evaluate(u.right());
        return switch(u.operator().type()){
            case MINUS -> {
                checkNumbers(u.operator(), right);
                yield -(double) right;
            }
            case BANG -> !isTruthy(right);
            default -> null;
        };
    }
    private Object evalBinary(Expr.Binary b){

    }
}