import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import {useRef} from 'react';

import Menu from './menu/menu.js';
import Tutorial from './tutorial/tutorial.js';
import Header from './header.js';
import Loading from './loading/loading.js';
import Level from './level/level.js';
import Win from './win/win.js';
import Lose from './lose/lose.js';
 
import "./App.css";

import bach from './sound/Bach.mp3';
import music from './sound/Prelude.mp3';

function App() {
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState(null);
  
  
  
  function playBach() {
    new Audio(bach).play();
  }
  function playMusic() {
    new Audio(music).play();
  }

  const handler = (event) => {
    if (event.key === 'b') {
        playBach();
    }
    else if(event.key === 'c') {
        playMusic();
    }
  }
  return (
    <div className='background' onKeyDown={handler}>
      <Header />
      <BrowserRouter>
        <Routes>
          {/* Home page routes */}
          <Route exact path='/tutorial' element={<Tutorial/>}>
            <Route exact path='/tutorial' element={<Tutorial/>}/>
          </Route>

          <Route exact path='/loading' element={<Loading gameWS={ws} setGameWS={setWs} username={username}/>}>
            <Route exact path='/loading' element={<Loading gameWS={ws} setGameWS={setWs}/>}/>
          </Route>

          <Route exact path='/level' element={<Level  gameWS={ws} setGameWS={setWs} username={username}/>}>
            <Route exact path='/level' element={<Level gameWS={ws} setGameWS={setWs} username={username}/>}/>
          </Route>

          <Route exact path='/win' element={<Win/>}>
            <Route exact path='/win' element={<Win/>}/>
          </Route>

          <Route exact path='/lose' element={<Lose/>}>
            <Route exact path='/lose' element={<Lose/>}/>
          </Route>



          {/* redirect to login for any non-given paths */}
          <Route path='*' element={<Menu setUsername={setUsername}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
