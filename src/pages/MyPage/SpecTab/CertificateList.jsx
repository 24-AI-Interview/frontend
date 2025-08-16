// File: src/pages/MyPage/SpecTab/CertificateList.jsx
import React from "react";
import styles from "./SpecTab.module.css";

export default function CertificateList({ items, onChange }) {
  const addRow = () => onChange([...items, { name: "", organization: "", issueDate: "" }]);
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const set = (idx, key, val) => {
    const next = items.map((it, i) => (i === idx ? { ...it, [key]: val } : it));
    onChange(next);
  };

  return (
    <div className={styles.listStack}>
      {items.map((it, idx) => (
        <div key={idx} className={styles.grid3}>
          <div className={styles.field}>
            <label>자격증명</label>
            <input value={it.name} onChange={e => set(idx, "name", e.target.value)} placeholder="정보처리기사" />
          </div>
          <div className={styles.field}>
            <label>발급 기관</label>
            <input value={it.organization} onChange={e => set(idx, "organization", e.target.value)} placeholder="한국산업인력공단" />
          </div>
          <div className={styles.field}>
            <label>발급일 (YYYY-MM-DD)</label>
            <input value={it.issueDate} onChange={e => set(idx, "issueDate", e.target.value)} placeholder="2024-06-01" />
          </div>
          <button type="button" className={styles.removeBtn} onClick={() => remove(idx)}>삭제</button>
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={addRow}>+ 자격증 추가</button>
    </div>
  );
}
