// Keep track of our socket connection
let socket;

let keys = {};
let [keyUp, keyDown, keyLeft, keyRight] = [87, 83, 65, 68];
let [upArrow, downArrow, leftArrow, rightArrow] = [38, 40, 37, 39];

function setup() {
    let canvas = document.getElementById('box');
    let ctx = canvas.getContext('2d');

    socket = io.connect();//Connect to the server

    socket.on('output',function (output) {//Listen from any output from the server, in this case what to draw on screen
            ctx.clearRect(0,0,canvas.width,canvas.height);//clear canvas for new frames
            console.log(output);
            for (let i in output){
                if (output.hasOwnProperty(i)) {
                    ctx.fillStyle = output[i].color;
                    ctx.fillRect(output[i].x,output[i].y,output[i].size,output[i].size);
                }
            }
        }
    );
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
