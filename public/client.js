// Keep track of our socket connection
let socket;

let keys = {};
let [keyUp, keyDown, keyLeft, keyRight] = [87, 83, 65, 68];
let [upArrow, downArrow, leftArrow, rightArrow] = [38, 40, 37, 39];
let images = [];

function loadImages(imgs,loadCode){
    for (let i in imgs){
        images[imgs[i].name] = new Image();
        images[imgs[i].name].src = imgs[i].src+imgs[i].name+imgs[i].type;
        images[imgs[i].name].onload = ()=>{
            if (i == imgs.length-1){
                loadCode();
            }
        }
    }
}

function run(){
    loadImages([
        {name: 'square0',type:'.png',src:'../images/'},
        {name: 'square1',type:'.png',src:'../images/'},
        {name: 'square2',type:'.png',src:'../images/'},
        {name: 'square3',type:'.png',src:'../images/'},
    ],setup);
}

function setup() {
    let canvas = document.getElementById('box');
    let ctx = canvas.getContext('2d');
    ctx.translate(0.5, 0.5);
    ctx.imageSmoothingEnabled = false;

    socket = io.connect();//Connect to the server

    socket.on('output',function (output) {//Listen from any output from the server, in this case what to draw on screen
            ctx.clearRect(0,0,canvas.width,canvas.height);//clear canvas for new frames
            for (let i in output){
                if (output.hasOwnProperty(i)) {
                    console.log('square'+output[i].imageKey);
                    ctx.drawImage(images['square'+output[i].imageKey],output[i].x,output[i].y,output[i].size,output[i].size);
                }
            }
        }
    );
    let debugElements = [document.getElementById('value1'),document.getElementById('value2')];
    socket.on('debugData',function (debugData){
        let c = 0;
       for (let i in debugData){
           if (typeof debugData !== "undefined") {
               debugElements[c].innerHTML = debugData[i];
               c++;
           }
       }
    });

    input();//Listen for input from the computer
}

function input() {
    window.addEventListener("keydown", checkKeyDown, false);
    function checkKeyDown(event) {
        keys[event.keyCode] = true;//Store input information in keys
        sendInput();
    }

    window.addEventListener("keyup", checkKeyUp, false);
    function checkKeyUp(event) {
        keys[event.keyCode] = false;//Store input information in keys
        sendInput();
    }
}

// Function for sending input to the server
function sendInput() {
    // Send the input to the server
    socket.emit('input', keys);
}
