import { useState, useEffect } from "react";


export default function Level({gameWS, setGameWS, username}){

    const [p1x, setp1x] = useState(0);
    const [p1y, setp1y] = useState(0);
    const [p2x, setp2x] = useState(0);
    const [p2y, setp2y] = useState(0);

    async function move(x, y){
        gameWS.send(JSON.stringify({type:"input", username:username, posX:x, posY:y}));
    }

    const handler = (event) => {
        if (event.key === 'w') {
            move(0, -10);
        }
        else if(event.key === 'a') {
            move(-2, 0);
        }
        else if(event.key === 's') {
            move(0, 2);
        }
        else if(event.key === 'd') {
            move(2, 0);
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
        <div id="player1" className="player" style={{position: "absolute", left:p1x + 'px', top:p1y + 'px'}}>sandwich</div>
        <div id="player2" className="player" style={{position: "absolute", left:p2x + 'px', top:p2y + 'px'}}>suit</div>
        <button autoFocus className="focusButton"></button>
    </div>)
}