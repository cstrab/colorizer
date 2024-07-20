import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { NavHeader } from './components/NavHeader';
import { Home } from './pages/Home';
import { Colorize } from './pages/Colorize';

import './App.css';
import './styles/styles.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <NavHeader pageTitle='Colorizer' />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colorize" element={<Colorize />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
