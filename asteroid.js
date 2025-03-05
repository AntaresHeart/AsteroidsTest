// JavaScript source code

/* PI ROTATION RATIOS FOR LATER  !!!I thought radians needed to be used for rotation but it seems that degrees are fine. Going to stick with this for now!!!
0 degrees = 12 * PI / 6
30 degrees = 1 * PI / 6
60 degrees = 2 * PI / 6
90 degrees = 3 * PI / 6 
120 degrees = 4 * PI / 6
150 degrees = 5 * PI / 6
180 degrees = 6 * PI / 6
210 degrees = 7 * PI / 6
240 degrees = 8 * PI / 6
270 degrees = 9 * PI / 6
300 degrees = 10 * PI / 6
330 degrees = 11 * PI / 6
360 degrees = 12 * PI / 6
 
*/
//get our canvas then target it's context
const c = document.getElementById("game-board");
const ctx = c.getContext("2d");

//get our buttons and level / start screens
const startBtn = document.getElementById("start-btn");
const shipInstructions = document.getElementById("instructions-btn");
const startGameScreen = document.getElementById("start-game-screen");
const topScoreElement = document.getElementById("top-score");
const totalScoreElement = document.getElementById("total-score");
const healthElement = document.getElementById("health-left");



//define our default heading and a half-ship length for positioning
let angleConstant = 12;
const bulletWidth = 4;





//create arrays for drawing and tracking state of bullets and enemies
let bulletArray = [];
let asteroidArray = [];
let keysPressed = {};




// static canvas size for testing
c.width = 768;
c.height = 768;


//Pull all sprites
// -ship state sprites - //
const shipPower = new Image();
shipPower.src = "./Sprites/Player/ship_power_24.png";

const shipExhausting = new Image();
shipExhausting.src = "./Sprites/Player/ship_release_24.png";

const shipSteady = new Image();
shipSteady.src = "./Sprites/Player/ship_24.png";  

// -bullet sprite - //
const bulletSprite = new Image();
bulletSprite.src = "./Sprites/Player/bullet.png";  

// -enemy sprites - //
const smallAsteroid = new Image();
smallAsteroid.src = "./Sprites/Player/asteroid_16.png";

const mediumAsteroid = new Image();
mediumAsteroid.src = "./Sprites/Player/asteroid_32.png";

const largeAsteroid = new Image();
largeAsteroid.src = "./Sprites/Player/asteroid_64.png";


// -Health icon- //
const heart = new Image();
heart.src = "./Sprites/Player/life_light_12.png";

const bgImg = new Image();
bgImg.src = "./Sprites/Player/earth.png";


//create enemy objects - need to be added in multiple methods
const smallEnemy = { health: 1, size: 16, x: 0, y: 0, speed: 1.42, heading: 0, sprite: smallAsteroid };
const mediumEnemy = { health: 2, size: 32, x: 0, y: 0, speed: 0.95, heading: 0, sprite: mediumAsteroid };
const largeEnemy = { health: 3, size: 64, x: 0, y: 0, speed: 0.65, heading: 0, sprite: largeAsteroid };


//create player object
class Player{
    constructor() {
        this.position = {
            x : c.width / 2,
            y : c.height / 2
        }
        this.velocity = {
            x : 0,
            y: 0,
        }
        this.stationary = true;
        this.drifting = false;
        this.halfShip = 12;
        this.shipSpeed = 1.3;
        this.state = {
            lives: 5,
            level: 0,
            score: 0,
            topScore: 0,
            pause: false,
        }
    }
           
    draw() {

        //check ship against canvas boundaries before drawing and reposition to opposite side if needed
        if (this.position.x - this.halfShip > c.width) {
            this.position.x = 0 - this.halfShip;
        }

        if (this.position.x + this.halfShip < 0) {
            this.position.x = c.width + this.halfShip;
        }

        if (this.position.y - this.halfShip > c.height) {
            this.position.y = 0 - this.halfShip;
        }

        if (this.position.y + this.halfShip < 0) {
                this.position.y = c.height + this.halfShip;
        }

        // rotate and draw the ship based on angleConstant
        ctx.save()
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 15;
        ctx.shadowBlur = 13;
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angleConstant * Math.PI / 6);
        ctx.translate(-this.halfShip, -this.halfShip);

        //choose ship based on speed state
        if (this.stationary) {
            ctx.drawImage(shipSteady, 0, 0);
        } else if (this.drifting) {
            ctx.drawImage(shipExhausting, 0, 0);
        } else {
            ctx.drawImage(shipPower, 0, 0);
        }
        //return canvas to prevoius state
        ctx.restore();

    }


    //this is my tricky workaround for other keys locking eachother out//
    //this made it so the ship will always fly forward, if you are holding the uparrow key. //
    //it will not stop its' behaviour when another key is lifted, like the rest of the controlls//
    movePlayer() {
        if (keysPressed["ArrowUp"] === true) {
            this.velocity.y = this.position.y - (this.position.y + this.shipSpeed * Math.cos(angleConstant * (Math.PI / 6)));
            this.velocity.x = this.position.x - (this.position.x + this.shipSpeed * Math.sin(angleConstant * (Math.PI / 6)));
        }
    }


    //calll draw and update position based on velocity per frame
    update() {
        this.draw();
        this.movePlayer();
        this.position.x -= this.velocity.x;
        this.position.y += this.velocity.y;
    }

    //modify bullet object and push new bullet to the array
    fire() {
        let bullet = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            start: [0, 0],
            bulAng: 0,
            distanceTravelled: 0
        };

        bullet.x = this.position.x + this.halfShip * Math.sin(angleConstant * (Math.PI / 6)) ;
        bullet.y = this.position.y - this.halfShip * Math.cos(angleConstant * (Math.PI / 6));
        bullet.dx = 3 * Math.sin(angleConstant * (Math.PI / 6));
        bullet.dy = -3 * Math.cos(angleConstant * (Math.PI / 6));
        bullet.start = [this.position.x, this.position.y];
        bullet.bulAng = angleConstant;
        bullet.distanceTravelled = 0;
        bulletArray.push({ ...bullet });
    }

}

const hero = new Player();

const startGame = () => {    
    startGameScreen.style.display = "none";
    hero.state.level = 0;
    hero.state.lives = 5;
    requestAnimationFrame(animate);
}

const drawHud = () => {
    const hearthWidth = 14;    
    for (let i = 1; i <= hero.state.lives; i++) {
        ctx.drawImage(heart, hearthWidth * (i + 5), 20)
    }

    totalScoreElement.textContent = `TOTAL SCORE: ${hero.state.score}`
}

const createEnemyList = () => {

    for (let i = 0; i < 10 + hero.state.level; i++) {   
        asteroidArray.push({ ...smallEnemy });
    }

    if (hero.state.level > 1) {
        for (let i = 0; i < (hero.state.level - 1) * 2; i++) {
            asteroidArray.push({ ...mediumEnemy });
        }
    }

    if (hero.state.level > 2) {
        for (let i = 0; i < (hero.state.level - 1) * 3; i++) {
            asteroidArray.push({ ...largeEnemy });
        }
    }

    asteroidArray.forEach(asteroid => {
        asteroid.x = Math.floor(Math.random() * c.width - c.width / 20);
        asteroid.y = Math.floor(Math.random() * c.height - c.height / 20);
        asteroid.heading = Math.floor(Math.random() * 12);
    });

}


//Replace larger enemies with one size smaller !!! NEED TO ADD EXPLOSION ANIMATION BEFORE SPAWN !!!
const replaceEnemy = (size, x, y) => {

    if (size === 32) {
        for (let i = 0; i < 2; i++) {
            const smallReplace = { ...smallEnemy };
            smallReplace.x = x;
            smallReplace.y = y;
            smallReplace.heading = Math.floor(Math.random() * 12);
            asteroidArray.push({ ...smallReplace });
        }
    } else if (size === 64) {
        for (let i = 0; i < 2; i++) {
            const mediumReplace = { ...mediumEnemy };
            mediumReplace.x = x;
            mediumReplace.y = y;
            mediumReplace.heading = Math.floor(Math.random() * 12);
            asteroidArray.push({ ...mediumReplace });
        }
    }
}


const animate = () => {
    //Where else should I call this?
    const request = setInterval(requestAnimationFrame(animate), 100 / 6);
    //clear the canvas every frame and draw the background & hud
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(bgImg, 0, 0)
    drawHud();


    //if our enemy list is empty, our level is over - move onto next level
    if (!asteroidArray.length) {
        hero.state.level++;
        createEnemyList();
    }

    //update the ship
    hero.update();

    //gravity affects the ship every frame
    //set the drift value for the ship
    const drift = 0.993;
    hero.velocity.y = hero.velocity.y * drift;
    hero.velocity.x = hero.velocity.x * drift;


    //set the state of the ship based on velocity at time of animation
    if (Math.abs(hero.velocity.y) + Math.abs(hero.velocity.x) > 0.75) {
        hero.stationary = false;
        hero.drifting = false;
    } else if (Math.abs(hero.velocity.y) + Math.abs(hero.velocity.x) <= 0.75 && Math.abs(hero.velocity.y) + Math.abs(hero.velocity.x) > 0.4) {
        hero.stationary = false;
        hero.drifting = true;
    } else {
        hero.stationary = true;
        hero.drifting = false;


    }



    //draw bullets or mark them as "dead" !!! SOME BULLETS NOT REACHING EDGE, NOW THAT THE EDGE CASE IS CLEARER SHOULD CLEAN UP THE EDGE DEFINITION
    bulletArray.forEach(bul => {
        if (500 * 500 > Math.pow(bul.x - bul.start[0], 2) + Math.pow(bul.y - bul.start[1], 2)) {
            if (bul.x + 2 * bulletWidth > c.width && Math.sin(bul.bulAng * (Math.PI / 6)) > 0) {
                bul.start[0] = -(bul.x - bul.start[0]);
                bul.x = 0;

            }

            if (bul.x - 8 < 0 && Math.sin(bul.bulAng * (Math.PI / 6)) < 0) {
                bul.start[0] = c.width - (bul.x - bul.start[0]);
                bul.x = c.width - 8;
            }

            if (bul.y - 8 > c.height && Math.cos(bul.bulAng * (Math.PI / 6)) > 0) {
                bul.start[1] = - (bul.y - bul.start[1]);
                bul.y = 0;
            }

            if (bul.y + 8 < 0 && Math.cos(bul.bulAng * (Math.PI / 6)) > 0) {
                bul.start[1] = c.height - (bul.y - bul.start[1]);
                bul.y = c.height;
            }

            bul.x += bul.dx;
            bul.y += bul.dy;

            ctx.save();
            ctx.shadowColor = "black";
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 15;
            ctx.shadowBlur = 14;
            ctx.translate(bul.x, bul.y);
            ctx.rotate(bul.bulAng * Math.PI / 6);
            ctx.drawImage(bulletSprite, -4, -4);
            ctx.restore();
        } else {
            bulletArray.splice(bulletArray.indexOf(bul), 1);
        }
    });

    //draw enemies
    asteroidArray.forEach(asteroid => {

        //collision detection with bullets
        bulletArray.forEach(bul => {
            if (bul.x + bulletWidth > asteroid.x - asteroid.size / 2
                && bul.x < asteroid.x + asteroid.size / 2
                && bul.y + bulletWidth > asteroid.y - asteroid.size / 2
                && bul.y < asteroid.y + asteroid.size / 2) {

                bulletArray.splice(bulletArray.indexOf(bul), 1);
                asteroid.health--;
            }
        });

        if (asteroid.health < 1) {
            hero.state.score += asteroid.size + hero.state.lives;
            replaceEnemy(asteroid.size, asteroid.x, asteroid.y);
            asteroidArray.splice(asteroidArray.indexOf(asteroid), 1);
        } else {

            if (asteroid.x >= c.width && Math.sin(asteroid.heading * (Math.PI / 6)) > 0) {
                asteroid.x = 0 - asteroid.size;
            }

            if (asteroid.x + asteroid.size < 0 && Math.sin(asteroid.heading * (Math.PI / 6)) < 0) {
                asteroid.x = c.width + asteroid.size;
            }

            if (asteroid.y >= c.height && Math.cos(asteroid.heading * (Math.PI / 6)) < 0) {
                asteroid.y = 0 - asteroid.size;
            }

            if (asteroid.y + asteroid.size < 0 && Math.cos(asteroid.heading * (Math.PI / 6)) > 0) {
                asteroid.y = c.height + asteroid.size;
            }
        }


        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 15;
        ctx.shadowOffsetY = 20;
        ctx.shadowBlur = 14;
        ctx.drawImage(asteroid.sprite, asteroid.x, asteroid.y);
        ctx.restore();

        asteroid.x += asteroid.speed * Math.sin(asteroid.heading * (Math.PI / 6));
        asteroid.y -= asteroid.speed * Math.cos(asteroid.heading * (Math.PI / 6));
    });

}

 // Control the player's turning and shooting
    const movePlayer = (keys) => {

        if (keys["ArrowRight"] === true) {
            if (angleConstant === 12) {
                angleConstant = 1;
            } else {
                angleConstant++;
            }
        }


        if (keys["ArrowLeft"] === true) {
            if (angleConstant === 1) {
                angleConstant = 12;
            } else {
                angleConstant--;
            }
        }
        if (keys[" "] === true) {
            hero.fire();
        }

    }




window.addEventListener("keydown", ({ key }) => {
    keysPressed[key] = true;
    movePlayer(keysPressed)
});



window.addEventListener("keyup", ({ key }) => {
    keysPressed[key] = false;    
});


startBtn.addEventListener("click", () => {
    startGame();
})
