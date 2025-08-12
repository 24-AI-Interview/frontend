import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./InterviewPrepPage.module.css";
import PageHero from "../../components/Common/PageHero";
import CategoryPanelInline from "./CategoryPanelInline"; // 경량 패널만 사용

const VIDEOS = [
  { id: "F5sxMs0X-LI", title: "삼성전자 합격 - 1분 자기소개 (Shorts)", ratio: "16/9" },
  { id: "BRQVy9JBGwk", title: "토스 합격 - 1분 자기소개", ratio: "16/9" },
  { id: "SQh4wIHUwUY", title: "강지영 아나운서가 알려주는 면접 합격 팁", ratio: "16/9" },
];

const toEmbed = (id) => `https://www.youtube.com/embed/${id}`;
const ratioClass = (ratio) => (ratio === "9/16" ? styles.ratio9x16 : styles.ratio16x9);

export default function InterviewPrepPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "videos"; // "videos" | "questions"
  const job = params.get("job") || "";
  const level = params.get("level") || "";   // "기초" | "심화" 등 선택적으로 사용

  // 직무 선택 시 URL 쿼리 유지
  const handleSelectJob = (nextJob) => {
    const next = new URLSearchParams(params);
    if (nextJob) next.set("job", nextJob);
    else next.delete("job");
    setParams(next, { replace: false });
  };

  // 탭 전환
  const setTab = (nextTab) => {
    const next = new URLSearchParams(params);
    next.set("tab", nextTab);
    setParams(next, { replace: false });
  };

  // "선택완료" → 같은 페이지에서 tab=questions & job 갱신
  const handleStartQuestions = (selectedJob) => {
    const next = new URLSearchParams(params);
    next.set("tab", "questions");
    if (selectedJob) next.set("job", selectedJob);
    setParams(next, { replace: false });
  };

  return (
    <div className={styles.wrapper}>
      <PageHero
        badge="면접 학습 지원"
        title="직무 선택 후 영상 가이드와 예상 질문을 함께 준비하세요."
      />

      {/* 상단: 직무 선택 패널 (경량 버전) */}
      <section className={styles.categoryBar}>
        <CategoryPanelInline
          selected={job}
          onChange={handleSelectJob}
          onConfirm={handleStartQuestions}
        />
      </section>

      {/* 탭 네비게이션 */}
      <nav className={styles.tabs}>
        <button
          className={tab === "videos" ? styles.activeTab : styles.tab}
          onClick={() => setTab("videos")}
          aria-pressed={tab === "videos"}
        >
          영상
        </button>
        <button
          className={tab === "questions" ? styles.activeTab : styles.tab}
          onClick={() => setTab("questions")}
          aria-pressed={tab === "questions"}
        >
          질문
        </button>
      </nav>

      {/* 콘텐츠 */}
      <section className={styles.content}>
        <div className={styles.box}>
          {tab === "videos" ? <VideoGrid /> : <QuestionList job={job} level={level} />}
        </div>
      </section>
    </div>
  );
}

/* ====== 영상 탭 ====== */
function VideoGrid() {
  return (
    <div className={styles.videoGrid}>
      {VIDEOS.map(({ id, title, ratio }) => (
        <article className={styles.videoCard} key={id}>
          <div className={`${styles.videoMedia} ${ratioClass(ratio)}`}>
            <iframe
              src={toEmbed(id)}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className={styles.videoBody}>
            <h3 className={styles.videoTitle}>{title}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ====== 질문 탭 ====== */
function QuestionList({ job, level }) {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  const [fetchId, setFetchId] = useState(0); // 재시도 트리거

  const fetchQuestions = useCallback(async () => {
    if (!job) { setItems(null); setErr(""); return; }
    try {
      setErr("");
      setItems(null);
      const qs = new URLSearchParams({ job, ...(level ? { level } : {}) });
      const res = await fetch(`/api/questions?${qs.toString()}`);
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr("질문을 불러오는 데 실패했습니다. 네트워크 상태를 확인해주세요.");
    }
  }, [job, level]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions, fetchId]);

  const handleRetry = () => setFetchId((n) => n + 1);

  if (!job) return <EmptyState message="직무를 선택해주세요." />;
  if (err) return <ErrorState message={err} onRetry={handleRetry} />;
  if (items === null) return <LoadingState />;
  if (items.length === 0) return <EmptyState message="선택한 직무에 해당하는 질문이 아직 준비되지 않았습니다." />;

  return (
    <ul className={styles.questionList}>
      {items.map((q) => (
        <li key={q.id} className={styles.questionItem}>
          <div className={styles.qMeta}>
            <span className={styles.qBadge}>{q.level || "기초"}</span>
            <span className={styles.qCat}>{q.jobCategory}</span>
          </div>
          <button
            className={styles.qButton}
            onClick={() => alert(q.sampleAnswer ? q.sampleAnswer : "모범답변 준비 중입니다.")}
            aria-label={`질문 상세 보기: ${q.question}`}
          >
            {q.question}
          </button>
        </li>
      ))}
    </ul>
  );
}

/* 공통 상태 UI */
function EmptyState({ message }) { return <div className={styles.empty}>{message}</div>; }
function LoadingState() { return <div className={styles.loading}>불러오는 중…</div>; }
function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.error}>
      {message}
      <button onClick={onRetry} className={styles.retryBtn}>재시도</button>
    </div>
  );
}
