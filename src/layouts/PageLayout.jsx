import React from "react";
import Header from "../components/Common/Header";
import "./PageLayout.css";

/**
 * 공통 레이아웃
 * - 항상 Header 고정
 * - 배경/여백 공통 처리
 * - showHero=false 인 경우 히어로 영역 숨김
 */
export default function PageLayout({
  children,
  showHero = true,
  heroTitle,
  heroBadge,
  maxWidth = 1312,
  className = "",
}) {
  return (
    <div className={`page-root ${className}`}>
      <Header />
      {showHero && (
        <section className="page-hero">
          <div className="page-hero__inner" style={{ maxWidth }}>
            {heroBadge && <div className="page-hero__badge">{heroBadge}</div>}
            {heroTitle && <h1 className="page-hero__title">{heroTitle}</h1>}
          </div>
        </section>
      )}
      <main className="page-main">{children}</main>
    </div>
  );
}
