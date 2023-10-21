import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import Menu from './menu/menu.js';
import Tutorial from './tutorial/tutorial.js';
import Header from './header.js';


function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          {/* Home page routes */}
          <Route exact path='/tutorial' element={<Tutorial/>}>
            <Route exact path='/tutorial' element={<Tutorial/>}/>
          </Route>


          {/* redirect to login for any non-given paths */}
          <Route path='*' element={<Menu/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
