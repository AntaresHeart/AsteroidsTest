// JavaScript source code

let angleConstant = 12;
let halfShip = 24;
let drift = 0.989;

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



//Define the player class
/* code snipet I wanted to save
                    ctx.save()
                    ctx.translate(this.position.x, this.position.y);
                    ctx.rotate(Math.PI / 2);  //change this to evaluate dynamically later
                    ctx.drawImage(ship_3, -ship_3.width / 2, -ship_3.height / 2);                   
                    ctx.restore();
*/

class Player {
    constructor() {
        this.position = {
            x : c.width / 2 - halfShip,
            y : c.height / 2 - halfShip       
        }
        this.velocity = {
            x : 0,
            y: 0,
        }
        this.stationary = true;        }
           
    draw() {

        if (this.stationary) {
            ctx.save()
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(angleConstant * Math.PI / 6);
            console.log("Draw Method :", angleConstant);
            ctx.translate(-halfShip, -halfShip);
            ctx.drawImage(shipSteady, 0, 0);
            ctx.restore();
        } else {
            ctx.save()
            ctx.translate(c.width / 2, c.height / 2);
            ctx.rotate(angleConstant * Math.PI / 6);
            console.log("Draw Method :", angleConstant);
            ctx.translate(-halfShip, -halfShip);
            ctx.drawImage(shipPower, 0, 0);
            ctx.restore();
        }  
    }
    update() {
        this.draw();
        this.position.x -= this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const hero = new Player();



const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, c.width, c.height);
    hero.update();
    hero.velocity.y = hero.velocity.y * drift;
    hero.velocity.x = hero.velocity.x * drift;
}

//size the game based on the size available on loading.
window.onload = (event) => {
    animate();
};


const movePlayer = (key, pressed) => {
    switch (key) {
        case "ArrowUp":
            if (pressed) {
                hero.velocity.y = hero.position.y - (hero.position.y + 2 * Math.cos(angleConstant * (Math.PI / 6)));
                hero.velocity.x = hero.position.x - (hero.position.x + 2 * Math.sin(angleConstant * (Math.PI / 6)));                
            }
            console.log("ArrowUp: ", angleConstant);
            break;

        case "ArrowLeft":
            if (pressed) {
                if (angleConstant === 12) {
                    angleConstant = 1;
                } else {
                    angleConstant++;
                }
            }
            console.log("ArrowLeft: ", angleConstant);
            break;

        case "ArrowRight":
            if (pressed) {
                if (angleConstant === 1) {
                    angleConstant = 12;
                } else {
                    angleConstant--;
                }
            }
            console.log("ArrowRight: ", angleConstant);
            break;
    }

}

/* PI ROTATION RATIOS FOR LATER !!!javascript rotation happens in clockwise direction!!!
0 degrees = 12 * PI / 6
30 degrees = 1 * PI / 6
60 degrees = 2 * PI / 6
90 degrees = 3 * PI / 6  // this turned the ship to face the left border
120 degrees = 4 * PI / 6
150 degrees = 5 * PI / 6
180 degrees = 6 * PI / 6
210 degrees = 7 * PI / 6
240 degrees = 8 * PI / 6
270 degrees = 9 * PI / 6
300 degrees = 10 * PI / 6
330 degrees = 11 * PI / 6
360 degrees = 12 * PI / 6

//thinking of using the constant to feed in the rotation of the ship
let rotationConst = 0; default is spawn facing top of page
*/

window.addEventListener("keydown", ({key}) => {
    movePlayer(key, true);
});


window.addEventListener("keyup", ({ key }) => {
    movePlayer(key, false);
});

