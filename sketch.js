var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var sun;
var cloudsGroup,cloud_img;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var losingSound, cheerUpsound, jumpsound;

var loseImg,lose1,lose2;

function preload(){
  trex_running =   loadAnimation("trex img.png");
  trex_collided = loadAnimation("trex img.png");
  
  sunImg=loadImage("sun img.png");
    
  groundImage = loadImage("desert.jfif");
  cloud_img=loadAnimation("bird1.png","bird2.png")
  
  obstacle1 = loadImage("obstacle1 img.png");
  obstacle2 = loadImage("obstacle2 image.png");
  obstacle3 = loadImage("obstacle3 img.png");
  obstacle4 = loadImage("obstacle4 img.png");
  obstacle5 = loadImage("obstacle5 img.png");
  obstacle6 = loadImage("obstacle6 img.png");
  
  gameOverImg = loadImage("Game over.png");
  restartImg = loadImage("Restart.png");
  
  losingSound = loadSound("mixkit-player-losing-or-failing-2042.wav");
  cheerUpsound = loadSound("mixkit-funny-cartoon-melody-2881.wav");
  jumpsound = loadSound("mixkit-bike-notification-bell-590.wav");
  
  loseImg = loadImage("lose.png");
}

function setup() {
  createCanvas(400,200);
  
  trex = createSprite(50,height-20,20,32);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.4;
   
 // trex.debug = true;
  trex.setCollider("circle",20,-50,70);
  
  

  
   ground = createSprite(width,20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale=3.2;
 ground.velocityX = -(6 + 3*score/100);
  
  lose1 = createSprite(670,50,10,10);
  lose1.addImage(loseImg);
  lose1.scale=1;
  
  lose2= createSprite(-58,200,10,10);
  lose2.addImage(loseImg);
  lose2.scale=1;
  
  gameOver = createSprite(width/2,height-130);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.16;
   gameOver.depth = lose1.depth;
   lose1.depth = lose1.depth + 1;
  
  restart = createSprite(width/2,height-80);
  restart.addImage(restartImg); 
    restart.scale=1;
  
   sun = createSprite(width-90,30,10,10);
  sun.addImage("sun",sunImg);
  sun.scale=0.3;
sun.depth = lose1.depth;
   lose1.depth = lose1.depth + 1;
  
 
  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-30,800,10);  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}


function draw() {
  //trex.debug = true;
  background("white");
  
  if (gameState===PLAY){
  
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    //change the trex animation
    trex.changeAnimation("running", trex_running);
    
      if((touches.length>0||keyDown("space") && trex.y >=height-70)) {
      trex.velocityY = -12;
      jumpsound.play();
        touches=[];
    }
  
    trex.velocityY = trex.velocityY + 0.65;

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
    if(score>500){
      cheerUpsound.play();
    }
    if(score>550){
      cheerUpsound.stop();
    }
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      losingSound.play();
    }
  }
  else if (gameState === END) {
    cheerUpsound.stop();
    
      lose1.velocityX=-6;
      lose2.velocityX=6;

    
    gameOver.visible = true;
    restart.scale=0.1;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  if(mousePressedOver(restart) && gameState===END)
  { 
    reset();
  }
  
  drawSprites();
  fill("white");
  stroke("white");
  textSize(15);
  text("Score: "+ score, 50,30);
}

function reset()
{
  gameState=PLAY;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  restart.visible=false;
  gameOver.visible=false;
  
  score=0;
  
  lose1.x=670;
  lose2.x=-58;
  lose1.velocityX=0;
  lose2.velocityX=0;

}

function spawnClouds() {
    if (frameCount % 60 === 0) {
    //write code here to spawn the clouds
  var cloud = createSprite(600,50,40,10);
   cloud.addAnimation("img",cloud_img);
   cloud.y = Math.round(random(50,100));
    cloud.scale = 0.3;
    cloud.velocityX = -7;
    
     //assign lifetime to the variable
    cloud.lifetime = 230;
   cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
}
}


  
  function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,156,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    obstacle.debug = false;
    obstacle.setCollider("rectangle",0,0,94,92);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
     obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
        obstacle.depth = restart.depth;
        restart.depth = restart.depth + 1;
    
    obstacle.depth = lose2.depth;
        lose2.depth = lose2.depth + 1;
    
  }
}
