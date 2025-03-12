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

      if (
        this.isNumber(this.ch) ||
        (this.ch === "." && this.isNumber(this.peek()))
      ) {
        this.readNumber();
      } else if (this.ch === "'" || this.ch === '"') {
        this.readString();
      } else if (this.isIdent(this.ch)) {
        this.readIndificator();
      } else if (
        this.ch === "[" ||
        this.ch === "]" ||
        this.ch === "," ||
        this.ch === "{" ||
        this.ch == "}" ||
        this.ch === ":"
      ) {
        this.tokens.push({
          text: this.ch,
        });
        this.index++;
      } else if (this.isWhitespace(this.ch)) {
        this.index++;
      } else {
        throw "Unexpected character";
      }
    }

    return this.tokens;
  }

  peek() {
    return this.index < this.text.length - 1
      ? this.text.charAt(this.index + 1)
      : false;
  }

  isNumber(ch) {
    return ch >= "0" && ch <= "9";
  }

  isIdent(ch) {
    return (
      (ch >= "a" && ch <= "z") ||
      (ch >= "A" && ch <= "Z") ||
      ch === "_" ||
      ch === "$"
    );
  }

  isWhitespace(ch) {
    return (
      ch === "\n" ||
      ch === " " ||
      ch === "\t" ||
      ch === "\r" ||
      ch === "\vs" ||
      ch === "\u00A0"
    );
  }

  readNumber() {
    let number = "";

    while (this.index < this.text.length) {
      let ch = this.text.charAt(this.index);

      if (this.isNumber(ch) || ch === ".") {
        number += ch;
      } else {
        break;
      }

      this.index++;
    }

    this.tokens.push({
      text: number,
      value: Number(number),
    });
  }

  readString() {
    this.index++;
    let string = "";

    while (this.index < this.text.length) {
      let ch = this.text.charAt(this.index);

      if (ch === "'" || ch === '"') {
        this.index++;
        this.tokens.push({
          text: string,
          value: string,
        });

        return;
      } else {
        string += ch;
      }
      this.index++;
    }

    throw "Unmatchet quote";
  }

  readIndificator() {
    let string = "";

    while (this.index < this.text.length) {
      let ch = this.text.charAt(this.index);

      if (this.isIdent(ch) || this.isNumber()) {
        string += ch;
      } else {
        break;
      }

      this.index++;
    }

    this.tokens.push({
      text: string,
      identifier: true,
    });
  }
}

class AST {
  lexer;
  tokens = new Array();
  constants = {
    null: { type: AST.Literal, value: "null" },
    true: { type: AST.Literal, value: true },
    false: { type: AST.Literal, value: false },
  };

  constructor(lexer) {
    this.lexer = lexer;
  }

  ast(text) {
    this.tokens = this.lexer.lex(text);
    return this.program();
  }

  peek(e) {
    if (this.tokens.length > 0) {
      let text = this.tokens[0].text;

      if (text === e || !e) {
        return this.tokens[0];
      }
    }
  }

  program() {
    return {
      type: AST.Program,
      body: this.primary(),
    };
  }

  primary() {
    if (this.expect("[")) {
      return this.arrayDeclaration();
    } else if (this.expect("{")) {
      return this.object();
    } else if (this.constants.hasOwnProperty(this.tokens[0].text)) {
      return this.constants[this.consume().text];
    } else if(this.peek().identifier){
      return this.identifier();
    } else {
      return this.constant();
    }
  }

  arrayDeclaration() {
    let elements = [];

    if (!this.peek("]")) {
      do {
        if (this.peek("]")) {
          break;
        }

        elements.push(this.primary());
      } while (this.expect(","));
    }

    return {
      type: AST.ArrayDeclaration,
      elements: elements,
    };
  }

  constant() {
    return {
      type: AST.Literal,
      value: this.consume().value,
    };
  }

  identifier() {
    return {
      type: AST.Identifier,
      name: this.consume().text,
    };
  }

  object() {
    let properties = new Array();

    if (!this.peek("}")) {
      do {
        let property = { type: AST.Property };

        if (this.peek().identifier) {
          property.key = this.identifier();
        } else {
          property.key = this.constant();
        }
        this.consume(":");
        property.value = this.primary();

        properties.push(property);
      } while (this.expect(","));
    }

    this.consume("}");

    return { type: AST.ObjectExpression, properties: properties };
  }

  expect(e) {
    if (this.tokens.length > 0) {
      if (this.tokens[0].text === e || !e) {
        return this.tokens.shift();
      }
    }
  }

  consume(e) {
    let token = this.expect(e);
    if (!token) {
      throw "Unexpected: " + token + ", expecting: " + e;
    }

    return token;
  }
}

AST.Program = "Program";
AST.Literal = "Literal";
AST.ArrayDeclaration = "ArrayDeclaration";
AST.ObjectExpression = "ObjectExpression";
AST.Property = "Property";
AST.Identifier = "Identifier";

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

    console.error(this.state.body.join(""));
    let fn = new Function("s", this.state.body.join(""));
    return fn;
  }

  recurse(ast) {
    switch (ast.type) {
      case AST.Program:
        this.state.body.push("return ", this.recurse(ast.body), ";");
        break;
      case AST.Literal:
        return this.escape(ast.value);
      case AST.ArrayDeclaration:
        let elements = ast.elements.map((el) => this.recurse(el));
        return "[" + elements.join(",") + "]";
      case AST.ObjectExpression:
        let properties = ast.properties.map((el) => {
          let key =
            el.key.type === AST.Identifier
              ? el.key.name
              : this.escape(el.key.value);

          let value = this.recurse(el.value);

          return key + ":" + value;
        });
        return "{" + properties.join(",") + "}";
      case AST.Identifier:
        return this.nonComputedMember('s', ast.name);
    }
  }

  nonComputedMember(left, right){
    return '(' + left + ').' + right; 
  }

  stringEscapeRegex = /[^ a-zA-Z0-9]/g;
  stringEscapeFn(c) {
    return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
  }

  isString(value) {
    if (value.length < 0) {
      return false;
    }

    let ch = value[0];

    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
      return true;
    }

    return false;
  }

  escape(value) {
    if (this.isString(value)) {
      return (
        "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'"
      );
    } else {
      return value;
    }
  }
}

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
