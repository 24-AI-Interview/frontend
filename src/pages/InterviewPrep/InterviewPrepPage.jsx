import React from "react";
import styles from "./InterviewPrepPage.module.css";
import PageHero from "../../components/Common/PageHero";

const VIDEOS = [
  { id: "F5sxMs0X-LI", title: "삼성전자 합격 - 1분 자기소개 (Shorts)", ratio: "16/9" },
  { id: "BRQVy9JBGwk", title: "토스 합격 - 1분 자기소개", ratio: "16/9" },
  { id: "SQh4wIHUwUY", title: "강지영 아나운서가 알려주는 면접 합격 팁", ratio: "16/9" },
  { id: "SQh4wIHUwUY", title: "강지영 아나운서가 알려주는 면접 합격 팁", ratio: "16/9" },
];

const toEmbed = (id) => `https://www.youtube.com/embed/${id}`;
const ratioClass = (ratio) => (ratio === "9/16" ? styles.ratio9x16 : styles.ratio16x9);

export default function InterviewPrepPage() {
  return (
    <div className={styles.wrapper}>
      {/* 공통 히어로 */}
      <PageHero
        badge="면접 학습 지원"
        title="다양한 문항 각각에 대한 답변 가이드와 예시 답변을 제공합니다."
      />

      {/* 콘텐츠 */}
      <section className={styles.content}>
        <div className={styles.box}>
          <div className={styles.videoGrid}>
            {VIDEOS.map(({ id, title, ratio }, idx) => (
              <div className={styles.videoCard} key={`${id}-${idx}`}>
                <div className={`${styles.videoMedia} ${ratioClass(ratio)}`}>
                  <iframe
                    src={toEmbed(id)}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className={styles.videoBody}>
                  <h3 className={styles.videoTitle}>{title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
