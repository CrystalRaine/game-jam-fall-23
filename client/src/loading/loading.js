import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import buttonSound from "../sound/Button.mp3";


var W3CWebSocket = require('websocket').w3cwebsocket;

export default function Loading({gameWS, setGameWS, username}){
    const [val, setVal] = useState("");
    const navigate = useNavigate();
    
    

    async function connect(){
        const client = new W3CWebSocket('ws://localhost:8000/ws');

        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        client.onmessage = (message) => {
            var data = message.data;
            if(data == "start"){
                navigate("/level");
            }
        };
        client.onerror = function() {
            console.log('Connection Error');
        };

        setGameWS(client);
    };

    function readyWebsocket(){
        console.log("ready");
        new Audio(buttonSound).play();        

        gameWS.send(JSON.stringify({type:"ready", username:username}));
    }

    useEffect(function (){
        // join((value)=>{
        //     setVal(value);
        // });

        connect();

    }, []);


    return (<div className="loadingScreen">
        <h2>Loading</h2>
        <p>{val}</p>
        <p>{username}</p>
        <button onClick={readyWebsocket}>Ready up</button>
    </div>)
}