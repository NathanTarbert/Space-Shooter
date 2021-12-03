const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');  
// console.log(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');//this is the span with the id that shows our score
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }    
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);      
        c.fillStyle = this.color;
        c.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);      
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);      
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const friction = 0.98;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;//this is the value that will fade out our particle once an enemy is hit
    }

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);      
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction; //This will slow down the particles after hit
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4;// this will make sure the enemy size is only between 4-30 pixels generated randomly

        let x;
        let y;

        if(Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;//spawn enemies randomly from the canvas width
            y = Math.random() * canvas.height; //spawn enemies randomly from the canvas height
            
        }else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }        
        
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;//set the color of the enemy
        const angle = Math.atan2(canvas.height / 2 - y , canvas.width / 2 - x );
        const velocity = { x: Math.cos(angle), y: Math.sin(angle)};
        enemies.push(new Enemy(x, y, radius, color, velocity));
        console.log(enemies);
    }, 500); //cycly enemies in mS
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 10, 'white');


let projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', { x: 1, y: 1}); //create a new projectile instance
let projectiles = [];//we will hold all of our projectiles
let enemies = [];//we will hold all of our enemies
let particles = [];//we will hold all of our particles

function init() {//this function reinitializes our game so once a game ends we reset all values
    projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', { x: 1, y: 1});
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
}

let animationId;
let score = 0;
let frames = 0;
function animate() {
   animationId = requestAnimationFrame(animate);//setting the requestAnimationFrame to our variable, we cancel it when an enemy collides with our player and
    c.fillStyle = 'rgb(0, 0, 0, 0.1)';//sets the color of our background
    c.fillRect(0, 0, canvas.width, canvas.height); //this handles the screen canvas color
    player.draw();
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
        particle.update();
        }
    });

    projectiles.forEach((projectile, index) => {//if projectile goes off the screen
        projectile.update(); 
        //remove from edges of the screen
        if (projectile.x + projectile.radius < 0 ||//this will cover the left and right sides of the screen
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||//this will cover the top and bottom sides of the screen
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {//with our conditional inside the setTimeout it will wait until the next fram to remove the enemy to avoid any flash when there is a collision
                projectiles.slice(index);//this will look for our projectile in the projectiles array and remove it according to its index #                
            }, 0);  
        }                 
    });
    enemies.forEach((enemy, index) => { 
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);//this will check the distance between the player and the enemy
        //end game
        if(dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);// this will cancel the requestAnimationFrame if we meet our condition
            modalEl.style.display = 'flex';//this will show our start screen once the game has ended
            bigScoreEl.innerHTML = score;//this will display our score after the game has ended
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);// this will give us the distance for our projectile and enemy

                //when projectiles touch enemy
                if(dist - enemy.radius - projectile.radius < 1) {//objects collided

                    
                    
                    //create explosions
                    for(let i = 0; i < enemy.radius * 2; i++) {
                            particles.push(new Particle(projectile.x, 
                                projectile.y,
                                Math.random() * 2, //randomising the size of the particles
                                enemy.color, 
                                {
                                x: (Math.random() - 0.5) * Math.random() * 6,//this will result in a random number either positive or negative by subtracting 0.5 from a positive number
                                y: (Math.random() - 0.5) * Math.random() * 6
                                }
                            )
                        );
                    }

                    if(enemy.radius - 10 > 5) {  
                        
                        //increase our score
                        score += 100;
                        scoreEl.innerHTML = score;//set the score

                        gsap.to(enemy, { //this will acces our gsap library cdn imported in the html file
                            radius: enemy.radius - 10
                        });
                        setTimeout(() => {//with our conditional inside the setTimeout it will wait until the next fram to remove the enemy to avoid any flash when there is a collision
                        projectiles.splice(projectileIndex, 1);//this will look for our projectile in the projectiles array and remove it according to its index #                
                        }, 0);    
                    } else {
                        //remove the enemy from the board
                        score += 250;
                        scoreEl.innerHTML = score;//set the score
                    setTimeout(() => {//with our conditional inside the setTimeout it will wait until the next fram to remove the enemy to avoid any flash when there is a collision
                        enemies.splice(index, 1);//this will look for the specific enemy in the enemies array and remove it by its index #
                        projectiles.splice(projectileIndex, 1);//this will look for our projectile in the projectiles array and remove it according to its index #                
                        }, 0);
                    }                     
                }           
        });
    });
}

addEventListener('click', (event) => {
    console.log(projectiles);
    const angle = Math.atan2(event.clientY - canvas.height / 2 , event.clientX - canvas.width / 2 );// this is angle we need to figure out where the projectile will go
    const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };

    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity));    
}); 

startGameBtn.addEventListener('click', () => {
    init();
    animate();
    if(frames % 60 === 0) {
        spawnEnemies();
    }   
    
    modalEl.style.display = 'none';
});
// animate();
// spawnEnemies();