const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
// console.log(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;

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
        
        
        const color = 'green';
        const angle = Math.atan2(canvas.height / 2 - y , canvas.width / 2 - x );
        const velocity = { x: Math.cos(angle), y: Math.sin(angle)};
        enemies.push(new Enemy(x, y, radius, color, velocity));
        console.log(enemies);
    }, 500); //cycly enemies in mS
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, 'blue');


const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', { x: 1, y: 1}); //create a new projectile instance
const projectiles = [];//we will hold all of our projectiles
const enemies = [];//we will hold all of our enemies

let animationId;
function animate() {
   animationId = requestAnimationFrame(animate);//setting the requestAnimationFrame to our variable, we cancel it when an enemy collides with our player and
    c.clearRect(0, 0, canvas.width, canvas.height); //this will clear the screen so only one projectile moves across the screen instead of a straingh line.
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();        
    });
    enemies.forEach((enemy, index) => { 
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);//this will check the distance between the player and the enemy
        //end game
        if(dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);// this will cancel the requestAnimationFrame if we meet our condition
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);// this will give us the distance for our projectile and enemy
            setTimeout(() => {//with our conditional inside the setTimeout it will wait until the next fram to remove the enemy to avoid any flash when there is a collision
                if(dist - enemy.radius - projectile.radius < 1) {//objects collided
                enemies.splice(index, 1);//this will look for the specific enemy in the enemies array and remove it by its index #
                projectiles.splice(projectileIndex, 1);//this will look for our projectile in the projectiles array and remove it according to its index #
                }
            }, 0);            
        });
    });
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2 , event.clientX - canvas.width / 2 );// this is angle we need to figure out where the projectile will go
    const velocity = { x: Math.cos(angle), y: Math.sin(angle)};

    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity));    
}); 

animate();
// spawnEnemies();