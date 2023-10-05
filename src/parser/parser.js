const Tokenizer = require("./tokenizer");

/**
 * Parser constructor.
 * @constructor
 * @param {string} input - The input string to parse.
 */
function Parser(input) {
    this.tokenizer = new Tokenizer(input);
    this.tokens = Array.from(this.tokenizer);
}

Parser.prototype.parseNumber = function () {
    const token = this.tokens.shift();
    if (token.type === Tokenizer.TokenType.NUMBER) {
        return parseFloat(token.value);
    } else {
        throw new Error(`Expected a number, but got: ${token.value}`);
    }
};

Parser.prototype.parseTerm = function () {
    let result = this.parseFactor();
    while (this.tokens.length > 0 && this.tokens[0].type === Tokenizer.TokenType.OPERATOR && (this.tokens[0].value === '*' || this.tokens[0].value === '/')) {
        const operator = this.tokens.shift().value;
        const rightOperand = this.parseFactor();
        if (operator === '*') {
            result *= rightOperand;
        } else {
            result /= rightOperand;
        }
    }
    return result;
};

Parser.prototype.parseFactor = function () {
    let result = this.parsePrimary();
    while (this.tokens.length > 0 && this.tokens[0].type === Tokenizer.TokenType.OPERATOR && (this.tokens[0].value === '+' || this.tokens[0].value === '-')) {
        const operator = this.tokens.shift().value;
        const rightOperand = this.parsePrimary();
        if (operator === '+') {
            result += rightOperand;
        } else {
            result -= rightOperand;
        }
    }
    return result;
};

Parser.prototype.parsePrimary = function () {
    const token = this.tokens.shift();
    if (token.type === Tokenizer.TokenType.NUMBER) {
        return parseFloat(token.value);
    } else if (token.type === Tokenizer.TokenType.DELIMETER && token.value === '(') {
        const result = this.parseTerm();
        if (this.tokens.length > 0 && this.tokens[0].type === Tokenizer.TokenType.DELIMETER && this.tokens[0].value === ')') {
            this.tokens.shift(); // Consume the ')'
            return result;
        } else {
            throw new Error("Mismatched parentheses");
        }
    } else {
        throw new Error("Unexpected token: " + token.value);
    }
};

Parser.prototype.parse = function () {
    return this.parseTerm();
};

