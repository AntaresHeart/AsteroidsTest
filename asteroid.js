// JavaScript source code

//get our canvas element and target it's context
const c = document.getElementById("game-board");
const ctx = c.getContext("2d");


//set the scale for our sizing purposes
let scaling;

//Get the size of window we're using to scale our game to the largest fit for the screen
const size = () => {
    if (innerWidth > 800 && innerHeight > 800) {
        scaling = 3;
        console.log("768", scaling)

        c.width = 768;
        c.height = 768;
    } else if (innerWidth > 670 && innerHeight > 670) {
        scaling = 2;
        console.log("512", scaling)
        c.width = 512;
        c.height = 512;
    } else {
        scaling = 1;
        console.log("256", scaling)
        c.width = 256;
        c.height = 256;
    }
}


//Pre pull all sprites for faster loading when window is resizing
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




//when someone wants to resize the window, make the game bigger or smaller to fit in the screen
window.addEventListener("resize", function () {
    size();
    animate();
});

   



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
                ctx.drawImage(ship_3, this.position.x, this.position.y);
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

