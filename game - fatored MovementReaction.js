let players = {};
let [keyUp, keyDown, keyLeft, keyRight] = [87, 83, 65, 68];
let possibleCollisions = [];
let directions = [];

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

function MovementReaction(aggressor,victims){//Both must have: x,y,width,height - aggressor must have: speedX,speedY,up,down,left,right;
    for (let i = 0;i < victims.length;i++){//victims is a array with the collision objects, each object has the properties listed above.
        let COS = victims[i];//collision objects
        if (aggressor === COS){
            this.objectNumber = i;
            break;
        }
    }

    aggressor._speed = [];//Copy of the variable speed from the aggressor(player), the copy is going to be altered, thus the original speed must remain
    aggressor._speed['x'] = 2;
    aggressor._speed['y'] = 2;

    function polarity(n,p,invert){
        if (invert){
            if (p === '+'){
                return -n;
            } else if (p === '-'){
                return n;
            }
        } else {
            if (p === '-'){
                return -n;
            } else if (p === '+'){
                return n;
            }
        }
    }

    directions['up'] = {
        key: keyUp,
        axis: 'y',
        polarity: '-',
        name: 'up'
    };
    directions['down'] = {
        key: keyDown,
        axis: 'y',
        polarity: '+',
        name: 'down'
    };
    directions['left'] = {
        key: keyLeft,
        axis: 'x',
        polarity: '-',
        name: 'left'
    };
    directions['right'] = {
        key: keyRight,
        axis: 'x',
        polarity: '+',
        name: 'right'
    };

    this.update = function () {
        for (let i in directions){
            if (aggressor.keys[directions[i].key]) {
                aggressor._speed[directions[i].axis] = polarity(aggressor.speed[directions[i].axis],directions[i].polarity,false);
                if (aggressor._speed[directions[i].axis] !== 0) {
                    for (let a = 0; a < Math.abs(aggressor._speed[directions[i].axis]); a++) {
                        aggressor[directions[i].axis] += polarity(1,directions[i].polarity,false);
                        for (let g = 0; g in victims; g++) {
                            if (g !== this.objectNumber) {
                                if (collision(aggressor, victims[g],'touch')) {
                                    aggressor[directions[i].axis] += polarity(1,directions[i].polarity,true);
                                    //Idea is to create some sort of second iterator like this one but for pushDirections instead, it would only get activated when push command
                                    //so a If would detect if should it be ran. The problem is i aint sure if should I deactivate the input based collision in case the push collision is active.
                                    break;
                                }
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
    this.speed = [];
    this.speed['x'] = 2;
    this.speed['y'] = 2;
    this.color = `rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`;
    this.keys = {};


    possibleCollisions.push(this);
    this.collision = new MovementReaction(this, possibleCollisions);

    this.update = ()=>{
        this.collision.update();
    };
    this.push = ()=>{

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