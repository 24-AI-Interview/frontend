import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Common/Header';
import BasicInfoPage from './pages/MyPage/BasicInfoPage';
import InterviewPrepPage from './pages/InterviewPrep/InterviewPrepPage';

import CategorySelect from './pages/Interview/CategorySelect';
import Precheck from './pages/Interview/Precheck';
import InterviewSessionPage from './pages/Interview/InterviewSessionPage';

import SelfIntroPage from './pages/SelfIntro/SelfIntroPage';
import AiSelfIntroPage from './pages/SelfIntro/AiSelfIntroPage';

// 👉 새로 만든 MainPage import
import MainPage from './pages/MainPage/MainPage';

import './App.css';

function App() {
  return (
    <Router>
      {/* 상단 공통 헤더 */}
      <Header />

      {/* 페이지 라우팅 (헤더 높이만큼 패딩) */}
      <main style={{ paddingTop: '72px' }}>
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />

          <Route path="/mypage" element={<BasicInfoPage />} />
          <Route path="/interview-prep" element={<InterviewPrepPage />} />

          {/* 기존 페이지들도 필요시 유지 */}
          <Route path="/ai-interview" element={<CategorySelect />} />
          <Route path="/interview/precheck" element={<Precheck />} />
          <Route path="/interview/session" element={<InterviewSessionPage />} />
          <Route path="/selfintro" element={<SelfIntroPage />} />
          <Route path="/ai-selfintro" element={<AiSelfIntroPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
