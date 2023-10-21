import React from 'react';
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
      <div className='home'>
        <title>Clubbing Clubs Club</title>
        <h2>Menu</h2>


      </div>
    );
  }
  