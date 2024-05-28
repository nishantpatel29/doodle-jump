main = document.querySelector(".main");
main_height = 576;
main_width = 360;
doodlerWidth = 46;
doodlerHeight = 46;
doodlerX = main_width / 2 - doodlerWidth / 2;
doodlerY = main_height * 7 / 8 - doodlerHeight / 2;
//physics
velocityX = 0;
velocityY=0;     //doodler jump speed
initialvelocityY=-4.5;
g=0.12;


//score
score=0;
Maxscore=0;
gameover=false;


//platforms
let platformArray = [];
platformWidth = 60;
let platformHeight = 18;
let platformImg;
doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight,
}
window.onload = () => {
    main.height = main_height;
    main.width = main_width;
    context = main.getContext("2d");

    // draw doodler 
    doodlerRightImg = new Image();
    doodlerRightImg.src = "doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = () => {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }
    // doodler left 
    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "doodler-left.png";
    //platform img
    platformImg = new Image();
    platformImg.src = 'platform.png';
    placePlatforms();
    velocityY=initialvelocityY;
    document.addEventListener('keydown', moveDoodler);
    requestAnimationFrame(update);

}
function update() {
    if(gameover){
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0, 0, main.width, main.height);
    //doodler
    doodler.x += velocityX;
    velocityY+=g;
    doodler.y+=velocityY;

    if (doodler.x > main.width) {
        doodler.x = 0;
    }
    else if (doodler.x < 0) {
        doodler.x = main.width;
    }
    if(doodler.y>=main_height){
        gameover=true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    //platform
    for (i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if(velocityY<0 && doodler.y<main_height*2/4){
            platform.y-=initialvelocityY;  //slide platform down
            // newPlatform(); 
        }
        if(detectCollision(doodler,platformArray[i]) &&velocityY>0){
            velocityY=initialvelocityY;  //jump
        }
       
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }
    while(platformArray.length>0 && platformArray[0].y>=main_height){
        platformArray.shift();  //removes first element from array
        newPlatform();
    }
    updateScore();            //score
    context.fillStyle="black";
    context.font="16px sans-serif";
    context.fillText(score,5,20);
    if(gameover){
        context.fillText("Game Over:Press Fn+F5 to restart",main_width/7,main_height*7/8);
    }

}
moveDoodler = (e) => {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 1;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = -1;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "ArrowUp" || e.code == "KeyW") {
        velocityY = initialvelocityY-0.8;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        velocityY = initialvelocityY+14;
        doodler.img = doodlerRightImg;
    }
    // reset 
    else if(e.code=="Space" && gameover){
    
       gameover=false;

       
    }

}
placePlatforms = () => {
    platformArray = [];
    // starting platform 
    let platform = {
        img: platformImg,
        x: 140,
        y:550,
        width: platformWidth,
        height: platformHeight,
    }
    platformArray.push(platform);
    x=Math.floor(Math.random()*10)+6;
    for (i = 0; i <x; i++) {
        let platform = {
            img: platformImg,
            x: Math.floor(Math.random() * 360) + 1,
            y: main.height-150-75*i,
            width: platformWidth,
            height: platformHeight,
        }
        platformArray.push(platform);
    }
}
function newPlatform(){
    let platform = {
        img: platformImg,
        x: Math.floor(Math.random() * 360) + 1,
        y: main.height-150-75*i,
        width: platformWidth,
        height: platformHeight,
    }
    platformArray.push(platform);
}
 detectCollision=(a,b)=>{    //doodler,platform
    return a.x<b.x+b.width &&   // a's top left corner doesn't reach b's top right corner
    a.x+a.width>b.x &&           //a's top right corner passes b's top left corner
    a.y<b.y+b.height &&          //a's top left  corner doesn't reach b's bottom left corner
    a.y+a.height>b.y;            //a's bottom left corner  passes b's top left corner
}
function updateScore(){
points=10;
if(velocityY<0){
    Maxscore+=points;
    if(score<Maxscore){
        score=Maxscore;
    }
}
else if(velocityY>=0){
    Maxscore-=points;
}
}
