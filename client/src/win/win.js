import React from 'react';
import picture from './Graph.png';

export default function Win(){
    var test = [];
    for (var i = 0; i < 3; i++) {
        test.push(<div><p>{i}</p></div>)
    }
    return (<div className="winScreen">
        <h2>Win</h2>
        {test}
        <img src={picture} alt="Picture" />
    </div>)
}