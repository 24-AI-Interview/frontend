import React, { useCallback, useEffect, useMemo, useState } from "react";
import PrepStep from "../../features/interview/steps/PrepStep";
import PrecheckStep from "../../features/interview/steps/PrecheckStep";
import LiveInterviewStep from "../../features/interview/steps/LiveInterviewStep";
import { fetchInterviewQuestions } from "../../api/interview";
import styles from "./InterviewFlowPage.module.css";

const STEPS = [
  { id: "prep", label: "면접 준비" },
  { id: "precheck", label: "환경 체크" },
  { id: "live", label: "실전 면접" },
];

const DEFAULT_QUESTIONS = [
  "우리 회사에 지원하게 된 동기는 무엇인가요?",
  "최근 해결한 문제와 접근 방법은?",
  "협업 과정에서 갈등 해결 경험은?",
];

export default function InterviewFlowPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [job, setJob] = useState("");
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [tab, setTab] = useState("videos");
  const [precheckDone, setPrecheckDone] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState("");

  const canProceedFromPrep = Boolean(job && job.includes("/"));
  const activeStep = STEPS[stepIndex];

  useEffect(() => {
    if (!job) {
      setQuestions(DEFAULT_QUESTIONS);
      return;
    }
    setQuestions(DEFAULT_QUESTIONS);
  }, [job]);

  useEffect(() => {
    if (activeStep.id !== "live") return;
    let ignore = false;
    (async () => {
      try {
        setLiveError("");
        setLiveLoading(true);
        const data = await fetchInterviewQuestions({ job });
        if (ignore) return;
        const list = Array.isArray(data)
          ? data.map((item) => item.question).filter(Boolean)
          : [];
        if (list.length) setQuestions(list);
      } catch (e) {
        if (!ignore) setLiveError("실전 면접 질문을 불러오지 못했습니다. 기본 질문으로 진행합니다.");
      } finally {
        if (!ignore) setLiveLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [activeStep.id, job]);

  const goTo = useCallback(
    (nextIndex) => {
      setDirection(nextIndex > stepIndex ? "forward" : "back");
      setStepIndex(nextIndex);
    },
    [stepIndex]
  );

  const handleQuestionsLoaded = useCallback((items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    const list = items.map((q) => q.question).filter(Boolean);
    if (list.length > 0) setQuestions(list);
  }, []);

  const handleJobChange = (nextJob) => {
    setJob(nextJob);
    setPrecheckDone(false);
  };

  const handleJobConfirm = (nextJob) => {
    setJob(nextJob);
    setPrecheckDone(false);
    if (tab !== "questions") setTab("questions");
  };

  const handleNextFromPrep = () => {
    if (!canProceedFromPrep) return;
    goTo(1);
  };

  const handleNextFromPrecheck = () => {
    setPrecheckDone(true);
    goTo(2);
  };

  const handleRestart = () => {
    setPrecheckDone(false);
    goTo(0);
  };

  const canJumpTo = useMemo(() => {
    return (idx) => {
      if (idx === 0) return true;
      if (idx === 1) return canProceedFromPrep;
      if (idx === 2) return canProceedFromPrep && precheckDone;
      return false;
    };
  }, [canProceedFromPrep, precheckDone]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.stepper}>
          <div className={styles.stepList}>
            {STEPS.map((step, idx) => {
              const isActive = activeStep.id === step.id;
              const isDone = idx < stepIndex;
              const isClickable = canJumpTo(idx);
              return (
                <button
                  key={step.id}
                  type="button"
                  className={`${styles.stepItem} ${isDone ? styles.stepDone : ""}`}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => isClickable && goTo(idx)}
                  disabled={!isClickable}
                >
                  <span className={styles.stepIndex}>{idx + 1}</span>
                  {step.label}
                </button>
              );
            })}
          </div>
          <div className={styles.stepControls}>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => goTo(Math.max(0, stepIndex - 1))}
              disabled={stepIndex === 0}
            >
              이전
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => goTo(Math.min(STEPS.length - 1, stepIndex + 1))}
              disabled={
                (stepIndex === 0 && !canProceedFromPrep) ||
                (stepIndex === 1 && !precheckDone) ||
                stepIndex === STEPS.length - 1
              }
            >
              다음
            </button>
          </div>
        </div>
      </div>

      <div className={styles.stage}>
        <div
          key={activeStep.id}
          className={`${styles.stepPane} ${
            direction === "forward" ? styles.slideInRight : styles.slideInLeft
          }`}
        >
          {activeStep.id === "live" && (liveLoading || liveError) && (
            <div className={`${styles.statusBar} ${liveError ? styles.statusError : ""}`}>
              {liveLoading ? "실전 면접 질문을 불러오는 중..." : liveError}
            </div>
          )}
          {activeStep.id === "prep" && (
            <PrepStep
              job={job}
              tab={tab}
              onTabChange={setTab}
              onJobChange={handleJobChange}
              onJobConfirm={handleJobConfirm}
              onQuestionsLoaded={handleQuestionsLoaded}
              onNext={handleNextFromPrep}
            />
          )}
          {activeStep.id === "precheck" && <PrecheckStep onNext={handleNextFromPrecheck} />}
          {activeStep.id === "live" && (
            <LiveInterviewStep job={job} questions={questions} onDone={handleRestart} />
          )}
        </div>
      </div>
    </div>
  );
}
