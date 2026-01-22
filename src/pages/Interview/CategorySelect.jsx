// File: src/pages/Interview/CategorySelect.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategorySelect.module.css";
import PageHero from "../../components/Common/PageHero";

const jobCategories = {
  "경영·사무": [
    "경영","기획","전략","경영지원","사무","총무","회계","재무","경리","감사",
    "인사","HR","법무","비서","관리",
    "MD","상품기획","심사","행정","세무","계리"
  ],

  "마케팅·PR": [
    "마케팅","마케터","온라인마케터","브랜드","홍보","PR","광고","AE",
    "프로모션","이벤트","리서치","SNS","퍼포먼스","CRM",
    // 디자인/콘텐츠는 직군을 더 줄이기 위해 여기로 흡수
    "디자인","디자이너","그래픽","시각","UI","UX","편집","영상","콘텐츠"
  ],

  "영업·고객": [
    "영업","제품영업","해외영업","금융영업","영업지원","영업관리",
    "판매","매장","CS","고객","상담","TM","서비스","제휴",
    "호텔","은행원","텔러"
  ],

  "IT·개발": [
    "개발","웹개발자","앱개발자","소프트웨어","프로그래밍",
    "백엔드","프론트","풀스택","서버",
    "시스템","네트워크","보안","클라우드","DB","데이터",
    "AI","머신러닝",
    "PM","PO","PL","IT","IT인프라","전산"
  ],

  "엔지니어·R&D": [
    "엔지니어","전기","전자","기계","화학","반도체",
    "R&D","연구","연구원",
    "생산","제조","공정","설계","CAD",
    "품질","QA",
    "환경","안전",
    "건축","토목","시공","현장",
    "설비","정비","A/S","설치","수리",
    "필드엔지니어","자동화","기술"
  ],

  "무역·물류": [
    "무역","수출입","구매","자재","물류","유통","SCM",
    "운전","배송","택배"
  ],

  "전문·기타": [
    "간호","약사","수의","교사","강사","교육",
    "상담","사회복지","통역","외교",
    "방송","기자","연예","모델"
  ],

  // 면접유형/너무 모호한 값들(예: 일반면접, 토론면접, PT면접, 임원면접, 금융 등)
  "기타": []
};

export default function CategorySelect() {
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedMinor, setSelectedMinor] = useState("");
  const navigate = useNavigate();

  const handleMajorSelect = (major) => { setSelectedMajor(major); setSelectedMinor(""); };
  const handleMinorSelect = (minor) => setSelectedMinor(minor);

  const handleDone = () => {
    // TODO: DB에서 선택 카테고리에 맞는 질문 fetch 후 사용
    const questions = [
      "우리 회사에 지원하게 된 동기는 무엇인가요?",
      "최근 해결한 문제와 접근 방법은?",
      "협업 과정에서 갈등 해결 경험은?",
    ];
    navigate("/interview/precheck", {
          state: { 
            job: `${selectedMajor}/${selectedMinor}`, questions 
           },
    });
  };

  return (
    <div className={styles.page}>
      <PageHero
        badge="면접 질문 선택"
        title="면접에서 답하고자 하는 질문의 유형을 선택해주세요."
      />

      <div className={styles.container}>
        <div className={styles.bigbox}>
          <div className={styles.panel}>
            {/* 대분류 */}
            <div className={styles.list}>
              <h2>대분류</h2>
              <ul>
                {Object.keys(jobCategories).map((major) => (
                  <li
                    key={major}
                    className={`${styles.item} ${major === selectedMajor ? styles.active : ""}`}
                    onClick={() => handleMajorSelect(major)}
                  >
                    {major}
                  </li>
                ))}
              </ul>
            </div>

            {/* 소분류 */}
            <div className={styles.list}>
              <h2>소분류</h2>
              {selectedMajor ? (
                <ul>
                  {jobCategories[selectedMajor].map((minor) => (
                    <li
                      key={minor}
                      className={`${styles.item} ${minor === selectedMinor ? styles.active : ""}`}
                      onClick={() => handleMinorSelect(minor)}
                    >
                      {minor}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.placeholder}>대분류를 먼저 선택하세요</p>
              )}
            </div>
          </div>

          {/* 선택 결과 */}
          <div className={styles.preview}>
            {selectedMajor && selectedMinor ? (
              <>
                <p>
                  선택한 카테고리: <strong>{selectedMajor}</strong> / <strong>{selectedMinor}</strong>
                </p>
                <button className={styles.btnPrimary} onClick={handleDone}>선택완료</button>
              </>
            ) : (
              <p>대분류와 소분류를 모두 선택해주세요.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}