// File: src/pages/MyPage/MyActivityTab/MyActivityTab.jsx
import React, { useEffect, useState } from "react";
import styles from "./MyActivityTab.module.css";
import ResumeList from "./ResumeList";
import SavedJobsList from "./SavedJobsList";
import InterviewHistory from "./InterviewHistory";

const SUB_TABS = ["자기소개서", "스크랩 채용", "면접 기록"];

export default function MyActivityTab() {
  const [active, setActive] = useState(SUB_TABS[0]);

  // URL 쿼리로 탭 유지하고 싶다면 여기에 동기화 로직 추가 가능
  useEffect(() => {
    // noop
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.subtabs}>
        {SUB_TABS.map((t) => (
          <button
            key={t}
            className={`${styles.subtab} ${active === t ? styles.active : ""}`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {active === "자기소개서" && <ResumeList />}
        {active === "스크랩 채용" && <SavedJobsList />}
        {active === "면접 기록" && <InterviewHistory />}
      </div>
    </div>
  );
}
