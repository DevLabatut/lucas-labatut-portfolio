const config = {
  ballCount: 1000,
  followSpeed: 0.1,
  explodePower: 40,
  ballSize: 2,
};
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let balls = [];
let mouse = { x: 0, y: 0 };
let isExploding = false;
let hue = 0;
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function createBalls() {
  for (let i = 0; i < config.ballCount; i++) {
    balls.push({
      x: mouse.x,
      y: mouse.y,
      vx: 0,
      vy: 0,
      color: `hsl(${(i * 360) / config.ballCount}, 100%, 50%)`,
    });
  }
}
function explode() {
  isExploding = true;
  balls.forEach((ball) => {
    const angle = Math.random() * Math.PI * 2;
    const power = Math.random() * config.explodePower;
    ball.vx = Math.cos(angle) * power;
    ball.vy = Math.sin(angle) * power;
  });
  setTimeout(() => (isExploding = false), 1000);
}
function updateBalls() {
  hue = (hue + 1) % 360;
  balls.forEach((ball, i) => {
    if (isExploding) {
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= 0.95;
      ball.vy *= 0.95;
    } else {
      ball.x += (mouse.x - ball.x) * config.followSpeed;
      ball.y += (mouse.y - ball.y) * config.followSpeed;
      ball.color = `hsl(${(hue + i * 15) % 360}, 100%, 60%)`;
    }
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, config.ballSize, 0, Math.PI * 2);
    ctx.fill();
  });
}
function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  updateBalls();
  requestAnimationFrame(animate);
}
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
canvas.addEventListener("click", explode);
resize();
window.addEventListener("resize", resize);
createBalls();
animate();
