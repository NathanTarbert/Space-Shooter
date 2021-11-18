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


const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', { x: 1, y: 1}); 
const projectiles = [];//we will hold all of our projectiles
const enemies = [];//we will hold all of our enemies

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height); //this will clear the screen so only one projectile moves across the screen instead of a straingh line.
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();        
    });
    enemies.forEach(enemy => { 
        enemy.update();
    });
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2 , event.clientX - canvas.width / 2 );// this is angle we need to figure out where the projectile will go
    const velocity = { x: Math.cos(angle), y: Math.sin(angle)};

    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity));    
}); 

animate();
// spawnEnemies();