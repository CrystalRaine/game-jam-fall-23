import { useState, useEffect } from "react";
import "./level.css";
import sandwich from './ClubSandwich.png';
import suit from './ClubSuit.png';
import whoosh from '../sound/Whoosh.mp3';
import hit from '../sound/WoodHit.mp3';

// TODO: Attack varying damage
// TODO: Attack knockback
// TODO: Background image
// TODO: Attack Animation
// TODO: fix character freezing 
// TODO: clean up game on server after it finishes

export default function Level({gameWS, setGameWS, username}){
    const [p1x, setp1x] = useState(0);
    const [p1y, setp1y] = useState(0);
    const [p2x, setp2x] = useState(0);
    const [p2y, setp2y] = useState(0);

    const [p1health, setp1health] = useState(0);
    const [p2health, setp2health] = useState(0);
    
    const [p1name, setp1name] = useState("");
    const [p2name, setp2name] = useState("");

    const [attackDelay, setAttackDelay] = useState(0);

    function playHit() {
        new Audio(hit).play();
    }
    function playWhoosh() {
        new Audio(whoosh).play();
    }

    async function move(x, y){
        console.log(x);
        gameWS.send(JSON.stringify({type:"input", username:username, posX:x, posY:y}));
    }
    async function attack(right){
        console.log(attackDelay);
        if (attackDelay <= 0) {
            playWhoosh();
            playHit();
        }
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
            attack(-1);
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

            setAttackDelay(data.p1.attackDelay);

            if(data.p2.health <= 0){
                window.location.href = 'http://localhost:3000/win';
            }
            if(data.p1.health <= 0){
                window.location.href = 'http://localhost:3000/lose';
            }
        };

        document.addEventListener('keydown', function(event){
            // console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
            handler(event.keyCode);
        });
    }, []);

    var p1sprite = <img src={sandwich}></img>;
    var p2sprite = <img src={suit}></img>;

    return (<div className="levelScreen">
    <p>{p1name}: {p1health} | {p2name}: {p2health}</p>
        <div id="battlefield"></div>
        <div id="player1" className="player" style={{position: "absolute", left:p1x + 'px', top:p1y + 'px'}}>{p1sprite}</div>
        <div id="player2" className="player" style={{position: "absolute", left:p2x + 'px', top:p2y + 'px'}}>{p2sprite}</div>
    </div>)
}