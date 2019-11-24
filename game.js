let players = {};
let [keyUp, keyDown, keyLeft, keyRight] = [87, 83, 65, 68];
let possibleCollisions = [];
let debugData = {};

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

function angle(a, b) {
    let dy = a.center.y - b.center.y;
    let dx = a.center.x - b.center.x;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

function angleDirection(angle) {
    let direction = '';
    if (angle > 45 && angle < 135) {
        direction = 'up';
    } else if (angle > 135 && angle < 225) {
        direction = 'right';
    } else if (angle > 225 && angle < 315) {
        direction = 'down';
    } else {
        direction = 'left';
    }
    return direction;
}

function Player(id, imageKey) {
    this.id = id;
    this.width = this.height = this.size = 20;
    this.x = 250;
    this.y = 250;
    this.center = {x: this.x + this.size / 2, y: this.y + this.size / 2};
    this.speed = 2;
    this.color = `rgb(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)})`;
    this.keys = {};
    this.imageKey = imageKey;

    possibleCollisions.push(this);

    this.movement = () => {
        if (this.keys[keyUp]) {
            this.y -= 1;
        }
        if (this.keys[keyDown]) {
            this.y += 1;
        }
        if (this.keys[keyLeft]) {
            this.x -= 1;
        }
        if (this.keys[keyRight]) {
            this.x += 1;
        }
    };
    this.collision = () => {
        for (let solid of possibleCollisions) {
            if (solid !== this) {
                if (collision(this, solid, 'touch')) {
                    if (angleDirection(angle(this, solid)) === 'up') {
                        solid.y -= 1;
                    }
                    if (angleDirection(angle(this, solid)) === 'down') {
                        solid.y += 1;
                    }
                    if (angleDirection(angle(this, solid)) === 'left') {
                        solid.x -= 1;
                    }
                    if (angleDirection(angle(this, solid)) === 'right') {
                        solid.x += 1;
                    }
                }
            }
            //debugData[this.id] = this.id+': '+angle(this,solid) +'<br>' + angleDirection(angle(this,solid));
        }
    };
    this.update = () => {
        for (let i = 0; i < this.speed; i++) {
            this.movement();
            this.collision();
        }
        this.center = {x: this.x + this.size / 2, y: this.y + this.size / 2};
    };
}

function updatePlayers(ps/*players*/) {//Updates all players using an array of players
    for (let i in ps) {
        if (ps.hasOwnProperty(i)) {
            ps[i].update();
        }
    }
}


module.exports.Player = Player;
module.exports.players = players;
module.exports.updatePlayers = updatePlayers;
module.exports.debugData = debugData;