import { useState, useEffect } from "react";
import { join } from "../utility/serverReq.js";
var W3CWebSocket = require('websocket').w3cwebsocket;

export default function Loading({gameWS, setGameWS, username}){
    const [val, setVal] = useState("");
    
    async function connect(){
        const client = new W3CWebSocket('ws://localhost:8000/ws');

        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        client.onmessage = (message) => {
            var data = message.data;
            console.log(data);
        };
        client.onerror = function() {
            console.log('Connection Error');
        };

        setGameWS(client);
    };

    function readyWebsocket(){
        console.log("ready");
        gameWS.send(JSON.stringify({type:"ready", username:username}));
    }

    useEffect(function (){
        join((value)=>{
            setVal(value);
        });

        connect();

    }, []);

    return (<div className="loadingScreen">
        <h2>Loading</h2>
        <p>{val}</p>
        <button onClick={readyWebsocket}>Ready up</button>
    </div>)
}