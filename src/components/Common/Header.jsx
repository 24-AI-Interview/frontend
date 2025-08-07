import React from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="menu">
          <NavLink to="/interview-prep" className={({ isActive }) => (isActive ? 'active' : '')}>
            면접 연습
          </NavLink>
          <NavLink to="/ai-interview" className={({ isActive }) => (isActive ? 'active' : '')}>
            AI 면접
          </NavLink>
          <NavLink to="/selfintro" className={({ isActive }) => (isActive ? 'active' : '')}>
            자기소개서 작성
          </NavLink>
          <NavLink to="/aptitude" className={({ isActive }) => (isActive ? 'active' : '')}>
            인적성 검사
          </NavLink>
          <NavLink to="/mypage" className={({ isActive }) => (isActive ? 'active' : '')}>
            마이페이지
          </NavLink>
        </div>
        <div className="buttons">
          <button className="home">홈으로</button>
          <button className="logout">로그아웃</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
