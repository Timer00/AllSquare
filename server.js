const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.send('Hello World!')
});

let server = app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});

// -WebSocket Portion-
// WebSockets work with the HTTP server
io = require('socket.io')(server);//io is the server

let {Player,players,updatePlayers,debugData} = require("./game");//Importing game related functions

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object corresponding to that connection
    function (socket) {
        console.log("We have a new client: " + socket.id);
        players[socket.id] = new Player(socket.id,Object.keys(io.sockets.connected).length-1);

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
    io.sockets.emit('debugData',debugData);
},1000/50);