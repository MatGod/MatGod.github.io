// создание движка
var pjs = new PointJS(640, 480, {
	backgroundColor : '#4b9a89' // optional
});

// переменные для быстрого доступа
var log    = pjs.system.log;     // log = console.log;
var game   = pjs.game;           // Game Manager
var point  = pjs.vector.point;   // Constructor for Point

// получаем ширину и высоту вида
var width  = game.getWH().w; // width of scene viewport
var height = game.getWH().h; // height of scene viewport

// зададим название окну с игрой
pjs.system.setTitle('Game'); // Set Title for Tab or Window

// создание игрового цикла
game.newLoopFromConstructor('myGame', function () {
	// область создания локальных объектов
    pjs.mouseControl.initMouseControl();
    pjs.system.initFullPage();
    pjs.mouseControl.setCursorImage("images/arrow-pointer.png");
    var mousePos, ww = game.getWH().w, wh = game.getWH().h;
	// объявление функции игрового цикла
    var conditions = [], names = [], arrows = [],
        cond_count = 0, arr_count = 0, i, j, first_cond = false,
        cond_sost = true;
    var conditionsButton = game.newRoundRectObject({
            x: 0, y: 0,
            w: ww / 7, h: wh / 13,
            radius: ww / 140, fillColor: "#FBFE6F",
            strokeColor: "black", strokeWidth: 2,
            alpha : 0.5
        }),
        arrowsButton = game.newRoundRectObject({
            x: ww / 7, y: 0,
            w: ww / 7, h: wh / 13,
            radius: ww / 140,
            fillColor: "#FBFE6F",
            strokeColor: "black", strokeWidth: 2
        }),
        conditionsText = game.newTextObject({
            x: ww / 100, y: wh / 35,
            color: "black", text: "Состояния",
            size: wh / 25
        }),
        arrowsText = game.newTextObject({
            x: ww / 100 + ww / 7, y: wh / 35,
            color: "black", text: "Переходы",
            size: wh / 25
        });
    //фунции обработки нажатий
    function click_in_conditions() {
        if (pjs.mouseControl.isPress("LEFT")) {
            mousePos = pjs.mouseControl.getPosition();
            if (pjs.mouseControl.isInObject(arrowsButton)) {
                if (cond_sost) {
                    cond_sost = false;
                    arrowsButton.setAlpha(0.5);
                    conditionsButton.setAlpha(1);
                }
                return 0;
            }
            if (pjs.mouseControl.isInObject(conditionsButton)) return 0;
            conditions[cond_count] = game.newCircleObject({
                x: mousePos.x - 20, y: mousePos.y - 20,
                radius: 20, fillColor: "red",
                strokeColor: "black", strokeWidth: 2
            });
            if (cond_count == 1) {
                conditions[0] = game.newCircleObject({
                    x: conditions[cond_count - 1].x, y: conditions[cond_count - 1].y,
                    radius: 20, fillColor: "green",
                    strokeColor: "black", strokeWidth: 2
                });
            }
            if (cond_count > 1) {
                conditions[cond_count - 1] = game.newCircleObject({
                    x: conditions[cond_count - 1].x, y: conditions[cond_count - 1].y,
                    radius: 20, fillColor: "yellow",
                    strokeColor: "black", strokeWidth: 2
                });
            }
            names[cond_count] = game.newTextObject({
                x: mousePos.x - 10, y: mousePos.y - 6,
                color: "black", text: cond_count + 1,
                size: 20
            });
            cond_count++;
        }
        if (pjs.mouseControl.isPress("RIGHT")) {
            for (var j = 0; j < cond_count; j++) {
                if (pjs.mouseControl.isInObject(conditions[j])) {
                    for (i = 0; i < arr_count; i++) {
                        if (arrows[i].start == j || arrows[i].end == j) {
                            arrows.splice(i, 1);
                            arr_count--;
                            i--;
                        }
                    }
                    conditions.splice(j, 1);
                    names.splice(j, 1);
                    cond_count--;
                    for (var k = j; k < cond_count; k++) {
                        names[k].setText(k + 1);
                    }
                    if (j == cond_count && cond_count > 0) {
                        conditions[j - 1] = game.newCircleObject({
                            x: conditions[cond_count - 1].x, y: conditions[cond_count - 1].y,
                            radius: 20, fillColor: "red",
                            strokeColor: "black", strokeWidth: 2
                        });
                    }
                    if (j == 0 && cond_count > 0) {
                        conditions[0] = game.newCircleObject({
                            x: conditions[0].x, y: conditions[0].y,
                            radius: 20, fillColor: "green",
                            strokeColor: "black", strokeWidth: 2
                        });
                    }
                }
            }
        }
    }

    function click_in_arrows() {
        if (pjs.mouseControl.isPress("LEFT")) {
            mousePos = pjs.mouseControl.getPosition();
            if (pjs.mouseControl.isInObject(conditionsButton)) {
                if (!cond_sost) {
                    cond_sost = true;
                    arrowsButton.setAlpha(1);
                    conditionsButton.setAlpha(0.5);
                }
                return 0;
            }
            if (pjs.mouseControl.isInObject(arrowsButton)) return 0;
            for (j = 0; j < cond_count; j++) {
                if (pjs.mouseControl.isInObject(conditions[j])) {
                    first_cond = !first_cond;
                    if (first_cond) {
                        arrows[arr_count] = new Object();
                        arrows[arr_count].x1 = conditions[j].x + conditions[j].w / 2;
                        arrows[arr_count].y1 = conditions[j].y + conditions[j].w / 2;
                        arrows[arr_count].start = j;
                    }
                    if (!first_cond) {
                        arrows[arr_count].x2 = conditions[j].x + conditions[j].w / 2 - arrows[arr_count].x1;
                        arrows[arr_count].y2 = conditions[j].y + conditions[j].w / 2 - arrows[arr_count].y1;
                        arrows[arr_count].end = j;
                        arr_count++;
                    }
                }
            }
        }
    }

    //функция отрисовки
    function draw_all() {
        for (i = 0; i < arr_count; i++) {
            pjs.brush.drawLine({
                x1 : arrows[i].x1,
                y1 : arrows[i].y1,
                x2 : arrows[i].x2,
                y2 : arrows[i].y2,
                strokeColor : "black",
                strokeWidth : 2
            });
        }
        for (i = 0; i < cond_count; i++) {
            conditions[i].draw();
            names[i].draw();
        }
        conditionsButton.draw();
        conditionsText.draw();
        arrowsButton.draw();
        arrowsText.draw();
    }
	this.update = function () {
	    if (cond_sost) click_in_conditions();
	    else click_in_arrows();
	    draw_all();
	};

});

// старт игрового цикла
game.startLoop('myGame');