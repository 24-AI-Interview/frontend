import React, { useCallback, useEffect, useMemo, useState } from "react";
import PrepStep from "../../features/interview/steps/PrepStep";
import PrecheckStep from "../../features/interview/steps/PrecheckStep";
import LiveInterviewStep from "../../features/interview/steps/LiveInterviewStep";
import styles from "./InterviewFlowPage.module.css";
import { getQuestionsForJob } from "../../data/interviewQuestionsByJob";

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
  const [view, setView] = useState("mock");
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [job, setJob] = useState("");
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [tab, setTab] = useState("videos");
  const [precheckDone, setPrecheckDone] = useState(false);
  const resolveQuestions = useCallback(
    (nextJob) => {
      if (!nextJob) return DEFAULT_QUESTIONS;
      const fromCsv = getQuestionsForJob(nextJob);
      return fromCsv.length > 0 ? fromCsv : DEFAULT_QUESTIONS;
    },
    []
  );

  const canProceedFromPrep = Boolean(job && job.includes("/"));
  const activeStep = STEPS[stepIndex];

  useEffect(() => {
    setQuestions(resolveQuestions(job));
  }, [job, resolveQuestions]);

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
    if (view === "mock" && tab !== "questions") setTab("questions");
    if (view === "mock") goTo(1);
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
        <div className={styles.viewTabs}>
          <button
            type="button"
            className={view === "library" ? styles.viewTabActive : styles.viewTab}
            onClick={() => setView("library")}
            aria-pressed={view === "library"}
          >
            자료실
          </button>
          <button
            type="button"
            className={view === "mock" ? styles.viewTabActive : styles.viewTab}
            onClick={() => setView("mock")}
            aria-pressed={view === "mock"}
          >
            AI 모의면접
          </button>
        </div>
        {view === "mock" && (
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
          </div>
        )}
      </div>

      <div className={styles.stage}>
        {view === "library" ? (
          <div key="library" className={`${styles.stepPane} ${styles.slideInRight}`}>
            <PrepStep
              job={job}
              tab={tab}
              layout="library"
              onTabChange={setTab}
              onJobChange={handleJobChange}
              onJobConfirm={handleJobConfirm}
              onQuestionsLoaded={handleQuestionsLoaded}
            />
          </div>
        ) : (
          <div
            key={activeStep.id}
            className={`${styles.stepPane} ${
              direction === "forward" ? styles.slideInRight : styles.slideInLeft
            }`}
          >
            {activeStep.id === "prep" && (
              <PrepStep
                job={job}
                tab={tab}
                showTabs={false}
                useBox={false}
                hideNoQuestionsMessage={true}
                hideNoVideosMessage={true}
                hideStatusMessages={true}
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
        )}
      </div>
    </div>
  );
}
