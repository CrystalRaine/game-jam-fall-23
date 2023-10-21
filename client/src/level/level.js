import { useState, useEffect } from "react";
import "./level.css";

import { useNavigate } from "react-router-dom";

export default function Level({gameWS, setGameWS, username}){
    const navigate = useNavigate();

    const [p1x, setp1x] = useState(0);
    const [p1y, setp1y] = useState(0);
    const [p2x, setp2x] = useState(0);
    const [p2y, setp2y] = useState(0);
    const [p1health, setp1health] = useState(0);
    const [p2health, setp2health] = useState(0);
    
    const [p1name, setp1name] = useState("");
    const [p2name, setp2name] = useState("");

    async function move(x, y){
        gameWS.send(JSON.stringify({type:"input", username:username, posX:x, posY:y}));
    }
    async function attack(right){
        gameWS.send(JSON.stringify({type:"attack", username:username, direction:right}));
    }

    const handler = (event) => {
        if (event == 87 || event == 32) {
            move(0, -7);
        }
        else if(event == 65) {
            move(-2, 0);
        }
        else if(event == 83) {
            move(0, 50);
        }
        else if(event == 68) {
            move(2, 0);
        }
        else if(event == 37) {
            attack(-1)
        }
        else if(event == 39) {
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

            setp1health(data.p1.health);
            setp2health(data.p2.health);

            setp1name(data.p1.username);
            setp2name(data.p2.username);

            if(data.p2.health <= 0){
                navigate("/win");
            }
            if(data.p1.health <= 0){
                navigate("/lose");
            }
        };

        document.addEventListener('keydown', function(event){
            // console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
            handler(event.keyCode);
        });   
    }, []);

    return (<div className="levelScreen">
    <p>{p1name}: {p1health} | {p2name}: {p2health}</p>
        <div id="battlefield"></div>
        <div id="player1" className="player" style={{position: "absolute", left:p1x + 'px', top:p1y + 'px'}}>Player1</div>
        <div id="player2" className="player" style={{position: "absolute", left:p2x + 'px', top:p2y + 'px'}}>Player2</div>
    </div>)
}