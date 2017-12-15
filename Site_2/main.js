var text, ch, pos;

function parseThis() {
    var TextBox = document.getElementById('text');
    text = TextBox.value;
    ch = text[0];
    pos = 0;
    if (parseF() && BktBalance()) {
        alert("Выражение корректно!");
    }
    else {
        alert("Неверное выражение...");
    }
}

function isLiteral() {
    var lit = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
    ];
    for (var i = 0; i < lit.length; i++) {
        if (ch == lit[i]) {
            read();
            return true;
        }
    }
    return false;
}

function isLiteralWithoutRead() {
    var lit = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
    ];
    for (var i = 0; i < lit.length; i++) {
        if (ch == lit[i]) {
            return true;
        }
    }
    return false;
}

function isSign() {
    if (ch == '+' || ch == '*') {
        read();
        return true;
    }
    else if (ch == '(' || isLiteralWithoutRead()) {
        return true;
    }
    return false;
}

function read() {
    if (pos < text.length) {
        pos++;
        ch = text[pos];
    }
}

function parseF() {
    return (parseStart() && parseEnd());
}

function parseStart() {
    if (isLiteral()) return parseEnd();
    else return (parseBkt() && parseEnd());
}

function parseBkt() {
    if (ch == "(") {
        read();
        if (parseStart() && parseEnd()) {
            if (ch == ")") {
                read();
                return true;
            }
        }
    }
    return false;
}

function parseEnd() {
    if (ch == ")" || ch == undefined) return true;
    else if (isSign()) return parseStart();
    return false;
}

function BktBalance() {
    var balance = 0;
    for (var i = 0; i < text.length; i++) {
        if (text[i] == "(") balance++;
        if (text[i] == ")") balance--;
    }
    if (balance == 0) return true;
    else return false;
}