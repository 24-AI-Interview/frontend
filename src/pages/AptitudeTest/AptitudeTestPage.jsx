import React, { useMemo, useState } from "react";
import PageHero from "../../components/Common/PageHero";
import Button from "../../components/Common/Button";
import styles from "./AptitudeTestPage.module.css";

/** 스텝 정의 */
const STEP = { SELECT: 1, PREP: 2, TEST: 3, RESULT: 4 };
/** 검사 유형 */
const TYPES = { BIG5: "big5", JOB: "job" };

const GUIDE_TEXT = {
  [TYPES.BIG5]: `Big 5 성격 검사는 개인의 성격을 다섯 가지 핵심 요인 (개방성, 성실성, 외향성, 우호성, 신경성)으로 측정하여 성격 프로파일을 파악하는 검사입니다.

📌 검사 전 유의사항
- 검사 시간은 약 10~15분 정도 소요됩니다.
- 정답은 없으며, 평소 자신의 생각과 행동에 가장 가까운 답변을 선택하세요.
- 일관성 있게, 솔직하게 응답하는 것이 가장 중요합니다.
- 집중할 수 있는 조용한 환경에서 검사에 참여해주세요.
- 인터넷 연결이 안정적인 환경에서 진행해주세요.

검사 결과는 개인의 성향을 이해하고 직무 적합성을 평가하는 데 참고 자료로 활용됩니다.`,

  [TYPES.JOB]: `직무 성향 검사는 특정 직무를 수행할 때 요구되는 행동·사고 성향을 평가합니다.
(문제 해결/분석력, 대인관계·협업 성향, 책임감·규율성, 성과지향, 변화 수용 등)

📌 검사 전 유의사항
- 검사 시간은 약 10~15분 정도 소요됩니다.
- 정답은 없으며, 평소 자신의 생각과 행동에 가장 가까운 답변을 선택하세요.
- 일관성 있게, 솔직하게 응답하는 것이 가장 중요합니다.
- 집중할 수 있는 조용한 환경에서 검사에 참여해주세요.
- 인터넷 연결이 안정적인 환경에서 진행해주세요.

검사 결과는 지원 직무와의 적합도를 파악하고 강·약점을 이해하는 데 참고 자료로 활용됩니다.`,
};

export default function AptitudeTestPage() {
  const [step, setStep] = useState(STEP.SELECT);
  const [type, setType] = useState(null); // "big5" | "job"

  /** 상단 리본 타이틀 */
  const ribbonTitle = useMemo(() => {
    if (!type) return "";
    return type === TYPES.BIG5 ? "Big 5 검사 (성격 5요인 검사)" : "직무 성향 검사";
  }, [type]);

  const canNext = useMemo(() => {
    if (step === STEP.SELECT) return !!type;
    // TODO: 이후 단계 유효성 검증 필요 시 조건 추가
    return true;
  }, [step, type]);

  const goNext = () => {
    if (!canNext) return;
    setStep((s) => Math.min(STEP.RESULT, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => Math.max(STEP.SELECT, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      {/* 히어로 (이 페이지에서만 padding 오버라이드 가능) */}
      <PageHero
        className={styles.heroOverride}
        badge="인적성 검사"
        title="개인의 성격과 직무 적합성을 종합적으로 평가합니다."
        maxWidth={1200}
      />

      {/* 스텝 네비게이션 */}
      <ol className={styles.stepper}>
        <li className={step >= STEP.SELECT ? styles.stepActive : ""}>step1. 검사 유형 선택</li>
        <li className={step >= STEP.PREP ? styles.stepActive : ""}>step2. 검사 준비/안내</li>
        <li className={step >= STEP.TEST ? styles.stepActive : ""}>step3. 검사 진행</li>
        <li className={step >= STEP.RESULT ? styles.stepActive : ""}>step4. 검사 종료/결과 확인</li>
      </ol>

      {/* step1: 검사 유형 선택 */}
      {step === STEP.SELECT && (
        <section className={styles.section}>
          <div className={styles.cardGrid}>
            <button
              type="button"
              className={`${styles.card} ${type === TYPES.BIG5 ? styles.cardActive : ""}`}
              onClick={() => setType(TYPES.BIG5)}
            >
              <h3 className={styles.cardTitle}>Big 5 검사 (성격 5요인 검사)</h3>
              <p className={styles.cardBody}>
                개인의 성격 특성을 다섯 가지 핵심 요인으로 평가합니다.<br />
                측정 영역은 개방성, 성실성, 외향성, 우호성, 신경성입니다. 개인의 전반적인 성격<br />
                프로파일을 확인해 팀워크 적합도, 리더십 잠재력, 직무 적응력 등을 간접적으로<br />
                예측할 수 있습니다.
              </p>
            </button>

            <button
              type="button"
              className={`${styles.card} ${type === TYPES.JOB ? styles.cardActive : ""}`}
              onClick={() => setType(TYPES.JOB)}
            >
              <h3 className={styles.cardTitle}>직무 성향 검사 (직무 적합도)</h3>
              <p className={styles.cardBody}>
                특정 직무에 얼마나 잘 맞는 성향을 갖추고 있는지 평가합니다.<br />
                측정 영역은 문제 해결 및 분석력, 대인 관계/협력 성향, 책임감/규율성,<br />
                성과 지향성, 변화 수용력입니다. 지원자가 가진 성격과 행동 성향이 측정 직부의<br />
                요구사항과 잘 맞는지를 확인할 수 있습니다.
              </p>
            </button>
          </div>
        </section>
      )}

      {/* 리본 (step2~) */}
      {step >= STEP.PREP && (
        <div className={styles.section}>
            <div className={styles.ribbon}>{ribbonTitle}</div>
        </div>
        )}


      {/* step2: 안내 */}
      {step === STEP.PREP && (
        <section className={styles.section}>
            <div className={styles.field}>
                <span>검사 안내</span>
                <div className={styles.textarea} style={{whiteSpace: "pre-line"}}>
                    {GUIDE_TEXT[type]}
                </div>
            </div>
        </section>
      )}

      {/* step3: 검사 진행 (플레이스홀더) */}
      {step === STEP.TEST && (
        <section className={styles.section}>
          <div className={styles.testBox}>
            <p className={styles.placeholder}>
              이곳에 문항 컴포넌트/타이머/진행 바 등을 연결하세요. (후속 작업)
            </p>
          </div>
        </section>
      )}

      {/* step4: 임시 결과 */}
      {step === STEP.RESULT && (
        <section className={styles.section}>
          <div className={styles.resultBox}>
            <h3>임시 결과 화면</h3>
            <p>채점/그래프/리포트 다운로드는 이후 단계에서 연결합니다.</p>
          </div>
        </section>
      )}

      {/* 하단 버튼 */}
      <div className={styles.footer}>
        <Button className={styles.secondaryBtn} onClick={goBack} disabled={step === STEP.SELECT}>
          Back
        </Button>
        <Button className={styles.primaryBtn} onClick={goNext} disabled={!canNext}>
          Next step
        </Button>
      </div>
    </div>
  );
}
