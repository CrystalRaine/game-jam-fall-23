import React, { useState } from 'react';
import hit from '../sound/WoodHit.mp3';
import "./tutorial.css";
import bach from '../sound/Bach.mp3';
import music from '../sound/Prelude.mp3';
import "./tutorial.css";
import { useNavigate } from "react-router-dom";

export default function Tutorial(){
    const navigate = useNavigate();
  
    const openLink = function(link){
        navigate(link);
    }
    
    function playHit() {
        new Audio(hit).play();
    }
    
    const [state, setState] = useState(''); 
    
    function playBach() {
        new Audio(bach).play();
    }
    /*
    function playMusic() {
        new Audio(chopin).play();
    }
    */

    const handler = (event) => {
        if (event.key === 'b') {
            playBach();
        }
        else if(event.key === 'c') {
            //playMusic();
        }
    }
    function goToMenu(){
        navigate("http://localhost:3000/");
      }
    
    return (<div className="tutorialScreen"  onKeyDown={handler}>
        
        <h2>Tutorial</h2>
        
        <h3>Push the buttons to attack. Don't lose.</h3>
        <button onClick={goToMenu} className='backButton'>Back</button>
        <button
        onClick={playHit} className='hitSoundButton'>Hit Sound</button>
    </div>)
}