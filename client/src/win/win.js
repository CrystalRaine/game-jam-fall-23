import React from 'react';

export default function Win(){
    var test = [];
    for (var i = 0; i < 3; i++) {
        test.push(<div><p>{i}</p></div>)
    }
    return (<div className="winScreen">
        <h2>Win</h2>
        {test}
    </div>)
}