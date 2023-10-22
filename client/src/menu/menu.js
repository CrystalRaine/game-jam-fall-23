import React from 'react';
import "./menu.css";
import useSound from 'use-sound';

import { useNavigate } from "react-router-dom";
import jazz from '../sound/MainJazz.mp3';
import Button from '../sound/Button.mp3';


export default function Home({setUsername}) {
    const navigate = useNavigate();
  
    const openLink = function(link){
        navigate(link);
    }

    const [play, { stop }] = useSound(
      jazz,
      {volume: 1}
    );

    function setUser(){
      stop(); // Music
      var uf = document.getElementById("usernameField");
      console.log(uf.value);
      setUsername(uf.value);
      navigate("/loading");
    }

    function goToTutorial(){
      stop(); // Music
      new Audio(Button).play();        
      navigate("/tutorial");
    }
  

    // const play = ()=>{
    //   openLink("/join");
    // }
          

    return(
      <div className='home'>
        <title>Clubbing Clubs Club</title>
        

        <h2>Menu</h2>
        <button onClick={goToTutorial} className='tutorialButton'>Tutorial</button>
        <p>
          Username:
        </p>
        <div>
          <input id='usernameField' onClick={() => {stop(); play();}}></input>
          <button onClick={setUser} className='startButton'>Start</button>
        </div>
      </div>
    );
  }
  