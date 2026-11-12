package larp;
/* A token is just data.
 Showing it as a record reduces the lines of code significantly
 compared to if say we used a class.
*/
public record Token(TokenType type, String lexeme, Object literal, int line){}