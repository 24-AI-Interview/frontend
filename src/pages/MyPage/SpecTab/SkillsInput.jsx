// File: src/pages/MyPage/SpecTab/SkillsInput.jsx
import React, { useRef, useState } from "react";
import styles from "./SpecTab.module.css";

export default function SkillsInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState("");
  const ref = useRef(null);

  const add = (txt) => {
    const clean = txt.trim();
    if (!clean) return;
    if (value.includes(clean)) return;
    onChange([...value, clean]);
    setInput("");
    ref.current?.focus();
  };

  const remove = (skill) => onChange(value.filter(s => s !== skill));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    }
  };

  return (
    <div>
      <div className={styles.chipsWrap}>
        {value.map((s) => (
          <span key={s} className={styles.chip} onClick={() => remove(s)}>
            {s} ✕
          </span>
        ))}
        <input
          ref={ref}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={styles.chipsInput}
        />
      </div>
      <p className={styles.helper}>엔터 또는 쉼표로 스킬을 추가하세요.</p>
    </div>
  );
}
