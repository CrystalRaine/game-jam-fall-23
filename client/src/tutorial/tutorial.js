import React from 'react';

import "./tutorial.css";
import { useNavigate } from "react-router-dom";

import hit from '../sound/WoodHit.mp3';
import Button from '../sound/Button.mp3';
import chopin from '../sound/Prelude.mp3';

export default function Tutorial(){
    const navigate = useNavigate();
  
    const openLink = function(link){
        navigate(link);
    }
    
    function playHit() {
        new Audio(hit).play();
    }
    
    function playMusic() {
        new Audio(chopin).play();
    }
    
    function goToMenu() {
        new Audio(Button).play();

        navigate("http://localhost:3000/");
    }

    return (<div className="tutorialScreen">
        {playMusic()}
        <h2>Tutorial</h2>
        <h3>Push the buttons to attack. Don't lose</h3>
        <button onClick={goToMenu} className='backButton'>Back</button>
        <button
        onClick={playHit} className='backButton'>Hit Sound</button>
    </div>)
}