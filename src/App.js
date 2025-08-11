// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Common/Header';
import BasicInfoPage from './pages/MyPage/BasicInfoPage';

function App() {
  return (
    <Router>
      {/* 상단 공통 헤더 */}
      <Header />

      {/* 페이지 라우팅 */}
      <Routes>
        <Route path="/mypage" element={<BasicInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
