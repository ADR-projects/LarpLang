package larp;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.io.IOException;

public class Larp{
    public static void main(String[] args){
        if(args.length == 0){
            System.out.println("Please provide a file as argument.");
            return;
        }
        try{
            String source = Files.readString(Path.of(args[0]));
            // System.out.println(source);
            List<Token> tokens = new Lexer(source).scan();
            List<Stmt> statements = new Parser(tokens).parse();
            new Interpreter(System.out).interpret(statements);
//            Expr expr = new Parser(tokens).parse();
//            for (Token token : tokens) {
//                System.out.println(token);
//            }
        } catch (IOException e) {
            System.out.println("Could not read file: " + e.getMessage());
        }
        catch (RuntimeException e) {
            System.out.println("There is a run-time exception " + e.getMessage());
        }
    }
}