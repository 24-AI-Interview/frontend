// File: src/pages/MyPage/MyActivityTab/ResumeList.jsx
import React, { useEffect, useState } from "react";
import styles from "./MyActivityTab.module.css";
import Button from "../../../components/Common/Button";
import { fetchMySelfIntroSummaries } from "../../../api/mypage";

export default function ResumeList() {
  const userId = "user_abc"; // TODO: 실제 로그인 사용자로 대체
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);
  const [sort, setSort] = useState("최신순");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchMySelfIntroSummaries({ userId });
        if (!ignore) setItems(data || []);
      } catch (e) {
        setErr("데이터를 불러오지 못했습니다. 다시 시도해주세요.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const sorted = [...items].sort((a, b) => {
    if (sort === "최신순") return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    if (sort === "제목순") return (a.title || "").localeCompare(b.title || "");
    return 0;
  });

  const onOpen = (id) => {
    // 상세 보기 or 편집 화면으로 이동
    // ex) navigate(`/selfintro/${id}`)
    alert(`자기소개서 열기: ${id}`);
  };

  const onCreate = () => {
    // 새 작성하기 화면 이동
    alert("새 자기소개서 작성");
  };

  if (loading) return <div className={styles.loading}>불러오는 중…</div>;
  if (err) return <div className={styles.error}>{err} <button onClick={()=>window.location.reload()}>재시도</button></div>;

  if (!sorted.length) {
    return (
      <div className={styles.empty}>
        저장된 자기소개서가 없습니다.
        <div>
          <Button text="+ 새 자기소개서 작성" onClick={onCreate} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listWrap}>
      <div className={styles.toolbar}>
        <Button text="+ 새 자기소개서 작성" onClick={onCreate} />
        <select className={styles.select} value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option>최신순</option>
          <option>제목순</option>
        </select>
      </div>

      <ul className={styles.cardList}>
        {sorted.map(item => (
          <li key={item.resumeId} className={styles.card}>
            <div className={styles.cardHead}>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              <span className={styles.muted}>글자 수 {item.length?.toLocaleString() ?? 0}</span>
            </div>
            <div className={styles.cardMeta}>
              <span>생성 {item.createdAt}</span>
              <span>수정 {item.updatedAt || "-"}</span>
            </div>
            <div className={styles.cardActions}>
              <Button text="열람/편집" onClick={()=>onOpen(item.resumeId)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
