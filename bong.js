let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let ball = {
    x: 200,
    y: 200,
    dx: 3,
    dy: 3,
    radius: 10,
};
let paddle = {
    width: 90,
    height: 10,
    x: 0,
    y: canvas.height -10,
    speed: 35,
};

let BrickConfig = {
    //offset giá trị viên gạch đầu tiên dc vẽ
    offsetX: 25,
    offsetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 3,
    totalCol: 5,
};

let isGameOver = false;
let isGameWin = false;
let UserScore = 0;
let Maxscore = BrickConfig.totalCol * BrickConfig.totalRow;
// vẽ các viên gạch
let Bricklist = [];
for (let i = 0; i < BrickConfig.totalRow; i++) {
    for (let j = 0; j < BrickConfig.totalCol; j++) {
        Bricklist.push({
            x: BrickConfig.offsetX + j * (BrickConfig.width + BrickConfig.margin),
            y: BrickConfig.offsetY + i * (BrickConfig.height + BrickConfig.margin),
            isBroken: false
        })
    }
}
// sự kiện bàn phím di chuyển paddle trái phải
document.addEventListener('keydown', function (event) {
    console.log('KEY DOWN')
    console.log(event);
    if (event.keyCode == 37) {
        paddle.x -= paddle.speed;
    } else if (event.keyCode == 39) {
        paddle.x += paddle.speed;
    }
});

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = '#FF33FF';
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = '#66FF00'
    context.fill();
    context.closePath();
}

function drawBricks() {
    Bricklist.forEach(function (b) {
        if (!b.isBroken) {
            context.beginPath();
            context.rect(b.x, b.y, BrickConfig.width, BrickConfig.height);
            context.fillStyle = '#078af5';
            context.fill();
            context.closePath();
        }
    });
}

// check va chạm với paddle thì đổi hướng
function handleBallCollidePaddle() {
    if (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height) {
        ball.dy = -ball.dy;
    }
}

// check va cham đường biên của ball
function handleBallCollideBounds() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    //check chạm biên dưới thì không đổi hướng
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

//tính điểm cho người chơi
function handleBallCollideBricks() {
    Bricklist.forEach(function (b) {
        if (!b.isBroken) {
            if (ball.x >= b.x && ball.x <= b.x + BrickConfig.width &&
                ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + BrickConfig.height) {
                ball.dy = -ball.dy;
                b.isBroken = true;
                UserScore += 1;
                if (UserScore >= Maxscore) {
                    isGameOver = true;
                    isGameWin = true;
                }
                //    alert('your point:' + UserScore)
                document.getElementById('point').innerHTML = ('điểm số:' + UserScore)
            }
        }
    });

}

// bóng di chuyển
function updateBallPostsition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatapaddlePostsition() {

// sử lý đường biên của paddle
    if (paddle.x < 0) {
        paddle.x = canvas.width - paddle.width
        // paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        // paddle.x = canvas.width - paddle.width
        paddle.x = 0
    }
}

function checkGameOver() {
    if (ball.y >= canvas.height - ball.radius) {
        alert('you die!');
        isGameOver = true
    } else {
    }
}

function handleGameOver() {
    if (isGameWin) {
        alert("YOU WIN, CONGRATS!");
    } else {
        alert('chúc bạn may mắn lần sau ');
    }
}

//  xoá bóng cũ sau khi  vẽ bóng
function draw() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        handleBallCollideBounds();
        handleBallCollidePaddle();
        updateBallPostsition();
        updatapaddlePostsition();
        handleBallCollideBricks();

        checkGameOver();
        //hàm gọi lại vẽ bong chuyển động mượt hơn
        requestAnimationFrame(draw);
    } else {
        handleGameOver()
    }
}

draw();