import React, { useState } from 'react';
import hit from '../sound/WoodHit.mp3';

export default function Level(){
    return (<div className="levelScreen">
        <h2>Level</h2>
        <button className='focusButton' autoFocus></button>
    </div>)
}