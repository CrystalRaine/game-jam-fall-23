const { games, lobbies, sessionList, accounts } = require('./data.js');

function addLobbyEndpoints(app){
    app.post("/lobby/create", (req, res)=>{

        // remove an old lobby created by the same user
        var lobby = lobbies.find((e)=>e.creator == req.body.userid);
        if(lobby != undefined){
            var index = lobbies.indexOf(lobby);
            lobbies.splice(index,1);
        }
    
        var lobby = {
            lobbyID: Math.floor(Math.random() * 100000).toString(),
            creator: req.body.userid, 
            p1Websocket: null,
            player2: null,
            p2Websocket: null,
            game: null,
        }
        lobbies.push(lobby);
        res.send(JSON.stringify({gameID: lobby.lobbyID}));
    });
    
    app.post("/lobby/join", (req, res)=>{
        var lobby = lobbies.find((e)=>e.lobbyID == req.body.lobbyID);
        if(lobby != undefined){
            lobby.player2 = req.body.userid;
            res.send(JSON.stringify({message: "success"}));
        } else {
            res.send(JSON.stringify({message: "invalid ID"}));
        }
    });
}

module.exports = {addLobbyEndpoints};
