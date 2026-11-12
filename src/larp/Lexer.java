package larp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// scan() loops until the end of the file, calling scanToken() once per token.
// scanToken() calls advance() to get one character, then switches on it.
// Single-character tokens like ( or + are added right away.
// two-character tokens like == use match('='). It checks the next character and moves forward only if it matches.
// For strings, numbers and names, it keeps calling advance() while the characters still belong to the token. Then source.substring(start, current) gives the full text.
// For a name, it checks KEYWORDS. If found, it’s a keyword. If not, it’s IDENT.

public class Lexer{
    private final String source;
    private final List<Token> tokens = new ArrayList<>();
    private int start = 0;
    private int current = 0;
    private int line = 1;

    private static final Map<String, TokenType> KEYWORDS = Map.ofEntries(
            Map.entry("let", TokenType.LET),
            Map.entry("yap", TokenType.YAP),
            Map.entry("if", TokenType.IF),
            Map.entry("else", TokenType.ELSE),
            Map.entry("until", TokenType.UNTIL),
            Map.entry("func", TokenType.FUNC),
            Map.entry("gimme", TokenType.GIMME),
            Map.entry("t", TokenType.T),
            Map.entry("f", TokenType.F),
            Map.entry("ghost", TokenType.GHOST),
            Map.entry("and", TokenType.AND),
            Map.entry("or", TokenType.OR)
    );
    public Lexer (String source){
        this.source = source;
    }
    public List<Token> scan(){
        while(!isAtEnd()){
            start = current;
            scanToken();
        }
        tokens.add(new Token(TokenType.EOF, "", null, line));
        return tokens;
    }
    private void scanToken(){
        char c = advance();
        switch(c) { // arrow syntax has no fall through
            case '(' -> addToken(TokenType.LEFT_PAREN);
            case ')' -> addToken(TokenType.RIGHT_PAREN);
            case '{' -> addToken(TokenType.LEFT_BRACE);
            case '}' -> addToken(TokenType.RIGHT_BRACE);
            case '+' -> addToken(TokenType.PLUS);
            case '-' -> addToken(TokenType.MINUS);
            case '*' -> addToken(TokenType.STAR);
            case '%' -> addToken(TokenType.MODULO);
            case ',' -> addToken(TokenType.COMMA);
            case ';' -> addToken(TokenType.SEMICOLON);

            case '!' -> addToken(match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
            case '=' -> addToken(match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
            case '<' -> addToken(match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
            case '>' -> addToken(match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);

            case '/' -> {
                if (match('/')) {
                    // Skip the comment till end of line
                    while (peek() != '\n' && !isAtEnd()) advance();
                } else {
                    addToken(TokenType.SLASH);
                }
            }

            case ' ', '\r', '\t' -> {
            }          // ignore the whitespace
            case '\n' -> line++; // means new line
            case '"' -> string();

            default -> {
                if (isDigit(c)) number();
                else if (isAlpha(c)) identifier();
                else System.err.println("line " + line + ": unexpected character '" + c + "'");
            }
        }
    }
    private void string(){
        while(peek() != '"' && !isAtEnd()){
            if(peek() == '\n') line++;
            advance();
        }
        if(isAtEnd()){
            System.err.println("line "+line+" : unterminated string!");
            return;
        }
        advance();
        String withoutQuotes = source.substring(start + 1, current - 1);
        addToken(TokenType.STRING, withoutQuotes);
    }
    private void number(){
        while(isDigit(peek())){
            advance();
        }
        if(peek() == '.' && isDigit(peekNext())){
            advance(); // move from the dot
            while(isDigit(peek())){
                advance();
            }
        }
        double val = Double.parseDouble(source.substring(start, current));
        addToken(TokenType.NUMBER, val);
    }
    private void identifier(){
        while (isAlpha(peek()) || isDigit(peek())) advance();
        String text = source.substring(start, current);
        TokenType type = KEYWORDS.getOrDefault(text, TokenType.IDENT);

        if (type == TokenType.T) addToken(type, true);
        else if (type == TokenType.F) addToken(type, false);
        else addToken(type);
    }

    // helper functions
    private boolean isAtEnd(){
        return current >= source.length();
    }
    private char advance(){
        return source.charAt(current++);
    }
    private char peek(){ // look at current char
        return isAtEnd()? '\0' : source.charAt(current);
    }
    private char peekNext(){ // look one char further
        return current + 1 >= source.length() ? '\0' : source.charAt(current + 1);
    }
    private boolean match(char expected){ // move forward iff the next char is the expected one
        if(isAtEnd() || source.charAt(current) != expected) return false;
        current++;
        return true;
    }
    private boolean isDigit(char c){
        return c >= '0' && c <= '9';
    }
    private boolean isAlpha(char c){
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
    }
    private void addToken(TokenType type){
        addToken(type, null);
    }
    private void addToken(TokenType type, Object literal){
        String text = source.substring(start, current);
        // record Token(TokenType type, String lexeme, Object literal, int line){}
        tokens.add(new Token(type, text, literal, line));
    }
}