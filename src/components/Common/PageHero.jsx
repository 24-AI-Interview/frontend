import React from "react";
import "./PageHero.css";

/**
 * PageHero
 * - badge: 상단 배지 텍스트 (예: "면접 학습 지원")
 * - title: 메인 타이틀 (예: "다양한 문항 각각에 대한 ...")
 * - maxWidth: 가운데 정렬 폭 (기본 1312px)
 * - className: 추가 클래스 (선택)
 */
export default function PageHero({ badge, title, maxWidth = 1312, className = "" }) {
  return (
    <section className={`page-hero ${className}`}>
      <div className="page-hero__inner" style={{ maxWidth }}>
        {badge && <div className="page-hero__badge">{badge}</div>}
        {title && <h1 className="page-hero__title">{title}</h1>}
      </div>
    </section>
  );
}
