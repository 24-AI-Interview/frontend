// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BasicInfoPage from './pages/MyPage/BasicInfoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/mypage" element={<BasicInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
