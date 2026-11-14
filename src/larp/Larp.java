package larp;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class Larp{
    public static String run(String source){
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        PrintStream out = new PrintStream(buffer, true, StandardCharsets.UTF_8);
        try{
            List<Token> tokens = new Lexer(source).scan();
            List<Stmt> statements = new Parser(tokens).parse();
            new Interpreter(System.out).interpret(statements);
        }
        catch (RuntimeException e){
            out.println(e.getMessage());
        }
        catch(StackOverflowError e){
            out.println("stack overflow: too much recursion");
        }
        return buffer.toString(StandardCharsets.UTF_8);
    }
    public static void main(String[] args){
        if(args.length == 0){
            System.out.println("Please provide a file as argument.");
            return;
        }
        try{
            String source = Files.readString(Path.of(args[0]));
            System.out.print(run(source));
        } catch (IOException e) {
            System.out.println("Could not read file: " + e.getMessage());
        }
        catch (RuntimeException e) {
            System.out.println("There is a run-time exception " + e.getMessage());
        }
    }
}