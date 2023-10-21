import { useState, useEffect } from "react";
import "./level.css";


export default function Level({gameWS, setGameWS, username}){

    const [p1x, setp1x] = useState(0);
    const [p1y, setp1y] = useState(0);
    const [p2x, setp2x] = useState(0);
    const [p2y, setp2y] = useState(0);
    const [p1health, setp1health] = useState(0);
    const [p2health, setp2health] = useState(0);

    async function move(x, y){
        gameWS.send(JSON.stringify({type:"input", username:username, posX:x, posY:y}));
    }
    async function attack(right){
        gameWS.send(JSON.stringify({type:"attack", username:username, direction:right}));
    }

    const handler = (event) => {
        if (event.key === 'w') {
            move(0, -7);
        }
        else if(event.key === 'a') {
            move(-2, 0);
        }
        else if(event.key === 's') {
            move(0, 50);
        }
        else if(event.key === 'd') {
            move(2, 0);
        }
        else if(event.key === 37) {
            attack(-1)
        }
        else if(event.key === 39) {
            attack(1);
        }
    }

    useEffect(()=>{
        gameWS.onmessage = (message) => {
            var data = message.data;
            data = JSON.parse(data);
            setp2x(data.p2.position.x);
            setp2y(data.p2.position.y);
            setp1x(data.p1.position.x);
            setp1y(data.p1.position.y);
        };
    }, []);

    return (<div className="levelScreen" onKeyDown={handler}>
        <div id="battlefield"></div>
        <div id="player1" className="player" style={{position: "absolute", left:p1x + 'px', top:p1y + 'px'}}>Player1</div>
        <div id="player2" className="player" style={{position: "absolute", left:p2x + 'px', top:p2y + 'px'}}>Player2</div>
        <button autoFocus className="focusButton"></button>
    </div>)
}