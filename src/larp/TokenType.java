package larp;

public enum TokenType {
    // Special symbols
    LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
    PLUS, MINUS, STAR, SLASH, MODULO, COMMA, SEMICOLON,

    // One or two characters
    BANG, BANG_EQUAL,
    EQUAL, EQUAL_EQUAL,
    GREATER, GREATER_EQUAL,
    LESS, LESS_EQUAL,

    // Literals
    IDENT, NUMBER, STRING,

    // Keywords
    TAKE, YAP, IF, ELSE, UNTIL, FUNC, GIMME,
    T, F, GHOST, AND, OR,

    EOF
}