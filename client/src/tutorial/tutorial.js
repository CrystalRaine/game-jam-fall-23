import React, { Component } from "react"; 

import "./tutorial.css";
import { useNavigate } from "react-router-dom";

import hit from '../sound/WoodHit.mp3';
import Button from '../sound/Button.mp3';
import chopin from '../sound/Prelude.mp3';

export default function Tutorial(){
    const navigate = useNavigate();
    const song = new Audio(chopin);

    function playHit() {
        new Audio(hit).play();
    }
    
    function pauseMusic() {
        song.pause();
    }
    
    function playMusic() {
        song.play();
    }
    
    function goToMenu(){
        pauseMusic();
        navigate("/menu");
    }

    return (<div className="tutorialScreen">
        {playMusic()}
        <h2>Tutorial</h2>
        <h3>Push the buttons to attack. Don't lose</h3>
        <button autoFocus onClick={goToMenu} className='menuButton'>back</button>
        <button
        onClick={playHit}>Hit Sound</button>
    </div>)
}