var SCL = 30;
var WIDTH = 13;
var HEIGHT = 13;
var FRAMERATE = 5;
var MAX_LENGTH = 30;
var gameState; // GAME|PAUSED|END
var result;

var myVoice = new p5.Speech();

var snake = {
    x: 3,
    y: 3,
    xSpeed: 1,
    ySpeed: 0,
    tail: []
}

var apple = {
    x: -1,
    y: -1
}

function initSnake() {
    snake.x = 3;
    snake.y = 3;
    snake.xSpeed = 1;
    snake.ySpeed = 0;
    snake.tail = [];
    updateApple();
    loop();
}

function isInTail(x, y) {
    if (x === snake.x && y === snake.y) {
        return true;
    }
    for (var i = 0; i < snake.tail.length; i++) {
        if (x === snake.tail[i].x && y === snake.tail[i].y) {
            return true;
        }
    }
    return false;
}

function updateApple() {
    if (snake.tail.length > 0) {
        say(snake.tail.length);
    }
    result.html(snake.tail.length + ' / ' + MAX_LENGTH);
    var x = -1;
    var y = -1;
    while (true) {
        x = floor(random(WIDTH));
        y = floor(random(HEIGHT));
        if (!isInTail(x, y)) {
            break;
        }
    }
    apple.x = x;
    apple.y = y;
}

function isHeadInTail() {
    for (var i = 0; i < snake.tail.length; i++) {
        if (snake.x === snake.tail[i].x && snake.y === snake.tail[i].y) {
            return true;
        }
    }
    return false;
}

function lost() {
    var str = 'You lost. You ate '.concat(snake.tail.length).concat(' apple');
    if (snake.tail.length > 1) {
        str = str.concat('s.');
    } else {
        str = str.concat('.');
    }
    noLoop();
    gameState = 'END';
    say(str);
    result.html(str);

}

function updateSnake() {
    if (isHeadInTail()) {
        lost();
    } else {
        updateTail();
        snake.x += snake.xSpeed;
        snake.y += snake.ySpeed;
        if (snake.x < 0) {
            removeTail();
            lost();
        } else if (snake.x > WIDTH - 1) {
            removeTail();
            lost();
        } else if (snake.y < 0) {
            removeTail();
            lost();
        } else if (snake.y > HEIGHT - 1) {
            removeTail();
            lost();
        }
        if (snake.x === apple.x && snake.y === apple.y) {
            updateApple();
        } else {
            removeTail();
        }
    }
}

function say(speech) {
    myVoice.speak(speech);
}

function removeTail() {
        snake.tail.shift();
}

function updateTail() {
    var coord = {
        x: snake.x,
        y: snake.y
    }
    snake.tail.push(coord);
    if (snake.tail.length > MAX_LENGTH) {
        var str = "You won!";
        noLoop();
        gameState = 'END';
        say(str);
        result.html(str);
    }
}

function update() {
    updateSnake();
}

function setup() {
    result = select('#result');
    var myCanvas = createCanvas(WIDTH * SCL, HEIGHT * SCL);
    myCanvas.parent('myCanvas');
    frameRate(FRAMERATE);
    updateApple();
    gameState = 'GAME';
}

function drawSnake() {
    fill('green');
    for (var i = 0; i < snake.tail.length; i++) {
        rect(snake.tail[i].x * SCL, snake.tail[i].y * SCL, SCL, SCL);
    }
    fill('yellow');
    rect(snake.x * SCL, snake.y * SCL, SCL, SCL);
}

function drawApple() {
    fill('red');
    rect(apple.x * SCL + SCL / 4, apple.y * SCL + SCL / 4, SCL / 2, SCL / 2);
}

function draw() {
    update();
    background(51);
    drawSnake();
    drawApple();
}

function keyPressed() {
    if (gameState === 'GAME') {
        if (keyCode === RIGHT_ARROW || key === 'D') {
            snake.xSpeed = 1;
            snake.ySpeed = 0;
        } else if (keyCode === LEFT_ARROW || key === 'A') {
            snake.xSpeed = -1;
            snake.ySpeed = 0;
        } else if (keyCode === UP_ARROW || key === 'W') {
            snake.xSpeed = 0;
            snake.ySpeed = -1;
        } else if (keyCode === DOWN_ARROW || key === 'S') {
            snake.xSpeed = 0;
            snake.ySpeed = 1;
        }
    }
    if (key === 'P') {
        if (gameState === 'GAME') {
            noLoop();
            gameState = 'PAUSED';
        } else if (gameState === 'PAUSED') {
            loop();
            gameState = 'GAME';
        }
    }
    if (gameState === 'END' && key === ' ') {
        gameState = 'GAME';
        initSnake();
    }
}

function mousePressed() {
    if (gameState === 'END') {
        gameState = 'GAME';
        initSnake();
    }
}
