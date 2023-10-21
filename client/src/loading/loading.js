import { useState, useEffect } from "react";
import {join} from "../utility/serverReq.js";

export default function Loading(){
    const [val, setVal] = useState("");
    useEffect(()=>{
        join((value)=>{
            console.log(value);
            setVal(value);
        });
    }, []);

    return (<div className="loadingScreen">
        <h2>Loading</h2>
        <p>{val}</p>
    </div>)
}