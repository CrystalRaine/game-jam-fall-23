import React from 'react';

import "./tutorial.css";
import { useNavigate } from "react-router-dom";
import useSound from 'use-sound';

import hit from '../sound/WoodHit.mp3';
import Button from '../sound/Button.mp3';
import chopin from '../sound/Prelude.mp3';

export default function Tutorial(){
    const navigate = useNavigate();
    const song = new Audio(chopin);
    
    const openLink = function(link){
        navigate(link);
    }
    
    function playHit() {
        new Audio(hit).play();
    }
    
    const [play, { stop }] = useSound(
        chopin,
        {volume: 1}
    );
    
    
    function goToMenu() {
        new Audio(Button).play();
        stop();
        navigate("http://localhost:3000/");
    }

    return (<div className="tutorialScreen">
        
        <h2>Tutorial</h2>
        <h3 onMouseEnter={() => {stop(); play();}}>Use the WASD keys to move. Use the left and right arrow keys to attack in that direction. Don't lose.</h3>
        <button onClick={goToMenu} className='backButton'>Back</button>
        <button
        onClick={playHit} className='hitSoundButton'>Hit Sound</button>
    </div>)
}