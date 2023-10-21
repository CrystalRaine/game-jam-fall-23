import React, { useState } from 'react';
import hit from '../sound/WoodHit.mp3';
import "./tutorial.css";

import bach from '../sound/Bach.mp3';
import chopin from '../sound/Prelude.mp3';

export default function Tutorial(){
    function playHit() {
        new Audio(hit).play();
    }
    
    const [state, setState] = useState(''); 
    

    function playBach() {
        new Audio(bach).play();
    }
    function playMusic() {
        new Audio(chopin).play();
    }
    
    return (<div className="tutorialScreen">
        {playMusic()}
        <h2>Tutorial</h2>
        <h3>Push the buttons to attack. Don't lose</h3>
        <button autoFocus><a href="http://localhost:3000/">___back___</a></button>
        <button
        onClick={playHit}>Hit Sound</button>
    </div>)
}