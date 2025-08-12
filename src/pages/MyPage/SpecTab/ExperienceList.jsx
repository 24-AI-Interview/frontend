// File: src/pages/MyPage/SpecTab/ExperienceList.jsx
import React from "react";
import styles from "./SpecTab.module.css";

export default function ExperienceList({ items, onChange }) {
  const addRow = () => onChange([...items, { company: "", role: "", period: "", description: "" }]);
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const set = (idx, key, val) => {
    const next = items.map((it, i) => (i === idx ? { ...it, [key]: val } : it));
    onChange(next);
  };

  return (
    <div className={styles.listStack}>
      {items.map((it, idx) => (
        <div key={idx} className={styles.grid2}>
          <div className={styles.field}>
            <label>회사명</label>
            <input value={it.company} onChange={e => set(idx, "company", e.target.value)} placeholder="AI 스타트업" />
          </div>
          <div className={styles.field}>
            <label>직무</label>
            <input value={it.role} onChange={e => set(idx, "role", e.target.value)} placeholder="백엔드 인턴" />
          </div>
          <div className={styles.field}>
            <label>재직 기간</label>
            <input value={it.period} onChange={e => set(idx, "period", e.target.value)} placeholder="2023.07 ~ 2023.08" />
          </div>
          <div className={styles.fieldFull}>
            <label>주요 업무</label>
            <textarea rows={3} value={it.description} onChange={e => set(idx, "description", e.target.value)} placeholder="Spring 기반 API 개발 및 테스트" />
          </div>
          <button type="button" className={styles.removeBtn} onClick={() => remove(idx)}>삭제</button>
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={addRow}>+ 경력 추가</button>
    </div>
  );
}
