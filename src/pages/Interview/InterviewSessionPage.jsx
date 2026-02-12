// File: src/pages/Interview/InterviewSessionPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation /*, useNavigate */ } from "react-router-dom";
import Button from "../../components/Common/Button";
import PageHero from "../../components/Common/PageHero";
import styles from "./InterviewSessionPage.module.css";
import { getQuestionsForJob } from "../../data/interviewQuestionsByJob";

export default function InterviewSessionPage() {
  const { state } = useLocation();
  // const navigate = useNavigate();

  const defaultQuestions = useMemo(
    () => [
      "우리 회사에 지원하게 된 동기는 무엇인가요?",
      "최근에 해결한 기술적 문제와 접근 방법을 설명해 주세요.",
      "협업 과정에서 갈등을 해결한 경험을 말해 주세요.",
    ],
    []
  );

  const job =
    state?.job || "경영·인사·총무·사무/인사·인재개발·채용·교육·HR";

  const questions = useMemo(() => {
    if (Array.isArray(state?.questions) && state.questions.length > 0) {
      return state.questions;
    }
    const fromCsv = getQuestionsForJob(job);
    return fromCsv.length > 0 ? fromCsv : defaultQuestions;
  }, [defaultQuestions, job, state?.questions]);

  // ===== 인트로(5초 안내) → 질문 단계 전환 =====
  const [phase, setPhase] = useState("intro"); // 'intro' | 'question'
  const INTRO_SECONDS = 5;
  const [introLeft, setIntroLeft] = useState(INTRO_SECONDS);

  // 진행 중 질문 인덱스
  const [index, setIndex] = useState(0);
  const currentQuestion = questions[index];

  // 타이머
  const ANSWER_SECONDS = 60;
  const [secondsLeft, setSecondsLeft] = useState(ANSWER_SECONDS);
  const [isRunning, setIsRunning] = useState(false); // 인트로 동안은 false
  const timerRef = useRef(null);

  // 원형 진행바 계산
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

  // ===== 카메라/얼굴 상태 =====
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState(false);
  const [faceReady, setFaceReady] = useState(false);
  const introStartedRef = useRef(false); // 카운트다운 중복 시작 방지

  // ===== 베이스라인(시선 라벨) 수집 =====
  const baselineRef = useRef(null);
  const gazeSamplesRef = useRef([]);
  const sampleTimerRef = useRef(null);
  const introTimerRef = useRef(null);

  // (예시) 시선 라벨 추정 함수 — 실제 모델 함수로 교체
  const getGazeLabel = () => {
    // return window.__gaze?.getLabel(videoRef.current) ?? null;
    return "center";
  };

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCamReady(true);
        startIntro();
      } catch (err) {
        console.error("웹캠 접근 실패:", err);
        setCamError(true);
        setCamReady(false);
        startIntro(); // 권한 전까지는 인식 대기 상태 유지
      }
    })();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(sampleTimerRef.current);
      clearTimeout(introTimerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== 인트로: 라벨 샘플링 + (조건 충족 시) 카운트다운 시작 =====
  const startIntro = () => {
    setPhase("intro");
    setIsRunning(false);
    setIntroLeft(INTRO_SECONDS);
    setFaceReady(false);
    introStartedRef.current = false;
    gazeSamplesRef.current = [];

    // 10Hz로 라벨 수집 + 얼굴 인식 판단
    clearInterval(sampleTimerRef.current);
    let consecutive = 0; // 연속 인식 카운트
    sampleTimerRef.current = setInterval(() => {
      const label = getGazeLabel();
      if (label) {
        gazeSamplesRef.current.push(label);
        consecutive += 1;
      } else {
        consecutive = 0;
      }
      // 약 0.8초 이상 연속 인식되면 faceReady로 판단
      if (!faceReady && consecutive >= 8) {
        setFaceReady(true);
      }
    }, 100);
  };

  // 얼굴/카메라가 준비되면 카운트다운 시작
  useEffect(() => {
    if (phase !== "intro") return;
    if (!camReady || !faceReady) return;
    if (introStartedRef.current) return;

    introStartedRef.current = true;

    const runTimer = (time) => {
      if (time <= 0) {
        finishIntro();
        return;
      }
      setIntroLeft(time);
      introTimerRef.current = setTimeout(() => runTimer(time - 1), 1000);
    };
    runTimer(INTRO_SECONDS);
  }, [camReady, faceReady, phase]);

  const finishIntro = () => {
    clearInterval(sampleTimerRef.current);
    const counts = gazeSamplesRef.current.reduce((acc, l) => {
      acc[l] = (acc[l] || 0) + 1;
      return acc;
    }, {});
    const baseline =
      Object.keys(counts).length > 0
        ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
        : "center";
    baselineRef.current = baseline;

    setPhase("question");
    setIsRunning(true);
  };

  // ===== 질문 완료/진행 =====
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

  // 타이머 동작
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

  // 인트로 상태 텍스트/배지
  const status = camError
    ? { kind: "error", text: "카메라 권한이 필요합니다. 브라우저 팝업을 허용하세요." }
    : !camReady
    ? { kind: "warn", text: "카메라 연결 중…" }
    : faceReady
    ? { kind: "ok", text: "카메라 인식 완료! 자세를 유지해주세요." }
    : { kind: "warn", text: "얼굴을 프레임 중앙에 맞춰주세요." };

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <div className={styles.card}>
          {/* 카테고리 캡슐 */}
          <div className={styles.categoryWrapper}>
            <span className={styles.categoryLabel}>{job}</span>
          </div>

          {/* 인트로: 안내 / 질문 단계: 실제 질문 */}
          <PageHero
            className={styles.heroOverride}
            badge={
              phase === "question" ? `${index + 1}/${questions.length}` : "준비"
            }
            title={
              phase === "question"
                ? currentQuestion
                : "카메라를 5초간 응시해주세요"
            }
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

                {/* 인트로 오버레이 (얼굴 마스크 + 가이드라인 + 상태 + 카운트다운) */}
                {phase === "intro" && (
                  <div className={styles.overlay} role="dialog" aria-modal="true">
                    {/* SVG defs: 얼굴 마스크 정의 */}
                    <svg className={styles.hiddenSvg} width="0" height="0" aria-hidden>
                      <defs>
                        <mask id="faceMask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                          <rect x="0" y="0" width="100%" height="100%" fill="black" />
                          {/* 가로를 약간 키웠습니다(rx 30%) */}
                          <ellipse cx="50%" cy="42%" rx="30%" ry="36%" fill="white" />
                          <path
                            d="
                              M 20% 56%
                              C 34% 78%, 66% 78%, 80% 56%
                              C 74% 84%, 26% 84%, 20% 56%
                            "
                            fill="white"
                            opacity="0.85"
                          />
                        </mask>
                      </defs>
                    </svg>

                    {/* 블러 + 딤(마스크로 얼굴 부분만 투명) */}
                    <div className={styles.overlayFace} aria-hidden />

                    {/* 얼굴 가이드라인(SVG) */}
                    <svg className={styles.faceGuides} viewBox="0 0 1000 1400" aria-hidden>
                      {/* 외곽 윤곽선(가이드) */}
                      <path
                        d="M280,520 C280,350 410,240 500,240 C590,240 720,350 720,520 C720,780 630,990 500,1060 C370,990 280,780 280,520 Z"
                        className={styles.faceLine}
                      />

                      {/* 눈 가이드 (좌/우) */}
                      <ellipse cx="400" cy="560" rx="80" ry="28" className={styles.eyeLine}/>
                      <ellipse cx="600" cy="560" rx="80" ry="28" className={styles.eyeLine}/>
                      {/* 눈썹 가이드 */}
                      <path d="M330,520 Q410,495 490,520" className={styles.browLine}/>
                      <path d="M510,520 Q590,495 670,520" className={styles.browLine}/>

                      {/* 코 가이드 */}
                      <path d="M500,560 L500,700" className={styles.noseLine}/>
                      <path d="M455,720 Q500,740 545,720" className={styles.noseBase}/>

                      {/* 입 가이드 */}
                      <path d="M410,800 Q500,830 590,800" className={styles.mouthLine}/>
                      <path d="M420,800 Q500,820 580,800" className={styles.mouthInner}/>

                      {/* 가운데 정렬 보조선(얇게) */}
                      <line x1="500" y1="280" x2="500" y2="1040" className={styles.centerLine}/>
                    </svg>

                    {/* 상태 배지 + 안내 + 카운트다운 */}
                    <div className={styles.overlayBox}>
                      <div className={`${styles.statusPill} ${styles[status.kind]}`}>
                        <span className={styles.dot} />
                        {status.text}
                      </div>

                      <div className={styles.overlayTitle}>시선 기준점 설정</div>
                      <p className={styles.overlayDesc}>
                        카메라가 인식되면 5초 카운트다운이 시작됩니다.
                        <br />
                        얼굴이 윤곽선 안에 들어오도록 맞추고 렌즈를 바라봐 주세요.
                      </p>

                      {/* 카운트다운: 준비되기 전에는 흐리게 */}
                      <div
                        className={`${styles.countdownTop} ${
                          camReady && faceReady ? "" : styles.countdownDim
                        }`}
                        aria-live="polite"
                      >
                        {introLeft}
                      </div>

                      {/* 권한 오류 시 보조 안내 */}
                      {camError && (
                        <div className={styles.permissionHelp}>
                          브라우저 주소창의 카메라 아이콘을 눌러 접근을 허용해 주세요.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Timer & Controls */}
            <div className={styles.rightCol}>
              <div className={styles.timerWrap} aria-hidden={phase !== "question"}>
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
                  disabled={phase !== "question"}
                >
                  {isRunning ? "일시정지" : "다시 시작"}
                </Button>
                <Button
                  className={styles.secondaryBtn}
                  onClick={handleComplete}
                  disabled={phase !== "question"}
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
