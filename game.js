
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 400;

let gameRunning=false;
let score=0;
let speed=6;
let gravity=1;

let playerImg=new Image();
playerImg.src="sprites/player.png";

let chaserImg=new Image();
chaserImg.src="sprites/chaser.png";

let bookImg=new Image();
bookImg.src="sprites/book.png";

let cartImg=new Image();
cartImg.src="sprites/cart.png";

let paperImg=new Image();
paperImg.src="sprites/paper.png";

let jumpSound=new Audio("audio/jump.wav");
let hitSound=new Audio("audio/hit.wav");

let player={x:120,y:300,w:32,h:32,vy:0,jumping:false};
let chaser={x:10,y:300,w:32,h:32};

let obstacles=[];

const types=[
{name:"book",img:bookImg},
{name:"cart",img:cartImg},
{name:"paper",img:paperImg}
];

function startGame(){
document.getElementById("menu").style.display="none";
gameRunning=true;
}

function jump(){
if(!player.jumping){
player.vy=-18;
player.jumping=true;
jumpSound.play();
}
}

document.addEventListener("keydown",e=>{
if(e.code==="Space"||e.code==="ArrowUp")jump();
});

canvas.addEventListener("touchstart",()=>{
jump();
});

function spawnObstacle(){

let t=types[Math.floor(Math.random()*types.length)];

obstacles.push({
x:canvas.width,
y:320,
w:32,
h:32,
img:t.img
});

}

setInterval(spawnObstacle,1400);

function update(){

if(!gameRunning)return;

score++;

player.vy+=gravity;
player.y+=player.vy;

if(player.y>=300){
player.y=300;
player.jumping=false;
}

obstacles.forEach(o=>{

o.x-=speed;

if(
player.x<o.x+o.w &&
player.x+player.w>o.x &&
player.y<o.y+o.h &&
player.y+player.h>o.y
){
hitSound.play();
speed-=0.5;
chaser.x+=40;
}

});

speed+=0.002;

if(chaser.x+chaser.w>=player.x){
gameOver();
}

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(playerImg,player.x,player.y,player.w,player.h);
ctx.drawImage(chaserImg,chaser.x,chaser.y,chaser.w,chaser.h);

obstacles.forEach(o=>{
ctx.drawImage(o.img,o.x,o.y,o.w,o.h);
});

ctx.fillStyle="black";
ctx.font="20px Arial";
ctx.fillText("Score: "+score,20,30);

let high=localStorage.getItem("highscore")||0;
ctx.fillText("Highscore: "+high,20,60);

}

function gameOver(){

gameRunning=false;

let high=localStorage.getItem("highscore")||0;
if(score>high){
localStorage.setItem("highscore",score);
}

document.getElementById("scoreText").innerText="Score: "+score;
document.getElementById("gameOver").classList.remove("hidden");

}

function restart(){
location.reload();
}

function loop(){
update();
draw();
requestAnimationFrame(loop);
}

loop();
