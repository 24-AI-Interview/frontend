import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
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
          <NavLink to="/ai-interview" className={linkClass}>
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
