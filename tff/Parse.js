class Lexer {
    text = "";
    index = 0;
    ch = undefined;
    tokens = [];

    lex(text) {
        this.text = text;
        this.index = 0;
        this.ch = undefined;
        this.tokens = new Array();

        while (this.index < this.text.length) {
            this.ch = this.text.charAt(this.index);

            if (this.isNumber(this.ch) || (this.ch === '.' && this.isNumber(this.peek()))) {
                this.readNumber();
            } else if (this.ch === '\'' || this.ch === '"') {
                this.readString();
            } else {
                throw 'Unexpected character';
            }
        }

        return this.tokens;
    }

    peek() {
        return this.index < this.text.length - 1 ? this.text.charAt(this.index + 1) :
            false;
    }

    isNumber(ch) { return ch >= '0' && ch <= '9' }

    readNumber() {
        let number = '';

        while (this.index < this.text.length) {
            let ch = this.text.charAt(this.index);

            if (this.isNumber(ch) || ch === '.') {
                number += ch;
            }
            else {
                break
            }

            this.index++;
        }

        this.tokens.push({
            text: number,
            value: Number(number)
        })

    }

    readString() {
        this.index++;
        let string = '';

        while (this.index < this.text.length) {
            let ch = this.text.charAt(this.index);

            if (ch === '\'' || ch === '"') {
                this.index++;
                this.tokens.push({
                    text: string,
                    value: string
                });

                return;
            } else {
                string += ch;
            }
            this.index++;
        }

        throw 'Unmatchet quote'
    }
};

class AST {
    lexer;
    tokens = new Array();
    constans = {
        'null' : {type: Ast.Literal, value: null}
    }

    constructor(lexer) {
        this.lexer = lexer;
    }

    ast(text) {
        this.tokens = this.lexer.lex(text);
        return this.program();
    }

    program() {
        return {
            type: AST.Program,
            body: this.constant()
        }
    }

    constant() {
        return {
            type: AST.Literal,
            value: this.tokens[0].value
        }
    }
};

AST.Program = 'Program';
AST.Literal = 'Literal';

class astCompiler {
    astBuilder;
    state = { body: [] };

    constructor(ast) {
        this.astBuilder = ast;
    }

    compile(text) {
        let ast = this.astBuilder.ast(text);
        this.state = { body: [] };

        this.recurse(ast);

        let fn = new Function(this.state.body.join(''));
        return fn;
    }

    recurse(ast) { 
        switch (ast.type) {
            case AST.Program:
                this.state.body.push('return ', this.recurse(ast.body), ';');
                break;
            case AST.Literal:
                return this.escape(ast);
        }
    }

    escape(ast) {;
        if (typeof (ast.value) === 'string') {
            return "'" + ast.value + "'";
        } else {
            return ast.value;
        }
    }
};

class Parser {
    lexer;
    ast;
    astCompiler;

    constructor(lexer) {
        this.lexer = lexer;
        this.ast = new AST(this.lexer);
        this.astCompiler = new astCompiler(this.ast);
    }

    parse(text) {
        return this.astCompiler.compile(text);
    }
}

export default function parse(expr) {
    let lexer = new Lexer();
    let parser = new Parser(lexer);

    return parser.parse(expr);
}