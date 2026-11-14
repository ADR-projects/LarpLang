package larp;

import java.util.List;

public class LarpFunction implements LarpCallable {
    private final Stmt.Func declaration;
    private final Environment closure;
    // closure = scope where function was defined
    LarpFunction(Stmt.Func declaration, Environment closure){
        this.declaration = declaration;
        this.closure = closure;
    }
    public int arity(){
        return declaration.params().size();
    }
    public Object call(Interpreter interpreter, List<Object> args){
        Environment env = new Environment(closure);
        for(int i=0; i<declaration.params().size(); i++){
            env.define(declaration.params().get(i).lexeme(), args.get(i));
        }
        try{
            interpreter.executeBlock(declaration.body(), env);
        }
        catch (ReturnSignal r){
            return r.value;
        }
        return null;
    }
    @Override
    public String toString(){
        return "<func "+ declaration.name().lexeme() + ">";
    }
}