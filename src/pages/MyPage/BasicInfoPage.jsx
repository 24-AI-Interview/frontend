// src/pages/MyPage/BasicInfoPage.jsx

import React, { useState } from 'react';
import styles from '../../styles/mypage/BasicInfoPage.module.css';
import Button from '../../components/Common/Button';

const BasicInfoPage = () => {
  const [activeTab, setActiveTab] = useState('기본정보');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내 정보</h2>

      <div className={styles.tabWrapper}>
        {['기본정보', '스펙관리', '비밀번호 변경', '회원 탈퇴'].map((tab) => (
          <div
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className={styles.box}>
        <h3 className={styles.sectionTitle}>{activeTab}</h3>
        <hr className={styles.separatorMain} />

        {activeTab === '기본정보' && (
          <>
            <div className={styles.row}>
              <label className={styles.label}>아이디</label>
              <span className={styles.value}>ktyjj0306@naver.com</span>
            </div>
            <hr className={styles.separator} />

            <div className={styles.row}>
              <label className={styles.label}>이름</label>
              <span className={styles.value}>예인</span>
            </div>
            <hr className={styles.separator} />

            <div className={styles.row}>
              <label className={styles.label}>닉네임</label>
              <input className={styles.input} placeholder="닉네임을 입력해주세요." />
              <Button text="중복확인" />
            </div>
            <p className={styles.inputDescription}>
              닉네임은 한글/영문 10자 이내로 설정 가능합니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BasicInfoPage;