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
                yield -(double) right; // object is treated as double & flipped
            }
            case BANG -> !isTruthy(right);
            default -> null;
        };
    }
    private Object evalBinary(Expr.Binary b){
        Object left = evaluate(b.left());
        Object right = evaluate(b.right());
        Token op = b.operator();
        switch(op.type()){
            case PLUS:
                if(left instanceof Double l && right instanceof Double r)
                    return (l+r);
                if(left instanceof String || right instanceof String)
                    return stringify(left) + stringify(right);
                throw error(op, "operands must be two numbers or two strings");
            case MINUS:
                checkNumbers(op, left, right);
                return (double) left - (double) right;
            case STAR:
                checkNumbers(op, left, right);
                return (double) left * (double) right;
            case SLASH:
                checkNumbers(op, left, right);
                return (double) left / (double) right;
            case MODULO:
                checkNumbers(op, left, right);
                return (double) left % (double) right;
            case GREATER:
                checkNumbers(op, left, right);
                return (double) left > (double) right;
            case GREATER_EQUAL:
                checkNumbers(op, left, right);
                return (double) left >= (double) right;
            case LESS:
                checkNumbers(op, left, right);
                return (double) left < (double) right;
            case LESS_EQUAL:
                checkNumbers(op, left, right);
                return (double) left <= (double) right;
            case EQUAL_EQUAL:
                return isEqual(left, right);
            case BANG_EQUAL:
                return !isEqual(left, right);
            default:
                return null;
        }
    }
    // helper functions
    private boolean isTruthy(Object value){
        if(value == null) return false;
        if(value instanceof Boolean b) return b; // t, f
        return true;
    }
    private boolean isEqual(Object a, Object b){
        if(a == null && b == null) return true;
        if(a == null) return false;
        return a.equals(b);
    }
    private void checkNumbers(Token op, Object... operands){
        // ... means varargs so any number of Object args is accepted
        for(Object o : operands){
            if(!(o instanceof Double)) throw error(op, "operand must be a number");
        }
    }
    private RuntimeException error(Token token, String message) {
        return new RuntimeException("line " + token.line() + ": " + message);
    }

    private String stringify(Object value) {
        if (value == null) return "ghost";
        if (value instanceof Boolean b) return b ? "t" : "f";
        if (value instanceof Double d) {
            String text = d.toString();
            if (text.endsWith(".0")) text = text.substring(0, text.length() - 2);
            return text;
        }
        return value.toString();
    }
}