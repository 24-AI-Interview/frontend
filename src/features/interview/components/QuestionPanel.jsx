import React, { useEffect, useMemo, useState } from "react";
import styles from "../../../pages/Interview/CategorySelect.module.css";
import { jobCategories } from "../../../data/jobCategories";

export default function QuestionPanel({ selected, onChange, onConfirm }) {
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedMinor, setSelectedMinor] = useState("");

  // 부모에서 내려온 값과 동기화 ("대분류/소분류" 형태 허용)
  useEffect(() => {
    if (!selected) {
      setSelectedMajor("");
      setSelectedMinor("");
      return;
    }
    const [maj, min] = String(selected).split("/");
    if (maj && jobCategories[maj]) {
      setSelectedMajor(maj);
      setSelectedMinor(min || "");
    } else {
      setSelectedMajor("");
      setSelectedMinor("");
    }
  }, [selected]);

  const jobValue = useMemo(() => {
    if (selectedMajor && selectedMinor) return `${selectedMajor}/${selectedMinor}`;
    if (selectedMajor) return selectedMajor;
    return "";
  }, [selectedMajor, selectedMinor]);

  const pickMajor = (maj) => {
    setSelectedMajor(maj);
    setSelectedMinor("");
    onChange?.(maj);
  };

  const pickMinor = (min) => {
    setSelectedMinor(min);
    onChange?.(`${selectedMajor}/${min}`);
  };

  const confirm = (e) => {
    e?.preventDefault?.();
    if (!selectedMajor || !selectedMinor) return;
    onConfirm?.(jobValue);
  };

  // Hero/페이지 래퍼 없이 "패널"만 노출
  return (
    <div className={styles.container}>
      <div className={styles.bigbox}>
        <div className={styles.panel}>
          {/* 대분류 */}
          <div className={styles.list}>
            <h2>대분류</h2>
            <ul>
              {Object.keys(jobCategories).map((major) => (
                <li
                  key={major}
                  className={`${styles.item} ${major === selectedMajor ? styles.active : ""}`}
                  onClick={() => pickMajor(major)}
                >
                  {major}
                </li>
              ))}
            </ul>
          </div>

          {/* 소분류 */}
          <div className={styles.list}>
            <h2>소분류</h2>
            {selectedMajor ? (
              <ul>
                {jobCategories[selectedMajor].map((minor) => (
                  <li
                    key={minor}
                    className={`${styles.item} ${minor === selectedMinor ? styles.active : ""}`}
                    onClick={() => pickMinor(minor)}
                  >
                    {minor}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.placeholder}>대분류를 먼저 선택하세요</p>
            )}
          </div>
        </div>

        {/* 선택 결과 */}
        <div className={styles.preview}>
          {selectedMajor && selectedMinor ? (
            <>
              <p>
                선택한 카테고리: <strong>{selectedMajor}</strong> /{" "}
                <strong>{selectedMinor}</strong>
              </p>
              <button className={styles.btnPrimary} onClick={confirm}>
                선택완료
              </button>
            </>
          ) : (
            <p>대분류와 소분류를 모두 선택해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
