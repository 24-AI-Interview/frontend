import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isSelfIntroActive =
    /^\/selfintro(\/|$)/.test(pathname) || /^\/ai-selfintro(\/|$)/.test(pathname);

  const linkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ""}`;

  // 메인(/)에서는 '회원가입 / 로그인', 그 외에는 '홈으로 / 로그아웃'
  const isHome = pathname === "/";

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* 좌측 메뉴 */}
        <div className={styles.menu}>
          <NavLink to="/ai-interview" className={linkClass}>
            면접 연습
          </NavLink>

          <NavLink
            to="/selfintro"
            className={`${styles.link} ${isSelfIntroActive ? styles.active : ""}`}
            aria-current={isSelfIntroActive ? "page" : undefined}
          >
            자기소개서 작성/첨삭
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
          {isHome ? (
            <>
              <button
                type="button"
                className={`${styles.btn} ${styles.home}`}
                // TODO: 회원가입 페이지 라우트 연결 시 교체
                onClick={() => alert("회원가입 페이지로 연결해주세요.")}
              >
                회원가입
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.logout}`}
                // TODO: 로그인 페이지 라우트 연결 시 교체
                onClick={() => alert("로그인 페이지로 연결해주세요.")}
              >
                로그인
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`${styles.btn} ${styles.home}`}
                onClick={() => navigate("/")}
              >
                홈으로
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.logout}`}
                onClick={() => alert("로그아웃 로직을 연결해주세요.")}
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
