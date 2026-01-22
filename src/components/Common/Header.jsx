import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../auth/AuthContext";
import spectrumLogo from "../../assets/spectrum_logo.png";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const isSelfIntroActive =
    /^\/selfintro(\/|$)/.test(pathname) || /^\/ai-selfintro(\/|$)/.test(pathname);

  const linkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ""}`;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* 좌측 메뉴 */}
        <div className={styles.menu}>
          <NavLink to="/" className={styles.logoLink} aria-label="홈">
            <img src={spectrumLogo} alt="Spectrum" className={styles.logoImg} />
          </NavLink>
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
        </div>

        {/* 우측 버튼 */}
        <div className={styles.buttons}>
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                className={`${styles.btn} ${styles.home}`}
                onClick={() => navigate("/signup")}
              >
                회원가입
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.logout}`}
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`${styles.btn} ${styles.home}`}
                onClick={() => navigate("/mypage")}
              >
                마이페이지
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.logout}`}
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
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
