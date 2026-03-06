
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 400;

let gameRunning = false;
let gravity = 1.1;
let score = 0;

let player = {
x:120,
y:300,
width:40,
height:40,
vy:0,
jumping:false
};

let chaser = {
x:20,
y:300,
width:40,
height:40,
speed:0.03
};

let obstacles = [];
let baseSpeed = 6;
let speed = baseSpeed;

const obstacleTypes = [
{name:"book", color:"#2c6bed"},
{name:"paper", color:"#aaaaaa"},
{name:"scissors", color:"#1c8f4e"},
{name:"cart", color:"#8b4513"}
];

document.getElementById("startBtn").onclick = () => {
gameRunning = true;
document.getElementById("startBtn").style.display="none";
};

document.addEventListener("keydown", e => {

if((e.code === "Space" || e.code==="ArrowUp") && !player.jumping){

player.vy = -18;
player.jumping = true;

}

});

function spawnObstacle(){

let type = obstacleTypes[Math.floor(Math.random()*obstacleTypes.length)];

let obstacle = {
x:canvas.width,
y:320,
width:40 + Math.random()*20,
height:40,
color:type.color,
type:type.name
};

obstacles.push(obstacle);

}

setInterval(spawnObstacle,1300);

function update(){

if(!gameRunning) return;

score++;

player.vy += gravity;
player.y += player.vy;

if(player.y >= 300){
player.y = 300;
player.jumping=false;
}

obstacles.forEach(o=>{

o.x -= speed;

if(
player.x < o.x + o.width &&
player.x + player.width > o.x &&
player.y < o.y + o.height &&
player.y + player.height > o.y
){

speed -= 0.6;
chaser.x += 40;

}

});

speed += 0.002;

chaser.x += chaser.speed;

if(chaser.x + chaser.width >= player.x){

gameOver();

}

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

drawBackground();

ctx.fillStyle="black";
ctx.fillRect(player.x,player.y,player.width,player.height);

ctx.fillStyle="red";
ctx.fillRect(chaser.x,chaser.y,chaser.width,chaser.height);

obstacles.forEach(o=>{

ctx.fillStyle=o.color;
ctx.fillRect(o.x,o.y,o.width,o.height);

});

ctx.fillStyle="black";
ctx.font="20px Arial";
ctx.fillText("Score: "+score,20,30);

}

function drawBackground(){

ctx.fillStyle="#faf7f0";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.strokeStyle="#ddd";
for(let i=0;i<canvas.width;i+=40){

ctx.beginPath();
ctx.moveTo(i,0);
ctx.lineTo(i,canvas.height);
ctx.stroke();

}

}

function gameOver(){

gameRunning=false;

document.getElementById("gameOver").classList.remove("hidden");
document.getElementById("finalScore").innerText="Score : "+score;

}

function restartGame(){

location.reload();

}

function loop(){

update();
draw();
requestAnimationFrame(loop);

}

loop();
