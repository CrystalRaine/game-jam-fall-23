import React from 'react';
import { useNavigate } from "react-router-dom";
import "./win.css";

export default function Win(){
    const navigate = useNavigate();

    const openLink = function(link){
        navigate(link);
    }

    function goToMenu() {
        navigate("http://localhost:3000/");
    }

    return (<div className="winScreen">
        <h2>Win</h2>
        <button onClick={goToMenu} className='menuButton'>Main Menu</button>
    </div>)
}