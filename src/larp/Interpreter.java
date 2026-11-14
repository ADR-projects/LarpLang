package larp;
import java.io.PrintStream;
import java.util.List;

public class Interpreter{
    private final PrintStream out;
    public Interpreter(PrintStream out){
        this.out = out;
    }
    private Environment environment = new Environment();

    public void interpret(List<Stmt> statements){
        for(Stmt stmt : statements){
            execute(stmt);
        }
    }
    // statements
    public void execute(Stmt stmt){
        switch (stmt){
            case Stmt.Take t -> {
                // default init take x is null aka ghost
                Object value = null;
                if(t.initializer() != null) value = evaluate(t.initializer());
                environment.define(t.name().lexeme(), value);
            }
            case Stmt.Print p -> out.println(stringify(evaluate(p.expression())));
            case Stmt.ExprStmt e -> evaluate(e.expression());
            case Stmt.Block b -> executeBlock(b.statements(), new Environment(environment));
            case Stmt.If i -> {
                if(isTruthy(evaluate(i.condition()))) execute(i.thenBranch());
                else if(i.elseBranch() != null) execute(i.elseBranch());
            }
            case Stmt.Until u -> {
                while(isTruthy(evaluate(u.condition()))) execute(u.body());
            }
        }
    }
    private void executeBlock(List<Stmt> statements, Environment blockEnv){
        Environment previous = this.environment;
        try{
            this.environment = blockEnv;
            for(Stmt s: statements) execute(s);
        }
        finally{
            this.environment = previous; // restore even if error is thrown
        }
    }
    // expression
    Object evaluate(Expr expr){
        return switch(expr){
            case Expr.Variable v -> environment.get(v.name());
            case Expr.Assign a -> evalAssign(a);
            case Expr.Literal l -> l.value();
            case Expr.Grouping g -> evaluate(g.expression());
            case Expr.Unary u -> evalUnary(u);
            case Expr.Binary b -> evalBinary(b);
            case Expr.Logical l -> evalLogical(l);
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
    private Object evalLogical(Expr.Logical l){
        Object left = evaluate(l.left());
        if(l.operator().type() == TokenType.OR){
            if(isTruthy(left)) return left;
        }
        else{
            if(!isTruthy(left)) return left;
        }
        return evaluate(l.right());
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
    private Object evalAssign(Expr.Assign a) {
        Object value = evaluate(a.value());
        environment.assign(a.name(), value);
        return value;                                 // assignment is an expression, it gives a value
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