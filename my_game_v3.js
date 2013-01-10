
//VARIABLES GLOBALES
var sWidth = 512;
var sHeight = 480;

var iKeyUp = 38;
var iKeyDown = 40;
var iKeyLeft = 37;
var iKeyRight = 39;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

canvas.width = sWidth;
canvas.height = sHeight;

document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "./images/fondo.png";

//Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "./images/hero.png";

//Mouse interact Hero
var mouseX = 0;
var mouseY = 0;


//Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "./images/monster.png";

//Bala image
var balaReady = false;
var balaImage = new Image();
balaImage.onload = function () {
    balaReady = true;
};
monsterImage.src = "./images/bala.png";
	
// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var monster = {
	x: 0,
	y: 0,
    width: 25,
    height: 25,
    speed: 128,
    incX: true,
    incY: true
};

var bala = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	rad: 0
};

var monstersCaught = 0;
	
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

canvas.addEventListener('mousemove', function(e) {
	//movementX=e.clientX;
    //movementY=e.clientY;
 
  // Print the mouse movement delta values
  //console.log("movementX=" + movementX, "movementY=" + movementY);
  mouseX = e.clientX;
  mouseY = e.clientY;
        
}, true);

//MONSTER_MOVIN
var monster_moving = function (modifier) {
    if (monster.incX) {
        monster.x += monster.speed * modifier;
        if (monster.x + monster.width >= sWidth) {
            monster.incX = false;
        }
    }
    else {
        monster.x -= monster.speed * modifier;
        if (monster.x <= 0) {
            monster.incX = true;
        }
    }

    if (monster.incY) {
        monster.y += monster.speed * modifier;
        if (monster.y + monster.height >= sHeight) {
            monster.incY = false;
        }
    } else {
        monster.y -= monster.speed * modifier;
        if (monster.y <= 0) {
            monster.incY = true;
        }
    }
};
	
// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
   	hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
   	monster.x = 32 + (Math.random() * (canvas.width - 64));
   	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
    if (iKeyUp in keysDown) { // Player holding up
	    hero.y -= hero.speed * modifier;
    }
	if (iKeyDown in keysDown) { // Player holding down
    	hero.y += hero.speed * modifier;
	}
    if (iKeyLeft in keysDown) { // Player holding left
	   	hero.x -= hero.speed * modifier;
    }
    if (iKeyRight in keysDown) { // Player holding right
    	hero.x += hero.speed * modifier;
    }
	
	
    monster_moving(modifier);

	// Are they touching?
    if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
	    ++monstersCaught;
    	reset();
    }
};

// Draw everything
var render = function () {
    if (bgReady) {
   		ctx.drawImage(bgImage, 0, 0);
    }

   	if (heroReady) {
    	//ctx.drawImage(heroImage, hero.x, hero.y);
    	var centerHeroX = hero.x; // - heroImage.width/2;
    	var centerHeroY = hero.y; // - heroImage.height/2;
    	//console.log(heroImage.x);
    	var radians = Math.atan2(mouseX - centerHeroX, mouseY - centerHeroY);
        var degree = (radians * (180 / Math.PI) * -1) + 90; 
        //ctx.rotate(Math.PI / 180 * 0.5); // 1/2 a degree
        //console.log(degree);
        ctx.save();
        ctx.translate(centerHeroX, centerHeroY); 
        ctx.rotate(-radians); 
        ctx.drawImage(heroImage,0 - heroImage.width/2 ,0 - heroImage.height/2);
        //ctx.rotate(radians);
        //ctx.translate(-centerHeroX,-centerHeroY);
		ctx.restore();
   	}
	
   	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
   	}

    // Score
   	ctx.fillStyle = "rgb(250, 250, 250)";
   	ctx.font = "12px Helvetica";
   	ctx.textAlign = "left";
   	ctx.textBaseline = "top";
   	ctx.fillText("Goblins caught: " + monstersCaught, 1, 1);
};


// The main game loop
var main = function () {
    var now = Date.now();
   	var delta = now - then;

    update(delta / 1000);
   	render();

    then = now;
};


// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible

