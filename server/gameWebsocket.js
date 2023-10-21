const WebSocket = require('ws');
const { getLobbyById, createGame, getSendableData, getGameByUserId} = require('./utilityFunctions');
const { cardInfo } = require('./cardInfo');

function setupGameWS(){
    const clients = new Map();
    const wss = new WebSocket.Server({ port: 8000 });

    wss.on('connection', (ws) => {
        const id = Math.floor(Math.random() * 10000000000000);
        const metadata = { id };

        ws.on('message', (messageAsString)=>{
            var message = JSON.parse(messageAsString);
            
            switch(message.type){
                case "link": 
                    // this method establishes a logical link between the lobby and the 
                    // created websocket connections also allows a check to see if if 
                    // both players are ready
                    // client ---> server
                    //        <---
                    linkUserWebsocketWithLobby(ws, message.lobbyId, message.userid);
                break;
                case "setup":
                    // this method creates the game object, and stores information about both
                    // players, relevant to the game in it.
                    // client ---> server
                    createGame(ws, message.userId, message.deckId, message.lobbyId);
                break;
                case "ready":
                    // triggering this method signifies that the player has loaded 
                    // in the game screen and is ready to recieve game data. it additionally
                    // responds with initial game state (# of cards in library for both players,
                    // deals out cards and gives each player their hand data, gives # of cards 
                    // in opponent's hand, etc...)
                    // client ---> server
                    //        <---
                    var game = getGameByUserId(message.userId);
                    ws.send(JSON.stringify(getSendableData(game, message.userId)));
                break;
                // from here on, all cases are "Action methods", which perform an action,
                // before sending the current board state to both players. these actions
                // are any game action from playing a card, to passing the turn.
                // updatePlayers(game,message) should always be the last action

                // Passing the turn is in several phases. It starts with the "pass" trigger
                // this changes the turn indicator, removes focus, and then sends a request
                // to the new active player to order any triggers
                case "pass":
                    var game = getGameByUserId(message.userId);
                    if(isPlayersTurn(message, game) && getActivePlayer(message, game).triggers == null){
                        var inactivePlayer = getInactivePlayer(message, game);

                        if(inactivePlayer.class.focus > 0 || inactivePlayer.class.ghostFocus > 0){
                            if(inactivePlayer.class.ghostFocus > 0){
                                inactivePlayer.class.ghostFocus -= 1;    
                            } else {
                                inactivePlayer.clock += 1;
                                inactivePlayer.class.focus -= 1;
                            }
                        }

                        // remove focus from cards, and put the triggers on the stack
                        // trigger types:
                        // 0: targeting request
                        // 1: cast trigger
                        // 2: focus remove trigger - extra argument, count (amount of focus removed)
                        inactivePlayer.triggers = [];
                        for(var i = 0; i < inactivePlayer.inPlay.length; i++){
                            removeFocus(inactivePlayer.inPlay[i], inactivePlayer.triggers, inactivePlayer);
                        }
                        game.turn = game.turn==1?0:1;
                        updatePlayers(message, game);
                    }
                break;

                // Next is the triggers phase. this is started with a message containing 
                // the desired order of triggers by the player at start of turn. it 
                // resolves the triggers and creates their effects. 
                case "triggers":
                    var game = getGameByUserId(message.userId);
                    var player = getActivePlayer(message, game);
                    if(isPlayersTurn(message, game) && player.triggers != null){
                        // resolve triggers here
                        for(var i = 0; i < message.triggers.length; i++){
                            // TODO: check for invalid trigger sets
                            // as it stands, a player could give triggers irrelevant to the actual
                            // game state back and they would have effect.
                            var triggerInfo = message.triggers[i];
                            var cardObj = cardInfo.find((e)=>e.id == triggerInfo.card.id);
                            switch(triggerInfo.type){
                                case 0: 
                                    if(triggerInfo.target != undefined) 
                                    cardObj.onTarget(triggerInfo.target, player, getInactivePlayer(message, game));
                                break;
                                case 1: 
                                    cardObj.cast(player, getInactivePlayer(message, game));
                                break;
                                case 2: 
                                    cardObj.onRemoveStatic(triggerInfo.count, player, getInactivePlayer(message, game));
                                break;
                            }
                        }

                        // clear triggers array, so player can pass turn
                        player.triggers = null;

                        // remove any cast spells
                        for(var i = player.inPlay.length - 1; i >= 0 ; i--){
                            if(player.inPlay[i].focus + player.inPlay[i].ghostFocus <= 0){
                                player.inPlay.splice(i,1);
                                i = player.inPlay.length;
                            }
                        }

                        // finish moving focus
                        player.pool += player.clock;
                        player.clock = 0;

                        // draw a card
                        if(player.deck.length > 0){
                            player.drawACard();
                        } else {
                            // empty deck punishment
                        }

                        updatePlayers(message, game);
                    }
                break;

                // this request performs the actions needed for a card to be played
                // it extracts the cost, puts the card into play, and performs the play
                // action on the spell.
                case "playCard":
                    var game = getGameByUserId(message.userId);
                    var player;
                    if(isPlayersTurn(message, game) && getActivePlayer(message, game).triggers == null){
                        player = getActivePlayer(message,game)

                        var playedCard = player.hand[message.handIndex];

                        if(playedCard.cost === 'X' && message.cost != 'X'){
                            if(player.pool >= message.cost && message.cost >= 0){
                                // ::: need to validate that the message.cost value is a number
                                playedCard.focus = message.cost;
                                player.pool -= message.cost;

                                player.hand.splice(message.handIndex,1);
                                player.inPlay.push(playedCard);

                                // perform play action on the played card
                                if(playedCard.play != undefined){
                                    playedCard.play(player, getInactivePlayer(message, game));
                                }
                                updatePlayers(message, game);
                            }
                        }
                        // check player has enough focus to play the card
                        if(player.pool >= playedCard.cost){

                            // if so, move the focus to the card, and put it into play

                            playedCard.focus = playedCard.cost;
                            player.pool -= playedCard.cost;

                            player.hand.splice(message.handIndex,1);
                            player.inPlay.push(playedCard);

                            // perform play action on the played card
                            if(playedCard.play != undefined){
                                playedCard.play(player, getInactivePlayer(message, game));
                                if(playedCard.onTarget != undefined){
                                    // can only be empty.
                                    player.triggers = [{card: playedCard, type: 0}];
                                }
                            }
                            updatePlayers(message, game);
                        }


                        for(var i = player.inPlay.length - 1; i >= 0 ; i--){
                            if(player.inPlay[i].focus + player.inPlay[i].ghostFocus <= 0){
                                player.inPlay.splice(i,1);
                                i = player.inPlay.length;
                            }
                        }
                    }
                    // clear out the card if it has 0 focus (ex. X-spell played for X=0)
                break;
            }
        });

        // Cleanup
        ws.on("close", () => {
            clients.delete(ws);
        });

        clients.set(ws, metadata);
    });

}

function isPlayersTurn(message, game){
    return getActivePlayer(message, game).id == message.userId
}

function updatePlayers(message, game){
    // these get de-synced depending on which client is faster.
    if(getLobbyById(game.lobbyId).creator != game.p1.id){
        getLobbyById(game.lobbyId).p2Websocket.send(JSON.stringify(getSendableData(game, game.p1.id)));
        getLobbyById(game.lobbyId).p1Websocket.send(JSON.stringify(getSendableData(game, game.p2.id)));
    } else {
        getLobbyById(game.lobbyId).p1Websocket.send(JSON.stringify(getSendableData(game, game.p1.id)));
        getLobbyById(game.lobbyId).p2Websocket.send(JSON.stringify(getSendableData(game, game.p2.id)));
    }
}

function getActivePlayer(message, game){
    if(game.turn === 0 && message.userId === game.p1.id){
        return game.p1;
    } else if(game.turn === 1 && message.userId === game.p2.id){
        return game.p2;
    }
    return false;
}

function getInactivePlayer(message, game){
    if(game.turn === 0 && message.userId === game.p1.id){
        return game.p2;
    } else if(game.turn === 1 && message.userId === game.p2.id){
        return game.p1;
    }
    return false;
}

function linkUserWebsocketWithLobby(ws, lobbyId, userid){
    var lobby = getLobbyById(lobbyId);
    if(lobby.creator == userid){
        lobby.p1Websocket = ws;
    } else if (lobby.player2 == userid){
        lobby.p2Websocket = ws;

        lobby.p1Websocket.send(JSON.stringify({}));
        lobby.p2Websocket.send(JSON.stringify({}));
    }
}

function removeFocus(card, triggers, clock){
    if(card.ghostFocus > 0){
        card.ghostFocus -= 1; 
    } else {
        card.focus -= 1;
        clock.clock += 1;
    }
    // standard remove trigger
    if(card.onRemoveStatic != null && card.onRemoveStatic != undefined){
        triggers.push({card: card, type: 2, count: 1});
    }


    // quickplay triggers
    if(card.focus + card.ghostFocus <= card.quickplay && card.quickplay != 0){
        clock.clock += card.focus;
        if(card.onRemoveStatic != null && card.onRemoveStatic != undefined){
            triggers.push({card: card, type: 2, count: card.focus + card.ghostFocus});
        }
        card.focus = 0;
        card.ghostFocus = 0;
    }


    // cast trigger
    if(card.focus + card.ghostFocus <= 0 && card.cast != null && card.cast != undefined){
        triggers.push({card: card, type: 1});
    }
}

console.log("websocket started on port 8000");
module.exports = {setupGameWS};