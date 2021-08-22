import './App.css';
import { ImageUpload } from './ImageUpload';
import logo from './content/logo.png'
import { useState } from 'react';

function App() {
    

  return (
    <div className="body">
      <header className="header text-center">
        <img className="header-img" src={logo} alt="" />
      </header>
      <div className="d-flex justify-content-center">
        <div className="d-flex align-items-start flex-column">
          <ImageUpload></ImageUpload>
        </div>
      </div>
    </div>
  );
}

export default App;

