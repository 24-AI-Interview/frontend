// File: src/pages/Interview/CategorySelect.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategorySelect.module.css";
import PageHero from "../../components/Common/PageHero";
import { jobCategories } from "../../data/jobCategories";

export default function CategorySelect() {
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedMinor, setSelectedMinor] = useState("");
  const navigate = useNavigate();

  const handleMajorSelect = (major) => { setSelectedMajor(major); setSelectedMinor(""); };
  const handleMinorSelect = (minor) => setSelectedMinor(minor);

  const handleDone = () => {
    // TODO: DB에서 선택 카테고리에 맞는 질문 fetch 후 사용
    const questions = [
      "우리 회사에 지원하게 된 동기는 무엇인가요?",
      "최근 해결한 문제와 접근 방법은?",
      "협업 과정에서 갈등 해결 경험은?",
    ];
    navigate("/interview/precheck", {
          state: { 
            job: `${selectedMajor}/${selectedMinor}`, questions 
           },
    });
  };

  return (
    <div className={styles.page}>
      <PageHero
        badge="면접 질문 선택"
        title="면접에서 답하고자 하는 질문의 유형을 선택해주세요."
      />

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
                    onClick={() => handleMajorSelect(major)}
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
                      onClick={() => handleMinorSelect(minor)}
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
                  선택한 카테고리: <strong>{selectedMajor}</strong> / <strong>{selectedMinor}</strong>
                </p>
                <button className={styles.btnPrimary} onClick={handleDone}>선택완료</button>
              </>
            ) : (
              <p>대분류와 소분류를 모두 선택해주세요.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
