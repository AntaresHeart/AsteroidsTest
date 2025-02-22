// JavaScript source code

/* PI ROTATION RATIOS FOR LATER !!!javascript rotation happens in clockwise direction!!!
0 degrees = 12 * PI / 6
30 degrees = 1 * PI / 6
60 degrees = 2 * PI / 6
90 degrees = 3 * PI / 6  // this turned the ship to face the right border
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

//get our canvas then target it's context
const c = document.getElementById("game-board");
const ctx = c.getContext("2d");


//initialize proportion scaling variable
let scaling;


//initialize game variables  !!! these need created counter elements for targeting in html !!!
let lives = 5;
let roundScore = 0;
let totalScore = 0;
let round = 1; 

//Lets the game know the number of each type of asteroid to spawn per round
enemyArray = [
    { vF: 0.75, small: 10, medium: 4, large: 2 },
    { vF: 0.8, small: 15, medium: 8, large: 2 },
    { vF: 0.9, small: 20, medium: 12, large: 3 },
    { vF: 1, small: 25, medium: 16, large: 4 },
    { vF: 1.25, small: 30, medium: 20, large: 6 },
    { vF: 1.66, small: 35, medium: 24, large: 9 },
    { vF: 2.25, small: 40, medium: 28, large: 14 }
]



//Change the size of window we're using and set the scaling cosntant for the sprites
const size = () => {
    if (innerWidth > 800 && innerHeight > 800) {
        scaling = 3;
        c.width = 768;
        c.height = 768;
    } else if (innerWidth > 670 && innerHeight > 670) {
        scaling = 2;
        c.width = 512;
        c.height = 512;
    } else {
        scaling = 1;
        c.width = 256;
        c.height = 256;
    }
}


//Pull sprites
const fuel_1 = new Image();
fuel_1.src = "./Sprites/Player/ship_power_16.png";
const fuel_2 = new Image();
fuel_2.src = "./Sprites/Player/ship_power_32.png";
const fuel_3 = new Image();
fuel_3.src = "./Sprites/Player/ship_power_48.png";


const slow_1 = new Image();
slow_1.src = "./Sprites/Player/ship_release_16.png";
const slow_2 = new Image();
slow_2.src = "./Sprites/Player/ship_release_32.png";
const slow_3 = new Image();
slow_3.src = "./Sprites/Player/ship_release_48.png";


const ship_1 = new Image();
ship_1.src = "./Sprites/Player/ship_16.png";
const ship_2 = new Image();
ship_2.src = "./Sprites/Player/ship_32.png";
const ship_3 = new Image();
ship_3.src = "./Sprites/Player/ship_48.png";




//Resizing the window will make the game bigger or smaller to fit in the screen
window.addEventListener("resize", function () {
    size();
    //animate(); //I don't think we need this here
});

   


//Define the player class
class Player {
    constructor() {
        this.position = {
            x : 0,
            y : 0       
        }
        this.velocity = {
            x : 0,
            y : 0
        }
        //dunno if this belongs here
        this.accuracy = {
            fired: 0,
            hit: 0
        }
        this.stationary = true;
        this.going = false;
        this.noGas = false;
        }
           
    draw() {

        if (this.going) {
            if (scaling === 1) {
                ctx.drawImage(fuel_1, this.position.x, this.position.y);
            } else if (scaling === 2) {
                ctx.drawImage(fuel_2, this.position.x, this.position.y);
            } else {
                ctx.drawImage(fuel_3, this.position.x, this.position.y);
            }

        } else if (this.noGas) {
            if (scaling === 1) {
                ctx.drawImage(slow_1, this.position.x, this.position.y);
            } else if (scaling === 2) {
                ctx.drawImage(slow_2, this.position.x, this.position.y);
            } else {
                ctx.drawImage(slow_3, this.position.x, this.position.y);
            }

        } else {
            if (scaling === 1) {                
                ctx.drawImage(ship_1, this.position.x, this.position.y);
            } else if (scaling === 2) {
                ctx.drawImage(ship_2, this.position.x, this.position.y);
            } else {
                    ctx.save()
                    ctx.translate(this.position.x, this.position.y);
                    ctx.rotate(Math.PI / 2);  //change this to evaluate dynamically later
                    ctx.drawImage(ship_3, -ship_3.width / 2, -ship_3.height / 2);                   
                    ctx.restore();
                
            }
        }  
    }
    update() {
        this.position.x = c.width / 2 - ((scaling * 16) / 2);
        this.position.y = (c.height / 2) + ((scaling * 16) / 2);
        this.draw();

    }
}

const hero = new Player();

const startGame = () => {


}

//class Enemy {
//    constructor(x, y, z, num) {
//        this.position = {
//            x,
//            y
//        };
//    }
//}


const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, c.height, c.width);
    hero.update();
}

//size the game based on the size available on loading.
window.onload = (event) => {
    size();
    startGame();
    animate();
};

