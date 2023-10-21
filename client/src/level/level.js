import { useState, useEffect } from "react";

export default function Level({gameWS, setGameWS, username}){

    const [p1x, setp1x] = useState(0);
    const [p1y, setp1y] = useState(0);
    const [p2x, setp2x] = useState(0);
    const [p2y, setp2y] = useState(0);

    function moveTo(x, y){
        setp1x(x);
        setp1y(y);
        gameWS.send(JSON.stringify({type:"input", username:username, posX:x, posY:y}));
    }

    useEffect(()=>{
        gameWS.onmessage = (message) => {
            var data = message.data;
            console.log(data);
            data = JSON.parse(data);
            setp2x(data.x);
            setp2y(data.y);
        };
    }, []);

    return (<div className="levelScreen">
        <h2>Level</h2>
        <button onClick={()=>{moveTo(50, 50)}}>Move</button>
        <div id="player1" style={{position: "relative", left:p1x + 'px', top:p1y + 'px'}}>Player1</div>
        <div id="player2" style={{position: "relative", left:p2x + 'px', top:p2y + 'px'}}>Player2</div>

        <button autoFocus></button>
    </div>)
}