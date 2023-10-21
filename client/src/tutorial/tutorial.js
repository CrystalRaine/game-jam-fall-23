import React from 'react';
import hit from '../sound/WoodHit.mp3';
import whoosh from '../sound/Whoosh.mp3';
import music from '../sound/Prelude.mp3';

export default function Tutorial(){
    function playHit() {
        new Audio(hit).play();
    }
    function playWhoosh() {
        new Audio(whoosh).play();
    }
    function playMusic() {
        new Audio(music).play();
    }
    
    return (<div className="tutorialScreen">
        <h2>Tutorial</h2>
        {playMusic()}
        <h3>This is going to be the tutorial in the end. I hope we remember this.</h3>
        <button><a href="http://localhost:3000/">___back___</a></button>
        <button
        onClick={playHit}>Hit Sound</button>
        <button
        onClick={playWhoosh}>Whoosh Sound</button>
    </div>)
}