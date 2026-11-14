package larp;

import java.util.List;

public interface LarpCallable {
    int arity();
    Object call(Interpreter interpreter, List<Object> args);
}
// arity =  the number of arguments a function expects.