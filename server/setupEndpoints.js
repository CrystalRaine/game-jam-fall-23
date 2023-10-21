const WebSocket = require('ws');

var player1Info = {
    username: null,
    ws: null,
    ready: false,
    position:{
        x:0,
        y:0,
    },
    hp: 100,
}
var player2Info = {
    username: null,
    ws: null,
    ready: false,
    position:{
        x:0,
        y:0,
    },
    hp: 100,
}

function startGameEndpoints(app){
    // app.get("/test", (req, res)=>{
    //     res.send("");
    // });
}

function setupGameWS(){
    const wss = new WebSocket.Server({ port: 8000 });

    wss.on('connection', (ws) => {
        const id = Math.floor(Math.random() * 10000000000000);
        const metadata = { id };

        ws.on('message', (messageAsString)=>{
            var message = JSON.parse(messageAsString);
            // console.log("a message was recieved: " + JSON.stringify(message));
            switch(message.type){
                case "ready":

                    var player = getPlayerByUsername(message.username);

                    if(player == null){
                        if(player1Info.username == null){
                            player1Info.username = message.username;
                            player1Info.ws = ws;
                        } else if (player2Info.username == null){
                            player2Info.username = message.username;
                            player2Info.ws = ws;
                        } else {
                            ws.send("Lobby Full");
                        }
                    } else {
                        // refresh the websocket
                        player.ws = ws;
                    }

                    if(player1Info.ws != null && player2Info.ws != null){
                        player1Info.ws.send("start");
                        player2Info.ws.send("start");  
                    }

                    console.log("P1: " + player1Info.username);
                    console.log("P2: " + player2Info.username);
                break;
                case "input":
                    console.log("input sent");
                    
                    var player = getPlayerByUsername(message.username);
                    player.position.x = message.posX;
                    player.position.y = message.posY;

                    if(player1Info.ws != null && player2Info.ws != null){
                        player1Info.ws.send(JSON.stringify(player2Info.position));
                        player2Info.ws.send(JSON.stringify(player1Info.position));  
                    } else {
                        if(player1Info.ws != null){
                            player1Info.ws.send("missing player");
                        }
                        if(player2Info.ws != null){
                            player2Info.ws.send("missing player");
                        }
                    }
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
    if(player1Info.username == null) return null;
    if(player1Info.username.localeCompare(username) == 0){
        return player1Info;
    } 
    if(player2Info.username == null) return null;
    if (player2Info.username.localeCompare(username) == 0){
        return player2Info;
    }
    return null;
}

module.exports = {startGameEndpoints, setupGameWS};