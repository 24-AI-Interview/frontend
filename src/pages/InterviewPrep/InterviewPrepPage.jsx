// src/pages/InterviewPrep/InterviewPrepPage.jsx
import React from 'react';
import './InterviewPrepPage.css';
import Header from '../../components/Common/Header';

const InterviewPrepPage = () => {
  return (
    <div className="interview-prep-wrapper">
      <Header />
      <div className="interview-prep-container">
        <div className="prep-badge">면접 학습 지원</div>
        <h1 className="prep-title">다양한 문항 각각에 대한 답변 가이드와 예시 답변을 제공합니다.</h1>
        <div className="prep-box">
          {/* 추후 질문/영상 리스트 컴포넌트가 들어갈 자리 */}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepPage;
