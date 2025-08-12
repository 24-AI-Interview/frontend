// File: src/App.js (또는 App.jsx)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Common/Header';
import BasicInfoPage from './pages/MyPage/BasicInfoPage';
import CategorySelect from "./pages/Interview/CategorySelect";
import InterviewPrep from './pages/InterviewPrep/InterviewPrepPage';
import Precheck from './pages/Interview/Precheck';
import InterviewSessionPage from './pages/Interview/InterviewSessionPage';
import "./App.css";

function App() {
  return (
    <Router>
      {/* 상단 공통 헤더 */}
      <Header />

      {/* 페이지 라우팅 */}
      <main className="app-main">
        <Routes>
          <Route path="/mypage" element={<BasicInfoPage />} />
          <Route path="/ai-interview" element={<CategorySelect />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/interview/precheck" element={<Precheck />} />
          <Route path="/interview/session" element={<InterviewSessionPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
