var text, ch, pos;
var lit = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var checkButton = document.getElementById("checkButton");
var textBox = document.getElementById("text");
var isFirstTextBoxClick = true;
checkButton.addEventListener("click", parseThis);
textBox.addEventListener("click", function () {
    if (isFirstTextBoxClick) textBox.value = "";
});

function parseThis() {
    text = textBox.value;
    ch = text[0];
    pos = 0;
    if (parseFunc()) {
        swal({
            icon: "success",
            title: "Ура!",
            text: "Выражение корректно!",
            button: "Ввести другое"
        });
    }
    else {
        swal({
            icon: "error",
            title: "Увы..",
            text: "Выражение некорректно..",
            button: "Ввести другое"
        });
    }
}

function read() {
    pos++;
    ch = text[pos];
}

function parseFunc() {
    var result = parseStart();
    result &= parseEnd();
    return result;
}

function parseStart() {
    var result;
    if (isLiteral()) {
        result = parseLit();
    }
    else if (ch === "(") {
            result = parseBkt();
        }
        else return false;
    result &= parseEnd();
    return result;
}

function parseEnd() {
    var result = true;
    if (isSign()) {
        result = parseSign();
        result &= parseStart();
    }
    return result;
}

function parseBkt() {
    var result;
    if (ch === "(") {
        read();
        result = parseStart();
        result &= parseEnd();
        if (ch === ")") {
            read();
            return result;
        }
        else return false;
    }
    else return false;
}

function parseLit() {
    if (isLiteral()) {
        read();
        return true;
    }
    else return false;
}

function parseSign() {
    if (ch === "+" || ch === "*") read();
    return true;
}

function isSign() {
    if (ch === "+" || ch === "*" || ch === "(" || isLiteral()) return true;
    else return false;
}

function isLiteral() {
    for (var i = 0; i < lit.length; i++) {
        if (ch === lit[i]) return true;
    }
    return false;
}