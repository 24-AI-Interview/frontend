import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const { pathname } = useLocation();

  // AI 면접 활성 조건:
  // - /ai-interview  또는
  // - /interview      (정확히 이 경로) 또는
  // - /interview/...  (하위 경로)
  //   → /interview-prep 는 제외됨 (뒤가 '-'이어서 매칭 안 됨)
  const isAIInterviewActive =
    pathname.startsWith("/ai-interview") || /^\/interview(\/|$)/.test(pathname);

  const linkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ""}`;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* 좌측 메뉴 */}
        <div className={styles.menu}>
          <NavLink to="/interview-prep" className={linkClass}>
            면접 연습
          </NavLink>

          {/* AI 면접: 수동 활성 지정 */}
          <NavLink
            to="/ai-interview"
            className={`${styles.link} ${isAIInterviewActive ? styles.active : ""}`}
            aria-current={isAIInterviewActive ? "page" : undefined}
          >
            AI 면접
          </NavLink>

          <NavLink to="/selfintro" className={linkClass}>
            자기소개서 작성
          </NavLink>
          <NavLink to="/aptitude" className={linkClass}>
            인적성 검사
          </NavLink>
          <NavLink to="/mypage" className={linkClass}>
            마이페이지
          </NavLink>
        </div>

        {/* 우측 버튼 */}
        <div className={styles.buttons}>
          <button type="button" className={`${styles.btn} ${styles.home}`}>
            홈으로
          </button>
          <button type="button" className={`${styles.btn} ${styles.logout}`}>
            로그아웃
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
