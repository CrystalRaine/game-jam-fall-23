import React, { useState } from 'react';
import hit from '../sound/WoodHit.mp3';
import "./tutorial.css";
import bach from '../sound/Bach.mp3';
import music from '../sound/Prelude.mp3';

export default function Tutorial(){
    function playHit() {
        new Audio(hit).play();
    }
    
    const [state, setState] = useState(''); 
    
    function playBach() {
        new Audio(bach).play();
    }
    function playMusic() {
        new Audio(music).play();
    }

    const handler = (event) => {
        if (event.key === 'b') {
            playBach();
        }
        else if(event.key === 'c') {
            playMusic();
        }
      }
    
    return (<div className="tutorialScreen"  onKeyDown={handler}>
        
        <h2>Tutorial</h2>
        {playMusic}
        <h3>Push the buttons to attack. Don't lose</h3>
        <button autoFocus><a href="http://localhost:3000/">___back___</a></button>
        <button
        onClick={playHit}>Hit Sound</button>
    </div>)
}