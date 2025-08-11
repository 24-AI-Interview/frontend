import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../components/Common/Button";
import PageHero from "../../components/Common/PageHero";
import styles from "./InterviewSessionPage.module.css";

export default function InterviewSessionPage() {
  const { state } = useLocation();

  const questions =
    Array.isArray(state?.questions) && state.questions.length > 0
      ? state.questions
      : [
          "우리 회사에 지원하게 된 동기는 무엇인가요?",
          "최근에 해결한 기술적 문제와 접근 방법을 설명해 주세요.",
          "협업 과정에서 갈등을 해결한 경험을 말해 주세요.",
        ];

  const job =
    state?.job ||
    "경영·인사·총무·사무/인사·인재개발·채용·교육·HR";

  const [index, setIndex] = useState(0);
  const currentQuestion = questions[index];

  const ANSWER_SECONDS = 60;
  const [secondsLeft, setSecondsLeft] = useState(ANSWER_SECONDS);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef(null);

  // 타이머: svg 320px, 반지름 150으로 살짝 축소
  const radius = 150;
  const circumference = 2 * Math.PI * radius;
  const progress = (ANSWER_SECONDS - secondsLeft) / ANSWER_SECONDS;
  const dashOffset = useMemo(
    () => circumference * (1 - progress),
    [circumference, progress]
  );

  // 웹캠
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("웹캠 접근 실패:", err);
      }
    })();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleComplete = () => {
    setIsRunning(false);
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSecondsLeft(ANSWER_SECONDS);
      setIsRunning(true);
    } else {
      alert("모든 질문이 완료되었습니다.");
      // navigate("/interview/result", { state: { job, questions } });
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, index]);

  return (
    <div className={styles.page}>
      {/* 흰색 둥근 카드 래퍼 */}
      <section className={styles.content}>
        <div className={styles.card}>
          {/* 상단 카테고리(회색 캡슐) */}
          <div className={styles.categoryWrapper}>
            <span className={styles.categoryLabel}>{job}</span>
          </div>

          {/* 배지(진행도만) + 타이틀(질문) — 이 페이지 한정으로 padding 20 16 20 */}
          <PageHero
            className={styles.heroOverride}
            badge={`${index + 1}/${questions.length}`}
            title={currentQuestion}
            maxWidth={960}
          />

          <div className={styles.container}>
            {/* Left: Camera */}
            <div className={styles.leftCol}>
              <div className={styles.videoWrap}>
                <video
                  ref={videoRef}
                  className={styles.video}
                  autoPlay
                  playsInline
                  muted
                />
              </div>
            </div>

            {/* Right: Timer & Controls */}
            <div className={styles.rightCol}>
              <div className={styles.timerWrap}>
                <svg width="320" height="320" aria-hidden>
                  <circle
                    cx="160"
                    cy="160"
                    r={radius}
                    stroke="#E6EAF2"
                    strokeWidth="18"
                    fill="none"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r={radius}
                    stroke="var(--navy, #1F2A44)"
                    strokeWidth="18"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 160 160)"
                  />
                </svg>
                <div className={styles.timerCenter} aria-live="polite">
                  <div className={styles.timerLabel}>남은 시간</div>
                  <div className={styles.timerNumber}>{secondsLeft}</div>
                  <div className={styles.timerUnit}>SECONDS</div>
                </div>
              </div>

              <div className={styles.buttons}>
                <Button
                  className={styles.primaryBtn}
                  onClick={() => setIsRunning((r) => !r)}
                >
                  {isRunning ? "일시정지" : "다시 시작"}
                </Button>
                <Button
                  className={styles.secondaryBtn}
                  onClick={handleComplete}
                >
                  완료
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
