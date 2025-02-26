// JavaScript source code

let angleConstant = 12;
let halfShip = 24;
//let bulletDist = 15;
let drift = 0.993;

//get our canvas then target it's context
const c = document.getElementById("game-board");
const ctx = c.getContext("2d");


// static canvas size for testing
c.width = 768;
c.height = 768;


//Pull sprites
const shipPower = new Image();
shipPower.src = "./Sprites/Player/ship_power_48.png";

const shipExhausting = new Image();
shipExhausting.src = "./Sprites/Player/ship_release_48.png";

const shipSteady = new Image();
shipSteady.src = "./Sprites/Player/ship_48.png";  

const bullet = new Image();
bullet.src = "./Sprites/Player/bullet.png";  



class Player {
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
    }
           
    draw() {

        //check ship against canvas boundaries before drawing and reposition to opposite side if needed
        if (this.position.x - halfShip > c.width) {
            this.position.x = 0 - halfShip;
        }

        if (this.position.x + halfShip < 0) {
            this.position.x = c.width + halfShip;
        }

        if (this.position.y - halfShip > c.height) {
            this.position.y = 0 - halfShip;
        }

        if (this.position.y + halfShip < 0) {
                this.position.y = c.height + halfShip;
        }

        // rotate and draw the ship based on angleConstant
        ctx.save()
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 15;
        ctx.shadowOffsetY = 25;
        ctx.shadowBlur = 13;
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angleConstant * Math.PI / 6);
        ctx.translate(-halfShip, -halfShip);

        //choose ship based on speed state
        if (this.stationary) {
            ctx.drawImage(shipSteady, 0, 0);
        } else if (this.drifting) {
            ctx.drawImage(shipExhausting, 0, 0);
        } else {
            ctx.drawImage(shipPower, 0, 0);
        }

        ctx.restore();
    }


    update() {
        this.draw();
        this.position.x -= this.velocity.x;
        this.position.y += this.velocity.y;
    }

    //fire() {
    //    ctx.save();
    //    ctx.translate(this.position.x - halfShip, this.position.y + halfShip);
    //    ctx.rotate(angleConstant * Math.PI / 6);
    //    ctx.translate(-8, -8);
    //    ctx.drawImage(bullet, 0, 0);
    //    ctx.restore();
    //}
}

const hero = new Player();



const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, c.width, c.height);
    hero.update();
    hero.velocity.y = hero.velocity.y * drift;
    hero.velocity.x = hero.velocity.x * drift;
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

}

//size the game based on the size available on loading.
window.onload = (event) => {
    animate();
};


const movePlayer = (keys) => {

    if (keys["ArrowUp"] === true) {
            hero.velocity.y = hero.position.y - (hero.position.y + 1.75 * Math.cos(angleConstant * (Math.PI / 6)));
            hero.velocity.x = hero.position.x - (hero.position.x + 1.75 * Math.sin(angleConstant * (Math.PI / 6)));
        }


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

}



/* PI ROTATION RATIOS FOR LATER !!!javascript rotation happens in clockwise direction!!!
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

let keysPressed = {};
window.addEventListener("keydown", ({ key }) => {
    //if (key === " ") {
    //    hero.fire();
    //    console.log("fire");
    //}
    keysPressed[key] = true; 
    movePlayer(keysPressed);
});


window.addEventListener("keyup", ({ key }) => {
    keysPressed[key] = false;
    movePlayer(keysPressed);
});

