const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 15;
let ySpeed = 15;
let ground_x = 200;
let ground_y = 550;
let ground_width = 200;
let ground_height = 5;
let brickArray = [];
let unit = 10;
const row = ground_y / unit; // 600 / 10 =60
const colunm = canvasWidth / unit; // 1000 / 10 =100

let rightPressed = false;
let leftPressed = false;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = Math.floor(Math.random() * colunm) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
    this.width = 30;
    this.height = 30;
    brickArray.push(this);
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}
//製作所有的brick
for (let i = 0; i < unit; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 500));
}

window.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
if (rightPressed) {
  ground_x = Math.min(ground_x + 7, canvasWidth - ground_width);
} else if (leftPressed) {
  ground_x = Math.max(ground_x - 7, 0);
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;

function drawCircle() {
  //確認球是否打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      score++;

      brick.visible = false;
      console.log(score);
      //改變x,y方向的速度，並且將brick從brickarray中移除
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      }
      if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      // brickArray.splice(index, 1); //array.splice(start, deleteCount, item1, item2, ...)
      // if (brickArray.length == 0) {
      //   alert("遊戲結束");
      //   clearInterval(game);
      // }
      if (score == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
      setHighestScore(score);
      document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
      document.getElementById("myScore2").innerHTML =
        "最高分數:" + highestScore;
    }
  });

  //確認球是否打到橘色地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + ground_width + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 50;
    } else {
      circle_y += 50;
    }
    ySpeed *= -1;
  }

  //確認有沒有打到邊界
  //右邊邊界 || 左邊邊界
  if (circle_x >= canvasWidth - radius || circle_x <= radius) {
    xSpeed *= -1;
  }

  //上邊邊界
  if (circle_y <= radius) {
    ySpeed *= -1;
  }
  //下邊邊界
  if (circle_y >= canvasHeight) {
    // ySpeed *= -1;
    alert("遊戲結束 ψ(｀∇´)ψ");
    clearInterval(game);
  }

  //更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  //畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有的brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出可控制地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, ground_width, ground_height);

  //鍵盤控制地板
  if (rightPressed) {
    ground_x += 35;
  } else if (leftPressed) {
    ground_x -= 35;
  }

  //畫出圓球
  // x, y, 圓心座標
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
