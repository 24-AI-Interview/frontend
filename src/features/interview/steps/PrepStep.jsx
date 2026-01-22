import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageHero from "../../../components/Common/PageHero";
import QuestionPanel from "../components/QuestionPanel";
import {
  addPrepBookmark,
  deletePrepBookmark,
  fetchPrepBookmarks,
  fetchPrepQuestions,
  fetchPrepVideos,
} from "../../../api/prep";
import styles from "../../../pages/InterviewPrep/InterviewPrepPage.module.css";

const toEmbed = (id) => `https://www.youtube.com/embed/${id}`;
const ratioClass = (ratio) => (ratio === "9/16" ? styles.ratio9x16 : styles.ratio16x9);

export default function PrepStep({
  job,
  tab,
  level = "",
  layout = "flow",
  showTabs = true,
  useBox = true,
  hideNoQuestionsMessage = false,
  hideNoVideosMessage = false,
  onTabChange,
  onJobChange,
  onJobConfirm,
  onQuestionsLoaded,
  onNext,
}) {
  const isLibrary = layout === "library";
  const enableBookmarks = !isLibrary;
  const shouldShowTabs = showTabs && !isLibrary;
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [bookmarksError, setBookmarksError] = useState("");

  const bookmarkMap = useMemo(
    () => new Map(bookmarks.map((b) => [b.videoId, b])),
    [bookmarks]
  );

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setVideosLoading(true);
        const data = await fetchPrepVideos();
        if (!ignore) setVideos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setVideosError("영상을 불러오지 못했습니다.");
      } finally {
        if (!ignore) setVideosLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const refreshBookmarks = useCallback(async () => {
    if (!enableBookmarks) return;
    try {
      setBookmarksLoading(true);
      const data = await fetchPrepBookmarks();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (e) {
      setBookmarksError("북마크를 불러오지 못했습니다.");
    } finally {
      setBookmarksLoading(false);
    }
  }, [enableBookmarks]);

  useEffect(() => {
    if (enableBookmarks) refreshBookmarks();
  }, [enableBookmarks, refreshBookmarks]);

  const toggleBookmark = async (videoId) => {
    if (!enableBookmarks) return;
    const existing = bookmarkMap.get(videoId);
    try {
      if (existing?.id) {
        await deletePrepBookmark(existing.id);
      } else {
        await addPrepBookmark({ videoId });
      }
      refreshBookmarks();
    } catch (e) {
      setBookmarksError("북마크 변경에 실패했습니다.");
    }
  };

  const handleStart = () => {
    if (!job || !job.includes("/")) return;
    onNext?.();
  };

  return (
    <div className={styles.wrapper}>
      <PageHero
        badge="면접 학습 지원"
        title="직무 선택 후 영상 가이드와 예상 질문을 함께 준비하세요."
      />

      <section className={styles.categoryBar}>
        <QuestionPanel
          selected={job}
          onChange={onJobChange}
          onConfirm={onJobConfirm}
        />
      </section>

      {shouldShowTabs && (
        <nav className={styles.tabs}>
          <button
            className={tab === "videos" ? styles.activeTab : styles.tab}
            onClick={() => onTabChange?.("videos")}
            aria-pressed={tab === "videos"}
          >
            영상
          </button>
          <button
            className={tab === "questions" ? styles.activeTab : styles.tab}
            onClick={() => onTabChange?.("questions")}
            aria-pressed={tab === "questions"}
          >
            질문
          </button>
          {enableBookmarks && (
            <button
              className={tab === "bookmarks" ? styles.activeTab : styles.tab}
              onClick={() => onTabChange?.("bookmarks")}
              aria-pressed={tab === "bookmarks"}
            >
              북마크
            </button>
          )}
        </nav>
      )}

      {!isLibrary && (
        <div className={styles.stepActions}>
          <div className={styles.stepActionsInner}>
            <div className={styles.stepCallout}>
              <span className={styles.stepLabel}>다음 단계</span>
              {!job || !job.includes("/") ? (
                <div className={styles.stepHint}>직무를 선택하면 다음 단계로 이동할 수 있어요.</div>
              ) : (
                <div className={styles.stepHint}>환경 체크로 이동해 실전 준비를 시작하세요.</div>
              )}
            </div>
            <button
              type="button"
              className={`${styles.stepButton} ${styles.stepButtonPrimary}`}
              onClick={handleStart}
              disabled={!job || !job.includes("/")}
            >
              환경 체크 시작
            </button>
          </div>
        </div>
      )}

      <section className={styles.content}>
        {useBox ? (
          <div className={styles.box}>
            {isLibrary ? (
              <div className={styles.libraryStack}>
                <section className={styles.librarySection}>
                  <h3 className={styles.sectionTitle}>영상</h3>
                  <VideoGrid
                    videos={videos}
                    loading={videosLoading}
                    error={videosError}
                    showBookmarks={false}
                    hideNoVideosMessage={hideNoVideosMessage}
                  />
                </section>
                <section className={styles.librarySection}>
                  <h3 className={styles.sectionTitle}>질문</h3>
                <QuestionList
                  job={job}
                  level={level}
                  onLoaded={onQuestionsLoaded}
                  hideNoQuestionsMessage={hideNoQuestionsMessage}
                />
              </section>
            </div>
          ) : (
            <>
                {tab === "videos" && (
                  <VideoGrid
                    videos={videos}
                    loading={videosLoading}
                    error={videosError}
                    onToggleBookmark={toggleBookmark}
                    bookmarkMap={bookmarkMap}
                    showBookmarks={enableBookmarks}
                    hideNoVideosMessage={hideNoVideosMessage}
                  />
                )}
                {tab === "questions" && (
                <QuestionList
                  job={job}
                  level={level}
                  onLoaded={onQuestionsLoaded}
                  hideNoQuestionsMessage={hideNoQuestionsMessage}
                />
              )}
              {tab === "bookmarks" && (
                <BookmarkList
                    bookmarks={bookmarks}
                    loading={bookmarksLoading}
                    error={bookmarksError}
                    onToggleBookmark={toggleBookmark}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {isLibrary ? (
              <div className={styles.libraryStack}>
                <section className={styles.librarySection}>
                  <h3 className={styles.sectionTitle}>영상</h3>
                  <VideoGrid
                    videos={videos}
                    loading={videosLoading}
                    error={videosError}
                    showBookmarks={false}
                    hideNoVideosMessage={hideNoVideosMessage}
                  />
                </section>
                <section className={styles.librarySection}>
                  <h3 className={styles.sectionTitle}>질문</h3>
                <QuestionList
                  job={job}
                  level={level}
                  onLoaded={onQuestionsLoaded}
                  hideNoQuestionsMessage={hideNoQuestionsMessage}
                />
              </section>
            </div>
          ) : (
            <>
                {tab === "videos" && (
                  <VideoGrid
                    videos={videos}
                    loading={videosLoading}
                    error={videosError}
                    onToggleBookmark={toggleBookmark}
                    bookmarkMap={bookmarkMap}
                    showBookmarks={enableBookmarks}
                    hideNoVideosMessage={hideNoVideosMessage}
                  />
                )}
                {tab === "questions" && (
                <QuestionList
                  job={job}
                  level={level}
                  onLoaded={onQuestionsLoaded}
                  hideNoQuestionsMessage={hideNoQuestionsMessage}
                />
              )}
              {tab === "bookmarks" && (
                <BookmarkList
                    bookmarks={bookmarks}
                    loading={bookmarksLoading}
                    error={bookmarksError}
                    onToggleBookmark={toggleBookmark}
                  />
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function VideoGrid({
  videos,
  loading,
  error,
  onToggleBookmark,
  bookmarkMap,
  showBookmarks = true,
  hideNoVideosMessage = false,
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!videos.length && hideNoVideosMessage) return null;
  if (!videos.length) return <EmptyState message="표시할 영상이 없습니다." />;

  return (
    <div className={styles.videoGrid}>
      {videos.map(({ id, title, ratio }) => {
        const isBookmarked = bookmarkMap?.has(id);
        return (
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
              {showBookmarks && (
                <button
                  type="button"
                  className={styles.bookmarkBtn}
                  onClick={() => onToggleBookmark?.(id)}
                >
                  {isBookmarked ? "북마크 해제" : "북마크"}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function BookmarkList({ bookmarks, loading, error, onToggleBookmark }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!bookmarks.length) return <EmptyState message="북마크한 영상이 없습니다." />;
  const items = bookmarks.map((b) => b.video).filter(Boolean);
  return (
    <div className={styles.videoGrid}>
      {items.map(({ id, title, ratio }) => (
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
            <button
              type="button"
              className={styles.bookmarkBtn}
              onClick={() => onToggleBookmark?.(id)}
            >
              북마크 해제
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function QuestionList({ job, level, onLoaded, hideNoQuestionsMessage = false }) {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  const [fetchId, setFetchId] = useState(0);

  const fetchQuestions = useCallback(async () => {
    if (!job) {
      setItems(null);
      setErr("");
      return;
    }
    try {
      setErr("");
      setItems(null);
      const data = await fetchPrepQuestions({ job, level });
      const nextItems = Array.isArray(data) ? data : [];
      setItems(nextItems);
      onLoaded?.(nextItems);
    } catch (e) {
      setErr("질문을 불러오는 데 실패했습니다. 네트워크 상태를 확인해주세요.");
    }
  }, [job, level, onLoaded]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions, fetchId]);

  const handleRetry = () => setFetchId((n) => n + 1);

  if (!job) return <EmptyState message="직무를 선택해주세요." />;
  if (err) return <ErrorState message={err} onRetry={handleRetry} />;
  if (items === null) return <LoadingState />;
  if (items.length === 0 && hideNoQuestionsMessage) return null;
  if (items.length === 0)
    return <EmptyState message="선택한 직무에 해당하는 질문이 아직 준비되지 않았습니다." />;

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

function EmptyState({ message }) {
  return <div className={styles.empty}>{message}</div>;
}
function LoadingState() {
  return <div className={styles.loading}>불러오는 중…</div>;
}
function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.error}>
      {message}
      <button onClick={onRetry} className={styles.retryBtn}>
        재시도
      </button>
    </div>
  );
}
