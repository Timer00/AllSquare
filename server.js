const express = require('express');
// Create the app
const app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
let server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static(__dirname + '/public'));

// -WebSocket Portion-
// WebSockets work with the HTTP server
let io = require('socket.io')(server);//io is the server

let {Player,players,updatePlayers} = require("./game");//Importing game related functions

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object corresponding to that connection
    function (socket) {
        console.log("We have a new client: " + socket.id);
        players[socket.id] = new Player(socket.id);


        //Listening to THIS USER's input
        socket.on('input',
            function (input) {//The function argument has all the data sent
                players[socket.id].keys = input;//Tells the player what keys are being pressed and what not

                // This is a way to send to everyone except the sender
                //socket.broadcast.emit('data', data);
            }
        );

        // Register a callback function to run when we have an individual disconnection
        // This is run for each individual user that disconnects
        socket.on('disconnect', function () {
            delete players[socket.id];//Delete player from players array
            console.log("Client has disconnected");
        });
    }
);

let intervalo = setInterval(()=>{//Game interval, this is where the game runs
    updatePlayers(players);//Based on inputs sent, update players
    io.sockets.emit('output', players);//Send drawing information to all clients
},1000/50);