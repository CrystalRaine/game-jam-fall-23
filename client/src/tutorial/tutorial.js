import React from 'react';
import sound from '../sound/WoodHit.mp3';

export default function Tutorial(){
    function play() {
        new Audio(sound).play();
    }
    
    return (<div className="tutorialScreen">
        <h2>Tutorial</h2>
        <h3>This is going to be the tutorial in the end. I hope we remember this.</h3>
        <button><a href="http://localhost:3000/">___back___</a></button>
        <button
        onClick={play}>Sound</button>
    </div>)
}