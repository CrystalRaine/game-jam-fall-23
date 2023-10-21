import React from 'react';
import picture from './bubbles.jpg';

export default function Win(){
    var test = [];
    for (var i = 0; i < 10; i++) {
        test.push(<div><p>{i}</p></div>)
    }
    return (<div className="winScreen">
        <h2>Win</h2>
        {test}
        <img src={picture} alt="Picture" />
    </div>)
}