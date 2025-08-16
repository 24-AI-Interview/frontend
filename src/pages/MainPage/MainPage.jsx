import React from "react";
import styles from "./MainPage.module.css";

/* ===== Hero ===== */
const Hero = () => (
  <section className={styles.hero}>
    {/* 은은한 버블/그리드 */}
    <div className={styles.heroDecor} aria-hidden>
      <span className={`${styles.blob} ${styles.blob1}`} />
      <span className={`${styles.blob} ${styles.blob2}`} />
      <span className={`${styles.blob} ${styles.blob3}`} />
      <span className={styles.gridOverlay} />
    </div>

    <div className={styles.heroInner}>
      {/* 왼쪽 정렬 컨테이너 */}
      <div className={styles.heroCopy}>
        <h1 className={styles.heroTitle}>
          실전보다 더 실전 같은 면접 준비! <br />
          인공지능과 함께하는 실전 면접 트레이닝
        </h1>
        <div className={styles.heroChips}>
          <span className={styles.chip}>무료로 시작 · 설치 없이 바로</span>
          <span className={styles.chip}>시선·음성·표정 실시간 피드백</span>
        </div>
      </div>

      {/* 이미지 대신 CSS 오브 */}
      <div className={styles.heroArt} aria-hidden>
        <span className={`${styles.orb} ${styles.orb1}`} />
        <span className={`${styles.orb} ${styles.orb2}`} />
        <span className={`${styles.orb} ${styles.orb3}`} />
      </div>
    </div>
  </section>
);

/* ===== Pain Cards ===== */
const PainCards = () => (
  <section className={styles.pain}>
    <div className={styles.sectionHead}>
      <h2>
        실제로 많은 사람들이 <span className={styles.accent}>(서비스)</span>로{" "}
        <span className={styles.accent}>연습</span>하고 있어요.
      </h2>
      <p>면접 준비에서 자기 경험을 효과적으로 표현하는 방법을 몰라 어려움을 겪고 있어요.</p>
    </div>

    <div className={styles.cardGrid3}>
      <article className={`${styles.card} ${styles.cardBlueLight}`}>
        <div className={styles.cardAvatar}>
          <img src="/assets/boom.png" alt="" />
        </div>
        <h3>제가 했던 프로젝트가 자세히<br></br>기억이 안 나요.</h3>
        <p>
          이전에 참여했던 활동의 구체적인 내용이<br></br>잘 기억나지 않아 면접 질문에 당황할까봐<br></br>걱정이에요.
        </p>
      </article>

      <article className={`${styles.card} ${styles.cardGrey}`}>
        <div className={styles.cardAvatar}>
          <img src="/assets/question.png" alt="" />
        </div>
        <h3>면접에서 무엇을 물어볼지<br></br>감이 잘 안와요.</h3>
        <p>어떤 경험과 활동을 중요하게 볼지 알기 어렵고, 준비해야 할 질문이 많아 보여 막막해요.</p>
      </article>

      <article className={`${styles.card} ${styles.cardBlue}`}>
        <div className={styles.cardAvatar}>
          <img src="/assets/sad.png" alt="" />
        </div>
        <h3>면접관 앞에만 서면<br></br>긴장해서 말을 잘 못해요.</h3>
        <p>실전과 비슷한 환경에서<br></br>반복 연습할 기회가 필요해요.</p>
      </article>
    </div>
  </section>
);

/* ===== Self Intro (개선 버전) ===== */
const SelfIntro = () => (
  <section className={styles.selfintro}>
    <div className={styles.selfIntroInner}>
      <div className={styles.selfIntroCopy}>
        <h2>자기소개서</h2>
        <p>
          취업의 첫 단계는 바로 자기소개서를 쓰는 것이죠.<br></br>문법 교정부터 예상 질문 생성까지,
          <br></br>글쓰기의 전과정을 스마트하게 지원합니다.<br></br>우수 예시와 비교하며 완성도 높은 자기소개서를 만들어보세요.
        </p>

        <button className={`${styles.btnPillOutline} ${styles.btnPrimary}`}>
          <span>AI 자소서 시작하기</span>
          <span className={styles.pillIcon} aria-hidden>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path
                d="M8 5l8 7-8 7"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* 시각화: 문서 카드 2장 */}
      <div className={styles.selfIntroVisual} aria-hidden>
        <div className={styles.docCard}>
          <span className={styles.docLine}></span>
          <span className={`${styles.docLine} ${styles.short}`}></span>
          <span className={styles.docLine}></span>
          <span className={styles.docLine}></span>
        </div>
        <div className={`${styles.docCard} ${styles.enhanced}`}>
          <span className={`${styles.docLine} ${styles.highlight}`}></span>
          <span className={`${styles.docLine} ${styles.short}`}></span>
          <span className={`${styles.docLine} ${styles.highlight}`}></span>
          <span className={styles.docLine}></span>
        </div>
      </div>
    </div>
  </section>
);

/* ===== Aptitude ===== */
const Aptitude = () => (
  <section className={styles.aptitude}>
    <div className={styles.aptitudeInner}>
      <div className={styles.logoGrid}>
        {["samsung", "sk", "cj", "kt"].map((brand) => (
          <div key={brand} className={styles.logoCell}>
            <img src={`/assets/logo-${brand}.png`} alt={`${brand} logo`} />
          </div>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.logoCell}></div>
        ))}
      </div>

      <div className={styles.aptiCopy}>
        <h3>인적성검사</h3>
        <p>
          문항 응답과 표정 분석을 통해 성격과 직무 적합도를 진단해요.<br></br>검사 결과는 마이페이지에서 언제든
          확인할 수 있어요.
        </p>

        <div className={styles.ctaCol}>
          <button className={styles.btnPillOutline}>
            <span>직무적성검사</span>
            <span className={styles.pillIcon} aria-hidden>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M8 5l8 7-8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          <button className={styles.btnPillOutline}>
            <span>BIG5 검사</span>
            <span className={styles.pillIcon} aria-hidden>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M8 5l8 7-8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
);

/* ===== AI Blocks ===== */
const AiBlocks = () => (
  <section className={styles.ai}>
    <div className={styles.sectionHeadCenter}>
      <h2>
        AI 분석으로 완성하는 <span className={styles.accent}>실전 면접 연습</span>
      </h2>
      <p>
        시선, 음성, 표정까지 분석하여 실시간 피드백을 제공하고<br></br>직무 기반 질문부터 종합 리포트까지 완벽하게
        대비할 수 있어요.
      </p>
    </div>

    <div className={styles.cardGrid2}>
      <article className={styles.serviceCard}>
        <img src="/assets/icon-prep.png" alt="prep" className={styles.serviceIcon} />
        <h3>면접 대비</h3>
        <p>온/오프라인 면접을 대비한 서비스입니다.</p>
      </article>

      <article className={styles.serviceCard}>
        <img src="/assets/icon-ai.png" alt="ai" className={styles.serviceIcon} />
        <h3>AI 면접</h3>
        <p>온/오프라인 면접을 대비한 서비스입니다.</p>
      </article>
    </div>
  </section>
);

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerInner}>
      <p>© {new Date().getFullYear()} AI Interview Project.</p>
    </div>
  </footer>
);

export default function MainPage() {
  return (
    <div className={styles.page}>
      <main>
        <Hero />
        <PainCards />
        <SelfIntro />
        <Aptitude />
        <AiBlocks />
      </main>
      <Footer />
    </div>
  );
}
