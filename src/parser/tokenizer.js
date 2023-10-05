'use strict';


/**
 * Token constructor.
 * @constructor
 * @param {string} type - The type of the token.
 * @param {string|number} value - The value associated with the token.
 */
function Token(type, value) {
    this.type = type;
    this.value = value;
}


/**
 * Tokenizer class for a calculator.
 * @constructor
 * @param {string} input - The input string to tokenize.
 */
function Tokenizer(input) {
    this.input = input;
    this.tokens = []; // Initialize tokens as an empty array
    this.position = 0;
    this.tokenize(input); // Call tokenize method to tokenize the input
}

Tokenizer.TokenType = Object.freeze({
    SHIFT: 'SHIFT',
    ALPHA: 'ALPHA',
    CTRL: 'CTRL',
    DELIMETER: 'DELIMETER',
    NUMBER: 'NUMBER',
    OPERATOR: 'OPERATOR',
    EOL: 'EOL'
});

/**
 * Iterator method for Tokenizer.
 */
Tokenizer.prototype[Symbol.iterator] = function () {
    return {
        next: () => {
            if (this.position >= this.tokens.length) {
                return { done: true };
            }
            const token = this.tokens[this.position];
            this.position++;
            return { value: token, done: false };
        }
    };
};

/**
 * Get the next token from the input.
 * @returns {Token} - The next token.
 */
Tokenizer.prototype.getNextToken = function () {
    if (this.position >= this.tokens.length) {
        return { type: Tokenizer.TokenType.EOL, value: Tokenizer.TokenType.EOL };
    }
    const token = this.tokens[this.position];
    this.position++;
    return token;
};

Tokenizer.prototype.tokenize = function () {
    const inputWithoutSpaces = this.input.replace(/\s/g, ''); // Remove spaces
    const tokenRegex = /([\d.]+|[+\-*/()]|EOL)/g; // No need for \s here
    let match;
    while ((match = tokenRegex.exec(inputWithoutSpaces)) !== null) {
        const [tokenValue] = match;
        let token;

        // Use a switch statement to determine 
        // the token type.
        switch (tokenValue) {
            case '+':
            case '-':
            case '*':
            case '/':
                token = new Token(Tokenizer.TokenType.OPERATOR, tokenValue);
                break;
            case '(':
            case ')':
                token = new Token(Tokenizer.TokenType.DELIMETER, tokenValue);
                break;
            case 'EOL':
                token = new Token(Tokenizer.TokenType.EOL, Tokenizer.TokenType.EOL);
                break;
            default:
                // Check if it's a number
                if (/^\d+(\.\d+)?$/.test(tokenValue)) {
                    token = new Token(Tokenizer.TokenType.NUMBER, parseFloat(tokenValue));
                } else {
                    throw new Error(`Unknown token: ${tokenValue}`);
                }
        }

        this.tokens.push(token); // Use this.tokens to store tokens
    }

    // Add an EOF token to signify the end of the input
    const EOFToken = new Token(Tokenizer.TokenType.EOL, Tokenizer.TokenType.EOL);
    this.tokens.push(EOFToken);
}

module.exports = Tokenizer