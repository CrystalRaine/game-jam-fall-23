const WebSocket = require('ws');

var counter = 0;

function startGameEndpoints(app){
    app.get("/test", (req, res)=>{
        res.send(JSON.stringify({"test":counter++}))
    });
}

function setupGameWS(){

    var ws1 = null;

    const wss = new WebSocket.Server({ port: 8000 });

    wss.on('connection', (ws) => {
        const id = Math.floor(Math.random() * 10000000000000);
        const metadata = { id };

        ws.on('message', (messageAsString)=>{
            var message = JSON.parse(messageAsString);
            console.log("a message was recieved: " + JSON.stringify(message));
            switch(message.type){
                case "ready":
                    console.log(counter);
                    ws1.send(counter);
                break;
            }
        });

        // Cleanup
        ws.on("close", () => {
        });

        if(ws1 == null) ws1 = ws;
    });

    console.log("The websocket has been started on port 8000");

}


module.exports = {startGameEndpoints, setupGameWS};