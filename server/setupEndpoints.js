const WebSocket = require('ws');

var counter = 0;

var player1Info = {
    username: null,
    ws: null,
    ready: false,
    position:{
        x:0,
        y:0,
    },
}
var player2Info = {
    username: null,
    ws: null,
    ready: false,
    position:{
        x:0,
        y:0,
    },
}

function startGameEndpoints(app){
    app.get("/test", (req, res)=>{
        res.send(JSON.stringify({"test":counter++}))
    });
}

function setupGameWS(){
    const wss = new WebSocket.Server({ port: 8000 });

    wss.on('connection', (ws) => {
        const id = Math.floor(Math.random() * 10000000000000);
        const metadata = { id };

        ws.on('message', (messageAsString)=>{
            var message = JSON.parse(messageAsString);
            console.log("a message was recieved: " + JSON.stringify(message));
            switch(message.type){
                case "ready":
                    var player = getPlayerByUsername(message.username);

                    if(player == null){
                        if(player1Info.username == null){
                            player1Info.username = message.username;
                            player1Info.ws = ws;
                        } else if (player2Info.username == null){
                            player2Info.username = username;
                            player2Info.ws = ws;
                        } else {
                            ws.send("Lobby Full");
                        }
                    } else {
                        // refresh the websocket
                        player.ws = ws;
                    }

                    console.log(counter);
                    if(player1Info.username != null) player1Info.ws.send(counter);
                    if(player2Info.username != null) player2Info.ws.send(counter);
                break;
            }
        });

        // Cleanup
        ws.on("close", () => {
        });
    });

    console.log("The websocket has been started on port 8000");

}

function getPlayerByUsername(username){
    if(player1Info.username == username){
        return player1Info;
    } else if (player2Info.username = username){
        return player2Info;
    } else {
        return null;
    }
}

module.exports = {startGameEndpoints, setupGameWS};