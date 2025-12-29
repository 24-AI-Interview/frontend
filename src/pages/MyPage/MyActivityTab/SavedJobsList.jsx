// File: src/pages/MyPage/MyActivityTab/SavedJobsList.jsx
import React, { useEffect, useState } from "react";
import styles from "./MyActivityTab.module.css";
import Button from "../../../components/Common/Button";
import { fetchSavedJobs } from "../../../api/jobs";

export default function SavedJobsList() {
  const userId = "user_abc";
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchSavedJobs({ userId });
        if (!ignore) setItems(data || []);
      } catch (e) {
        setErr("데이터를 불러오지 못했습니다. 다시 시도해주세요.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const openJob = (jobId, url) => {
    if (url) window.open(url, "_blank");
    else alert(`채용 상세: ${jobId}`);
  };

  if (loading) return <div className={styles.loading}>불러오는 중…</div>;
  if (err) return <div className={styles.error}>{err} <button onClick={()=>window.location.reload()}>재시도</button></div>;

  if (!items.length) {
    return <div className={styles.empty}>스크랩한 채용 공고가 없습니다.</div>;
  }

  return (
    <ul className={styles.cardList}>
      {items.map(job => (
        <li key={job.jobId} className={styles.card}>
          <div className={styles.cardHead}>
            <h4 className={styles.cardTitle}>{job.title}</h4>
            <span className={styles.muted}>{job.company}</span>
          </div>
          <div className={styles.cardMeta}>
            <span>마감일 {job.deadline || "미정"}</span>
            <span>등록 {job.savedAt || "-"}</span>
          </div>
          <div className={styles.tags}>
            {job.tags?.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
          <div className={styles.cardActions}>
            <Button text="공고 보기" onClick={()=>openJob(job.jobId, job.url)} />
          </div>
        </li>
      ))}
    </ul>
  );
}
