var exampleLenth, alfLen, expString, adjMatrix = [], masterAdjMatrix = [], table, mode = "D", alf = ["A","B","C","D","E"];
var generateButton = document.getElementById("generateExample");
var drawButton = document.getElementById("drawAutomate");
var checkButton = document.getElementById("checkAnswer");
var drawPole = document.getElementById("drawPole");
var radioDemonstrator = document.getElementById("radioDemonstrator");
var radioTrainer = document.getElementById("radioTrainer");
var radioControl = document.getElementById("radioControl");
var exampleText = document.getElementById("example");
var matrix = document.getElementById("matrix");

drawButton.addEventListener("click", drawAutomate);
generateButton.addEventListener("click", setExample);
checkButton.addEventListener("click", checkAnswer);
radioDemonstrator.addEventListener("click", function () {
    if (mode !== "D") {
        exampleText.innerText = "";
        matrix.innerHTML = "";
        drawPole.innerHTML = "";
        checkButton.disabled = true;
        drawButton.disabled = true;
        mode = "D";
    }
});
radioTrainer.addEventListener("click", function () {
    if (mode !== "T") {
        exampleText.innerText = "";
        matrix.innerHTML = "";
        drawPole.innerHTML = "";
        checkButton.disabled = true;
        drawButton.disabled = true;
        mode = "T";
    }
});
radioControl.addEventListener("click", function () {
    if (mode !== "C") {
        exampleText.innerText = "";
        matrix.innerHTML = "";
        drawPole.innerHTML = "";
        checkButton.disabled = true;
        drawButton.disabled = true;
        mode = "C";
    }
});

function demonstrate() {
    var pole, i, j;
    for (i = 0; i < exampleLenth + 1; i++) {
        for (j = 0; j < alfLen; j++) {
            pole = document.getElementById("pole" + i + "-" + j);
            pole.value = masterAdjMatrix[i][j];
        }
    }
    drawAutomate();
}

function checkAnswer() {
    initAdjMatrix();
    var i, j;
    for (i = 0; i < exampleLenth + 1; i++) {
        for (j = 0; j < exampleLenth + 1; j++) {
            if (adjMatrix[i][j] !== masterAdjMatrix[i][j]) {
                swal({
                    icon: "error",
                    title: "Ошибка",
                    text: "Автомат составлен неверно",
                    button: "Ещё раз!"
                });
                if (mode === "C") {
                    exampleText.innerText = "";
                    matrix.innerHTML = "";
                    checkButton.disabled = true;
                }
                return 0;
            }
        }
    }
    swal({
        icon: "success",
        title: "Ура!",
        text: "Автомат составлен без ошибок",
        button: "Спасибо!"
    });
    return 0;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomString() {
    var lenth = getRandomInt(4, 8);
    exampleLenth = lenth;
    var result = "";
    for (var i = 0; i < lenth; i++) {
        result += String.fromCharCode(getRandomInt(65, 70));
    }
    alfLen = 5;
    return result;
}

function setExample() {
    expString = getRandomString();
    exampleText.innerText = expString;
    InitMatrix();
    initMasterAdjMatrix();
    if (mode === "D") demonstrate();
    else checkButton.disabled = false;
    if (mode !== "C") drawButton.disabled = false;
}

function initMasterAdjMatrix() {
    var i, j;
    console.log("даров");
    for (i = 0; i < exampleLenth + 1; i++) {
        masterAdjMatrix[i] = [];
        for (j = 0; j < alfLen; j++) {
            masterAdjMatrix[i][j] = compareSost(i, alf[j]);
        }
        console.log(masterAdjMatrix[i]);
    }
}

function compareSost(i, liter) {
    var str1, str2;
    for (var k = i + 1; k >= 0; k--) {
        str1 = expString.substring(0, k);
        str2 = expString.substring(i - k + 1, i) + liter;
        if (str1 == str2) return String(k);
    }
    return "0";
}

function InitMatrix() {
    matrix.innerHTML = "";
    var tab = document.createElement("table");
    table = tab;
    matrix.appendChild(tab);
    var tabRow = document.createElement("tr");
    var tabHead = document.createElement("th");
    var tabCell, inputPole;
    var i, j;
    tab.appendChild(tabRow);
    tabRow.appendChild(tabHead);
    for (i = 0; i < alfLen; i++) {
        tabHead = document.createElement("th");
        tabRow.appendChild(tabHead);
        tabHead.innerText = alf[i];
    }
    for (i = 0; i < exampleLenth + 1; i++) {
        tabRow = document.createElement("tr");
        tab.appendChild(tabRow);
        tabHead = document.createElement("th");
        tabRow.appendChild(tabHead);
        tabHead.innerText = String(i);
        for (j = 0; j < alfLen; j++) {
            tabCell = document.createElement("td");
            tabRow.appendChild(tabCell);
            inputPole = document.createElement("input");
            inputPole.classList.add("matrix-input-pole");
            inputPole.id = "pole" + i + "-" + j;
            tabCell.appendChild(inputPole);
        }
    }
}

function initAdjMatrix() {
    var j, pole;
    adjMatrix = [];
    for (var i = 0; i < exampleLenth + 1; i++) {
        adjMatrix[i] = [];
        for (j = 0; j < alfLen; j++) {
            pole = document.getElementById("pole" + i + "-" + j);
            if (pole.value.length === 1) adjMatrix[i][j] = pole.value;
            else adjMatrix[i][j] = "0";
        }
    }
}

function drawAutomate() {
    initAdjMatrix();
    drawPole.innerHTML = "";
    const g = new Dracula.Graph;

    var i, j;
    for (i = 0; i < exampleLenth + 1; i++) {
        g.addNode(String(i));
    }
    for (i = 0; i < exampleLenth + 1; i++) {
        for (j = 0; j < alfLen; j++) {
            if (adjMatrix[i][j] !== "0") {
                if (i === Number(adjMatrix[i][j])) g.addEdge(String(i), adjMatrix[i][j], { directed: true, label: "____" + alf[j], "label-style": {"font-size": 20}});
                else g.addEdge(String(i), String(adjMatrix[i][j]), { directed: true, label: alf[j], "label-style": {"font-size": 20}});
            }
        }
    }

    const layouter = new Dracula.Layout.Spring(g);

    const renderer = new Dracula.Renderer.Raphael('#drawPole', g, 800, 380);
    renderer.draw();
}