// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Common/Header';
import BasicInfoPage from './pages/MyPage/BasicInfoPage';
import CategorySelect from "./pages/Interview/CategorySelect";
import InterviewPrep from './pages/InterviewPrep/InterviewPrepPage'
import "./App.css";

function App() {
  return (
    <Router>
      {/* 상단 공통 헤더 */}
      <Header />

      {/* 페이지 라우팅 */}
      <main>
        <Routes>
          <Route path="/mypage" element={<BasicInfoPage />} />
          <Route path="/ai-interview" element={<CategorySelect />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
