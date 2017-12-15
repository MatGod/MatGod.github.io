//Читаемый символ
var ch;
//Строка входных данных
var str;
//Счетчик позиций
var pos;

function read() {

    if (pos == str.length)
        return false;

    ch = str[pos];
    pos++;
    return true;
}


function isVariable() {
    var Variables = ['a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' ,'m' ,
        'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z'];

    for (var i = 0 ; i < Variables.length ; i++ )
        if (ch == Variables[i]) return true;

    return false;
}

function isSign() {
    if (ch == '+' || ch == '*') {
        read();
        return true;
    }
    if (isVariable() || ch == '(') {
        return true;
    }
    return false;
}

function parseStart() {
    if (ch == '(') return true;
    else if (isVariable()) {
        if (read()) {
            if (isSign() && parseStart()) return true;
        }
        else return true;
    }
    return false;
}

function parseBkt() {
    if (ch == '(') {
        read();
        if (parseF()) {
            read();
            if (ch == ')') {
                read();
                return true;
            }
        }
    }
    return false;
}

function parseEnd() {
    if (isSign()) {
        read();
        if (isSign()) {
            read();
            if (parseF()) return true;
        }
    }
    return false;
}

function parseF() {
    var answer = true;
    if (isVariable()) answer = parseStart();
    if (ch) {
        if (answer)
            if (parseBkt())
                if (isSign())
                    if (parseEnd()) return true;
    }
    else return true;
    return false;
}

function parseThis() {

    pos = 0;
    ch = 0;
    str = "";

    var text = document.getElementById('txt');
    str = text.value.toLowerCase();
    var answer = document.getElementById('answer');

    read(ch);
    if (parseF()) answer.innerHTML = "ВЕРНОЕ выражение!";
    else answer.innerHTML = "Некорректное выражение!";
}
