import { useState, useEffect } from "react";
import "./level.css";
import useSound from 'use-sound';

import sandwich from './ClubSandwich.png';
import suit from './ClubSuit.png';
import sandwichAttack from './ClubSandwichAttack.png';
import suitAttack from './ClubSuitAttack.png';
import nightClub from './ISU GDC background PNG.png'
import whoosh from '../sound/Whoosh.mp3';
import hit from '../sound/WoodHit.mp3';
import jump from '../sound/Jump.mp3';
import grieg from "../sound/Grieg.mp3";
import p2death from "../sound/CardDeath.mp3";

// TODO: Attack varying damage
// TODO: Attack knockback
// TODO: Background image
// TODO: clean up game on server after it finishes

export default function Level({gameWS, setGameWS, username}){
    const [p1, setp1] = useState({
        position:{x:0,y:0},
        momentum:{x:0,y:0},
        username:"",
        health:100,
        attackDelay:100,
    });
    const [p2, setp2] = useState({
        position:{x:0,y:0},
        momentum:{x:0,y:0},
        username:"",
        health:100,
        attackDelay:100,
    });

    const [play, { stop }] = useSound(
        grieg,
        {volume: 1}
    );
    function playWhoosh() {
        new Audio(whoosh).play();
    }
    function playJump() {
        new Audio(jump).play();
    }

    async function move(x, y){
        gameWS.send(JSON.stringify({type:"input", username:username, posX:x, posY:y}));
    }
    async function attack(right, attackDelay){
        gameWS.send(JSON.stringify({type:"attack", username:username, direction:right}));
    }
    

    const handler = (event) => {

        console.log(JSON.stringify(p1));

        if (event == 87 || event == 32) {
            move(0, -5);
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
            attack(-1, p1.attackDelay);
        }
        else if(event == 39) {
            attack(1, p1.attackDelay);
        }
    }
    const jumper = (event) => {
        console.log(event);
        if (event == 87 || event == 32) {
            playJump();
        }
    }

    useEffect(()=>{
        gameWS.onmessage = async (message) => {
            var data = message.data;
            data = JSON.parse(data);

            
            

            setp1(data.p1);
            setp2(data.p2);

            if(data.p2.health <= 0){
                stop();
                window.location.href = 'http://localhost:3000/win';
            }
            if(data.p1.health <= 0){
                stop();
                window.location.href = 'http://localhost:3000/lose';
            }
        };

        document.addEventListener('keydown', function(event){
            handler(event.keyCode);
        });
        document.addEventListener('keyup', function(event){
            jumper(event.keyCode);
        });
    }, []);

    if (p1.attackDelay == 99) {
        playWhoosh();
    }
    

    if(p1.attackDelay < 0){
        if(p1.momentum.x < 0){
            var p1sprite = <img src={sandwich} className="leftIdle"></img>;
        }else{
            var p1sprite = <img src={sandwich} className="idle"></img>;
        }
    } else{
        if(p1.momentum.x < 0){
            var p1sprite = <img src={sandwichAttack} className="leftAttack"></img>;
        } else{
            var p1sprite = <img src={sandwichAttack}  className="attack"></img>;
        }
    }
    if(p2.attackDelay < 0){
        if(p2.momentum.x < 0){
            var p2sprite = <img src={suit} className="leftIdle"></img>;
        }else{
            var p2sprite = <img src={suit} className="idle"></img>;
        }
    } else{
        if(p2.momentum.x < 0){
            var p2sprite = <img src={suitAttack} className="leftAttack"></img>;
        } else{
            var p2sprite = <img src={suitAttack}  className="attack"></img>;
        }
    }

    return (<div className="levelScreen">
    <p>{p1.username}: {p1.health} | {p2.username}: {p2.health}</p>
    <img src={nightClub} className="levelScreen bgImage"/>
        <div id="battlefield"></div>
        <div id="player1" className="player" style={{position: "absolute", left:p1.position.x + 'px', top:p1.position.y + 'px'}}>{p1sprite}</div>
        <div id="player2" className="player" style={{position: "absolute", left:p2.position.x + 'px', top:p2.position.y + 'px'}}>{p2sprite}</div>
    </div>)
}