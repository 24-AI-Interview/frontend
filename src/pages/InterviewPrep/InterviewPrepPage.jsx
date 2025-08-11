import React from 'react';
import './InterviewPrepPage.css';
import Header from '../../components/Common/Header';

// 필요 시 여러 영상으로 확장 가능 (ratio는 '9/16' or '16/9')
const VIDEOS = [
  { id: 'F5sxMs0X-LI', title: '삼성전자 합격 - 1분 자기소개 (Shorts)', ratio: '9/16' },
  { id: 'BRQVy9JBGwk', title: '토스 합격 - 1분 자기소개', ratio: '16/9' },
  { id: 'SQh4wIHUwUY', title: '강지영 아나운서가 알려주는 면접 합격 팁', ratio: '16/9' },
  { id: 'SQh4wIHUwUY', title: '강지영 아나운서가 알려주는 면접 합격 팁', ratio: '16/9' },
];

const toEmbed = (id) => `https://www.youtube.com/embed/${id}`;

const InterviewPrepPage = () => {
  return (
    <div className="interview-prep-wrapper">
      <Header />

      {/* 상단 히어로: #EBF5FD 배경 */}
      <section className="prep-hero">
        <div className="hero-inner">
          <div className="prep-badge">면접 학습 지원</div>
          <h1 className="prep-title">
            다양한 문항 각각에 대한 답변 가이드와 예시 답변을 제공합니다.
          </h1>
        </div>
      </section>

      {/* 아래 콘텐츠: 흰 박스 안에 동영상 3열 */}
      <section className="prep-content">
        <div className="prep-box">
          <div className="video-grid">
            {VIDEOS.map(({ id, title }) => (
              <div className="video-card" key={id}>
                {/* 고정 크기 영상 박스 */}
                <div className="video-media">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* 고정 카드 안의 제목 영역 */}
                <div className="video-body">
                  <h3 className="video-title">{title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InterviewPrepPage;
