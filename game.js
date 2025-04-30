const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gravityStrength = 0.5;
let gravity = gravityStrength;
let flipped = false;
let score = 0;
let keys = {};

const player = {
  x: 100,
  y: 300,
  width: 30,
  height: 30,
  ySpeed: 0,
  isJumping: false,

  draw() {
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },

  update() {
    if (keys["Space"] && !this.isJumping) {
      this.ySpeed = flipped ? 10 : -10;
      this.isJumping = true;
    }

    this.y += this.ySpeed;
    this.ySpeed += gravity;

    let onPlatform = false;

    for (let p of platforms) {
      let withinX = this.x + this.width > p.x && this.x < p.x + p.width;
      let touchingTop = !flipped && this.y + this.height >= p.y && this.y + this.height <= p.y + 10;
      let touchingBottom = flipped && this.y <= p.y + p.height && this.y >= p.y + p.height - 10;

      if (withinX && (touchingTop || touchingBottom)) {
        onPlatform = true;
        this.y = flipped ? p.y + p.height : p.y - this.height;
        this.ySpeed = 0;
        this.isJumping = false;
      }
    }

    if (!onPlatform) this.isJumping = true;

    // Game over if out of bounds
    if (this.y > canvas.height || this.y < -this.height) {
      alert("Game Over! Your score: " + score);
      window.location.reload();
    }
  }
};

let cameraX = 0;

// Generate platforms with gaps
let platforms = [];
let nextPlatformX = 0;

function generatePlatforms() {
  while (nextPlatformX < cameraX + canvas.width + 200) {
    const width = Math.random() * 100 + 100;
    const gap = Math.random() * 50 + 50;
    const height = 20;
    const y = flipped ? 50 : 370;
    platforms.push({ x: nextPlatformX, y: y, width, height });
    nextPlatformX += width + gap;
  }
}

function drawPlatforms() {
  ctx.fillStyle = "#555";
  for (let p of platforms) {
    ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
  }
}

function drawScore() {
  document.getElementById("score").textContent = "Score: " + Math.floor(score);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  generatePlatforms();

  player.update();
  player.draw();
  drawPlatforms();
  drawScore();

  // Move camera
  cameraX += 2;
  player.x += 2;
  score += 0.1;

  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  // Flip gravity
  if (e.code === "KeyG") {
    flipped = !flipped;
    gravity = flipped ? -gravityStrength : gravityStrength;
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

update();
