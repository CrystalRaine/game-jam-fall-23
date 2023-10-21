import { useState, useEffect } from "react";

export default function Level({gameWS, setGameWS, username}){

    const [p1x, setp1x] = useState(0);
    const [p1y, setp1y] = useState(0);
    const [p2x, setp2x] = useState(0);
    const [p2y, setp2y] = useState(0);

    async function moveTo(x, y){
        setp1x(p1x + x);
        setp1y(p1y + y);
        gameWS.send(JSON.stringify({type:"input", username:username, posX:p1x + x, posY:p1y + y}));
    }

    const handler = (event) => {
        if (event.key === 'w') {
            moveTo(0, -2);
        }
        else if(event.key === 'a') {
            moveTo(-2, 0);
        }
        else if(event.key === 's') {
            moveTo(0, 2);
        }
        else if(event.key === 'd') {
            moveTo(2, 0);
        }
    }

    useEffect(()=>{
        gameWS.onmessage = (message) => {
            var data = message.data;
            data = JSON.parse(data);
            setp2x(data.p2.x);
            setp2y(data.p2.y);
            setp1x(data.p1.x);
            setp1y(data.p1.y);
        };
    }, []);

    return (<div className="levelScreen" onKeyDown={handler}>
        <div id="player1" className="player" style={{position: "absolute", left:p1x + 'px', top:p1y + 'px'}}>Player1</div>
        <div id="player2" className="player" style={{position: "absolute", left:p2x + 'px', top:p2y + 'px'}}>Player2</div>
        <button autoFocus className="focusButton"></button>
    </div>)
}