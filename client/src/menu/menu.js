import React from 'react';
import "./menu.css";
import { useNavigate } from "react-router-dom";
import jazz from '../sound/MainJazz.mp3';


export default function Home({setUsername}) {
    const navigate = useNavigate();
  
    const openLink = function(link){
        navigate(link);
    }

    function playJazz() {
    new Audio(jazz).play();
    }

    function setUser(){
      var uf = document.getElementById("usernameField");
      console.log(uf.value);
      setUsername(uf.value);
      navigate("/loading");
    }

    function goToTutorial(){
      navigate("/tutorial");
    }
  

    // const play = ()=>{
    //   openLink("/join");
    // }
  
    return(
      <div className='home'>
        {playJazz()}
        
        <title>Clubbing Clubs Club</title>
        <h2>Menu</h2>
        <button onClick={goToTutorial} className='tutorialButton'>Tutorial</button>
        <p>
          Username:
        </p>
        <div>
          <input id='usernameField'></input>
          <button onClick={setUser} className='startButton'>Start</button>
        </div>
      </div>
    );
  }
  