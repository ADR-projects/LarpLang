package larp;

import java.util.HashMap;
import java.util.Map;

public class Environment{
    private final Map<String, Object> values = new HashMap<>();
    private final Environment parent;
    public Environment(){
        this.parent = null; // at global scope
    }
    public Environment(Environment parent){
        this.parent = parent;
    }
    public void define(String name, Object value){
        values.put(name, value);
    }
    public Object get(Token name){
        if(values.containsKey(name.lexeme())) return values.get(name.lexeme());
        if(parent != null) return parent.get(name);
        throw new RuntimeException("line "+name.line()+": undefined variable '"+name.lexeme()+"'");
    }
    public void assign(Token name, Object value){
        if(values.containsKey(name.lexeme())){
            values.put(name.lexeme(), value);
            return;
        }
        if(parent != null){
            parent.assign(name, value);
            return;
        }
        throw new RuntimeException("line "+name.line()+": undefined variable '"+name.lexeme()+"'");
    }
}