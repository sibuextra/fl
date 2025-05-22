const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const gravity = 0.5;
const flapStrength = -10;
const pipeWidth = 70;
const pipeHeight = 500;
const pipeGap = 150;
const pipeSpeed = 3;

let bird = {
    x: 100,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    velocity: 0,
    image: new Image()
};
bird.image.src = 'path_to_your_bird_image.png';

let pipes = [];
let score = 0;
let gameRunning = true;

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (400 - 200 + 1)) + 200;
    return [
        { x: canvas.width, y: 0, height: pipeHeight },
        { x: canvas.width, y: pipeHeight + pipeGap, height: canvas.height - pipeHeight - pipeGap }
    ];
}

function movePipes() {
    pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });
}

function checkCollision() {
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        return true;
    }
    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y) {
            return true;
        }
    }
    return false;
}

function drawBird() {
    ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, pipe.y, pipeWidth, pipe.height);
    });
}

function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 50);
}

function drawGameOver() {
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '36px Arial';
    ctx.fillText('Press SPACE to restart', canvas.width / 2 - 150, canvas.height / 2 + 50);
}

function update() {
    if (!gameRunning) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (pipes.length < 2) {
        pipes.push(...createPipe());
    }

    movePipes();

    if (checkCollision()) {
        gameRunning = false;
    }

    score++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPipes();
    drawBird();
    drawScore();

    if (!gameRunning) {
        drawGameOver();
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameRunning) {
            // Reset game
            bird.y = canvas.height / 2;
            bird.velocity = 0;
            pipes = [];
            score = 0;
            gameRunning = true;
        } else {
            bird.velocity = flapStrength;
        }
    }
});

gameLoop();
