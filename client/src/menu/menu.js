import React from 'react';
import "./menu.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
  
    const openLink = function(link){
        navigate(link);
    }
  
    // const play = ()=>{
    //   openLink("/join");
    // }
  
    return(
      <div className='home' style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    }}>
        <title>Clubbing Clubs Club</title>
        <h2>Menu</h2>
        <button>
        <a href="http://localhost:3000/tutorial">Tutorial</a>
        </button>
        <p>
          Username:
        </p>
        <input>
        </input>
        <button>
        <a href="http://localhost:3000/loading">_Start_</a>
        </button>
      </div>
    );
  }
  