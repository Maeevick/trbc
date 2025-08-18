export function init() {
  sayHello();
  setupCanvasResize();
  drawTestRectangle();
}

function sayHello() {
  const hello = document.getElementById("hello") as HTMLParagraphElement;
  hello.innerText = "Hello, js13k!";
}

function setupCanvasResize() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  
  function resizeCanvas() {
    const containerWidth = Math.min(window.innerWidth - 40, 800);
    const containerHeight = Math.min(window.innerHeight - 100, 600);
    const size = Math.min(containerWidth, containerHeight);
    
    canvas.width = size;
    canvas.height = size;
  }
  
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function drawTestRectangle() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d")!;
  
  context.fillStyle = "#ff6b35";
  context.fillRect(10, 10, 50, 50);
}
