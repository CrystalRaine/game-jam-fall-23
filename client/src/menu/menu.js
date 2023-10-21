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
  

    // const play = ()=>{
    //   openLink("/join");
    // }
  
    return(
      <div className='home'>
        
        
        <title>Clubbing Clubs Club</title>
        <h2>Menu</h2>
        <button>
        <a href="http://localhost:3000/tutorial">Tutorial</a>
        </button>
        <label>
          Username:
        <input id='usernameField'>
          </input>
          <button onClick={setUser} className='startButton'>_Start_</button>
        </label>

      </div>
    );
  }
  