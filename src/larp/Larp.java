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
            for (Token token : tokens) {
                System.out.println(token);
            }
        } catch (IOException e) {
            System.out.println("Could not read file: " + e.getMessage());
        }
    }
}