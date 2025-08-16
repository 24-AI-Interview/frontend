// File: src/pages/MyPage/SpecTab/EducationSection.jsx
import React from "react";
import styles from "./SpecTab.module.css";

export default function EducationSection({ value, onChange }) {
  return (
    <div className={styles.grid2}>
      <div className={styles.field}>
        <label>학교명 *</label>
        <input value={value.school} onChange={e => onChange("school", e.target.value)} placeholder="숙명여자대학교" />
      </div>
      <div className={styles.field}>
        <label>전공 *</label>
        <input value={value.major} onChange={e => onChange("major", e.target.value)} placeholder="인공지능공학부" />
      </div>

      <div className={styles.field}>
        <label>재학 상태 *</label>
        <select value={value.status} onChange={e => onChange("status", e.target.value)}>
          <option value="재학">재학</option>
          <option value="휴학">휴학</option>
          <option value="졸업예정">졸업예정</option>
          <option value="졸업">졸업</option>
        </select>
      </div>

      <div className={styles.field}>
        <label>입학 연도 *</label>
        <input value={value.admissionYear} onChange={e => onChange("admissionYear", e.target.value)} placeholder="2022" />
      </div>

      <div className={styles.field}>
        <label>졸업 연도</label>
        <input value={value.graduationYear} onChange={e => onChange("graduationYear", e.target.value)} placeholder="2026" />
      </div>
    </div>
  );
}
