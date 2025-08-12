// File: src/pages/MyPage/MyActivityTab/InterviewHistory.jsx
import React, { useEffect, useState } from "react";
import styles from "./MyActivityTab.module.css";
import Button from "../../../components/Common/Button";

export default function InterviewHistory() {
  const userId = "user_abc";
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/interviews?userId=${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error("면접 이력 조회 실패");
        const data = await res.json();
        if (!ignore) setItems(data || []);
      } catch (e) {
        setErr("면접 이력을 불러오는 데 실패했습니다. 다시 시도해주세요.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const openReport = async (interviewId) => {
    // 상세 리포트 페이지 이동 or 모달
    // ex) navigate(`/interview/report/${interviewId}`)
    alert(`리포트 보기: ${interviewId}`);
  };

  if (loading) return <div className={styles.loading}>불러오는 중…</div>;
  if (err) return <div className={styles.error}>{err} <button onClick={()=>window.location.reload()}>재시도</button></div>;

  if (!items.length) {
    return (
      <div className={styles.empty}>
        아직 진행한 면접 연습 기록이 없습니다.
        <div className={styles.muted}>AI 면접에서 연습을 시작해보세요.</div>
      </div>
    );
  }

  return (
    <ul className={styles.cardList}>
      {items.map(s => (
        <li key={s.interviewId} className={styles.card}>
          <div className={styles.cardHead}>
            <h4 className={styles.cardTitle}>{s.date}</h4>
            <span className={styles.muted}>질문 {s.questionCount}개 · {s.usedResumeVersion || "자소서 미지정"}</span>
          </div>
          <div className={styles.cardMeta}>
            <span>총점 {typeof s.overallScore === "number" ? s.overallScore.toFixed(1) : "-"}</span>
            {s.status && <span>상태 {s.status}</span>}
          </div>
          <div className={styles.cardActions}>
            <Button text="리포트 보기" onClick={()=>openReport(s.interviewId)} />
          </div>
        </li>
      ))}
    </ul>
  );
}
