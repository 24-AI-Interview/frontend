// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BasicInfoPage from './pages/MyPage/BasicInfoPage';
import InterviewPrepPage from './pages/InterviewPrep/InterviewPrepPage';
import Header from './components/Common/Header';

function App() {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: '72px' }}>
        <Routes>
          <Route path="/mypage" element={<BasicInfoPage />} />
          <Route path="/interview-prep" element={<InterviewPrepPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

