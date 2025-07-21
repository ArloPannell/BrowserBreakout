const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

console.log(canvas, ctx);

ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#ff0000";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgb(0 0 255 / 50%)";
ctx.stroke();
ctx.closePath();
