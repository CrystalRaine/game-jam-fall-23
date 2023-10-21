import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import Menu from './menu/menu.js';
import Tutorial from './tutorial/tutorial.js';
import Header from './header.js';
import Loading from './loading/loading.js';
import Level from './level/level.js';
import Win from './win/win.js';
import Lose from './lose/lose.js';
 
import "./App.css";

function App() {
  const [ws, setWs] = useState(null);

  return (
    <div className='background'>
      <Header />
      <BrowserRouter>
        <Routes>
          {/* Home page routes */}
          <Route exact path='/tutorial' element={<Tutorial/>}>
            <Route exact path='/tutorial' element={<Tutorial/>}/>
          </Route>

          <Route exact path='/loading' element={<Loading gameWS={ws} setGameWS={setWs}/>}>
            <Route exact path='/loading' element={<Loading gameWS={ws} setGameWS={setWs}/>}/>
          </Route>

          <Route exact path='/level' element={<Level/>}>
            <Route exact path='/level' element={<Level/>}/>
          </Route>

          <Route exact path='/win' element={<Win/>}>
            <Route exact path='/win' element={<Win/>}/>
          </Route>

          <Route exact path='/lose' element={<Lose/>}>
            <Route exact path='/lose' element={<Lose/>}/>
          </Route>



          {/* redirect to login for any non-given paths */}
          <Route path='*' element={<Menu/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
