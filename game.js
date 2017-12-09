let players = {};
let [keyUp, keyDown, keyLeft, keyRight] = [87, 83, 65, 68];
let possibleCollisions = [];

function collision(a, b, type) {
    if (type === 'touch') {
        if ((a.x + a.width > b.x) && (a.x < b.x + b.width) && (a.y + a.height > b.y) && (a.y < b.y + b.height)) {
            return true;
        }
    }
    if (type === 'inside') {
        if ((a.x > b.x) && (a.x + a.width < b.x + b.width) && (a.y > b.y) && (a.y + a.height < b.y + b.height)) {
            return true;
        }
    }
}

function MovementReaction(target,collisionsObject){//Both must have: x,y,width,height - Target must have: speedX,speedY,up,down,left,right;
    for (let i = 0;i < collisionsObject.length;i++){//collisionsObject is a array with the collision objects, each object has the properties listed above.
        let COS = collisionsObject[i];//collision objects
        if (target === COS){
            this.objectNumber = i;
            break;
        }
    }

    this.update = function () {
        if (target.keys[keyUp]) {
            target.speedY = -target.speed;
            if (target.speedY < 0) {
                for (let i = 0; i > target.speedY; i--) {
                    target.y -= 1;
                    for (let g = 0; g in collisionsObject; g++) {
                        if (g !== this.objectNumber) {
                            if (collision(target, collisionsObject[g],'touch')) {
                                target.y += 1;
                                collisionsObject[g].y -= 1;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (target.keys[keyDown]) {
            target.speedY = target.speed;
            if (target.speedY > 0) {
                for (let i = 0; i < target.speedY; i++) {
                    target.y += 1;
                    for (let g = 0; g in collisionsObject; g++) {
                        if (g !== this.objectNumber) {
                            if (collision(target, collisionsObject[g],'touch')) {
                                target.y -= 1;
                                collisionsObject[g].y += 1;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (target.keys[keyLeft]) {
            target.speedX = -target.speed;
            if (target.speedX < 0) {
                for (let i = 0; i > target.speedX; i--) {
                    target.x -= 1;
                    for (let g = 0; g in collisionsObject; g++) {
                        if (g !== this.objectNumber) {
                            if (collision(target, collisionsObject[g],'touch')) {
                                target.x += 1;
                                collisionsObject[g].x -= 1;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (target.keys[keyRight]) {
            target.speedX = target.speed;
            if (target.speedX > 0) {
                for (let i = 0; i < target.speedX; i++) {
                    target.x += 1;
                    for (let g = 0; g in collisionsObject; g++) {
                        if (g !== this.objectNumber) {
                            if (collision(target, collisionsObject[g],'touch')) {
                                target.x -= 1;
                                collisionsObject[g].x += 1;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

function Player(id) {
    this.id = id;
    this.width=this.height=this.size = 20;
    this.x = Math.random()*(500-this.size);
    this.y = Math.random()*(500-this.size);
    this.speed = 2;
    this.color = `rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`;
    this.keys = {};

    possibleCollisions.push(this);
    this.collision = new MovementReaction(this, possibleCollisions);

    this.update = ()=>{
        this.collision.update();
    }
}

function updatePlayers(ps/*players*/){//Updates all players using an array of players
    for (let i in ps){
        if (ps.hasOwnProperty(i)) {
            ps[i].update();
        }
    }
}


module.exports.Player = Player;
module.exports.players = players;
module.exports.updatePlayers = updatePlayers;