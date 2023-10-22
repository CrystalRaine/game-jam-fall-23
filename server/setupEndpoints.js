const WebSocket = require('ws');

const jumpCount = 3;
const attackDelay = 100;
const speedCapX = 7;

const boundingXMax = 1200;
const boundingXMin = 0;
const boundingYMax = 600;
const boundingYMin = 200;

const frameTimeMS = 1000/60;

const attackRange = 100;

var periodicCall;

var player1Info = {
    username: null,
    ws: null,
    ready: false,
    momentum:{
        x: 0,
        y: 0,
    },
    position:{
        x:0,
        y:0,
    },
    attackDelay: 0,
    dodgeDelay: 0,
    jumps: jumpCount,
    hp: 100,
}
var player2Info = {
    username: null,
    ws: null,
    ready: false,
    momentum:{
        x: 0,
        y: 0,
    },
    position:{
        x:600,
        y:0,
    },
    attackDelay: 0,
    dodgeDelay: 0,
    jumps: jumpCount,
    hp: 100,
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

                    periodicCall = setInterval(()=>{

                        player1Info.attackDelay -= 1;
                        player2Info.attackDelay -= 1;
                        
                        player1Info.momentum.x *= 0.99;
                        player1Info.momentum.y *= 0.99;

                        player2Info.momentum.x *= 0.99;
                        player2Info.momentum.y *= 0.99;

                        player1Info.momentum.y += 0.25;
                        player2Info.momentum.y += 0.25;

                        player1Info.position.x += player1Info.momentum.x;
                        player1Info.position.y += player1Info.momentum.y;
                        player2Info.position.x += player2Info.momentum.x;
                        player2Info.position.y += player2Info.momentum.y;

                        if(player1Info.momentum.x > speedCapX){
                            player1Info.momentum.x = speedCapX;
                        }
                        if(player1Info.momentum.x < -speedCapX){
                            player1Info.momentum.x = -speedCapX;
                        }
                        if(player2Info.momentum.x > speedCapX){
                            player2Info.momentum.x = speedCapX;
                        }
                        if(player2Info.momentum.x < -speedCapX){
                            player2Info.momentum.x = -speedCapX;
                        }

                        if(player1Info.position.y > boundingYMax){
                            player1Info.position.y = boundingYMax;
                            player1Info.momentum.y = 0;
                            player1Info.jumps = jumpCount;
                        }
                        if(player2Info.position.y > boundingYMax){
                            player2Info.position.y = boundingYMax;
                            player2Info.momentum.y = 0;
                            player2Info.jumps = jumpCount;
                        }
                        if(player1Info.position.y < boundingYMin){
                            player1Info.position.y = boundingYMin;
                            player1Info.momentum.y = 0;
                        }
                        if(player2Info.position.y < boundingYMin){
                            player2Info.position.y = boundingYMin;
                            player2Info.momentum.y = 0;
                        }


                        if(player1Info.position.x < boundingXMin){
                            player1Info.position.x = boundingXMin;
                            player1Info.momentum.x = 0;

                        }
                        if(player2Info.position.x < boundingXMin){
                            player2Info.position.x = boundingXMin;
                            player2Info.momentum.x = 0;

                        }
                        if(player1Info.position.x > boundingXMax){
                            player1Info.position.x = boundingXMax;
                            player1Info.momentum.x = 0;
                        }
                        if(player2Info.position.x > boundingXMax){
                            player2Info.position.x = boundingXMax;
                            player2Info.momentum.x = 0;
                        }

                        if(player1Info.ws != null && player2Info.ws != null){
                            player1Info.ws.send(JSON.stringify({p2: getSendableInfo(player2Info), p1: getSendableInfo(player1Info)}));
                            player2Info.ws.send(JSON.stringify({p2: getSendableInfo(player1Info), p1: getSendableInfo(player2Info)}));  
                        } else {
                            if(player1Info.ws != null){
                                player1Info.ws.send("missing player");
                            }
                            if(player2Info.ws != null){
                                player2Info.ws.send("missing player");
                            }
                        }

                    }, frameTimeMS);

                break;
                case "input":
                    var player = getPlayerByUsername(message.username);
                    player.momentum.x += message.posX;

                    if(player.jumps != 0 && message.posY != 0){
                        player.jumps -= 1;
                        player.momentum.y += message.posY;
                    }
                break;
                case "attack":
                    var player = getPlayerByUsername(message.username);
                    if(player.attackDelay <= 0){
                        player.attackDelay = attackDelay;
                        var opp = getOpponentByUsername(message.username);
                        // damage opponent

                        if(message.direction == -1){
                            // left
                            if(opp.position.x > player.position.x - attackRange && opp.position.x < player.position.x){
                                if(opp.position.y > player.position.y - (attackRange / 2) && opp.position.y < player.position.y + (attackRange / 2)){
                                    // opponent is in attack hitbox
                                    opp.hp -=10;
                                }
                            }
                        }
                        if(message.direction == 1){
                            // right
                            if(opp.position.x < player.position.x + attackRange && opp.position.x > player.position.x){
                                if(opp.position.y > player.position.y - (attackRange / 2) && opp.position.y < player.position.y + (attackRange / 2)){
                                    // opponent is in attack hitbox
                                    opp.hp -=10;
                                }
                            }
                        }
                        if(opp.hp <= 0 || player.hp <= 0){
                            player1Info = {
                                username: null,
                                ws: null,
                                ready: false,
                                momentum:{
                                    x: 0,
                                    y: 0,
                                },
                                position:{
                                    x:0,
                                    y:0,
                                },
                                attackDelay: 0,
                                dodgeDelay: 0,
                                jumps: jumpCount,
                                hp: 100,
                            };
                            player2Info = {
                                username: null,
                                ws: null,
                                ready: false,
                                momentum:{
                                    x: 0,
                                    y: 0,
                                },
                                position:{
                                    x:0,
                                    y:0,
                                },
                                attackDelay: 0,
                                dodgeDelay: 0,
                                jumps: jumpCount,
                                hp: 100,
                            };
                            clearInterval(periodicCall);
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

function getOpponentByUsername(username){
    if(player1Info.username == null) return null;
    if(player1Info.username.localeCompare(username) == 0){
        return player2Info;
    } 
    if(player2Info.username == null) return null;
    if (player2Info.username.localeCompare(username) == 0){
        return player1Info;
    }
    return null;
}

function distance(x,y,x2,y2){
    return Math.sqrt(((x-x2) * (x-x2)) + ((y-y2) * (y-y2)));
}

function getSendableInfo(player){
    return{
        position:player.position,
        momentum:player.momentum,
        username:player.username,
        health:player.hp,
        attackDelay:player.attackDelay,
    }
}


module.exports = {setupGameWS};