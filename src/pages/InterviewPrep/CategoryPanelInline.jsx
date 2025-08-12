import React, { useEffect, useMemo, useState } from "react";
import styles from "../Interview/CategorySelect.module.css";

const jobCategories = {
  "경영·인사·총무·사무": [
    "경영전략·기획·조사·분석",
    "사무·총무·법무·통계",
    "경리·회계·세무·감사",
    "비서·사무지원·자료입력",
    "인사·인재개발·채용·교육·HR",
    "일반사무·사무지원·문서작성",
  ],
  "마케팅·광고·홍보·PR": [
    "브랜드·마케팅전략","홍보·PR·사보","광고·광고기획·AE","리서치·조사·통계","이벤트·프로모션",
  ],
  "전문·특수·자격직": [
    "법률·법무·등사·심판","외교·외무·통역","조사·사찰·검열·감사","방송·연예·모델",
    "간호사·간호조무사·치료·위생사","약사·한약사·수의사","MD·상품기획","보험·증권·경제·감정·경매",
    "사회복지·상담·자원봉사",
  ],
  "무역·유통·물류·운수": ["무역·수출입·해외영업","구매·자재·물류","상품중개·제조·유통관리","해송·운전·택배"],
  "영업·판매·TM·CS·상담": [
    "제조·건설·유통·서비스영업","금융·보험영업","광고영업·홍보영업","판매·매장관리",
    "판매영업·영업기획·영업지원","판매·판촉·판매전·캐셔","판매·매장관리·매니저","CS·인바운드·고객지원·상담",
  ],
  "생산·제조·기술·기능·연구개발": [
    "기술·연구개발·R&D","설계·CAD·CAM","생산·제조·품질·포장","생산·제조·품질·검사",
    "전기·기술·전자·기계","A/S·정비·설치·수리",
  ],
  "건설·건축·토목·환경": ["건축설계·인테리어·시공","건축·토목·환경·구조","전기·설비·통신","건설·사무·감리·안전·검사"],
  "인터넷·프로그래밍·시스템": [
    "웹기획·웹마스터·PM","콘텐츠·사이트운영","웹디자인·HTML코딩","웹프로그래밍","응용프로그램",
    "시스템프로그래밍","서버·보안·네트워크·LAN","시스템설계·설치·DB","웹호스팅·유지보수·자료수","게임기획·개발·운영(GM)",
  ],
  "CG·편집·그래픽디자인": ["시각·광고·그래픽(CG)디자인","편집(MAC/IBM)·출판디자인","웹·광고디자인","패션·의류·잡지디자인"],
  "이벤트·여행·외식·시설관리": ["여행·관광·레저·스포츠","외식·식음료·조리·주방","경비·보안·경호·시큐리티","건물·시설관리·주차관리"],
  "연출·촬영·기자·작가·연예": ["연출·PD·감독","촬영·조명·음향·시프터","기자·리포터·방송·중계","매니저·스탭·연예·공연"],
  "교육·교사·강사·교직원": ["IT·컴퓨터·디자인강사","교사·교수(유치원초중고대학)"],
};

export default function CategoryPanelInline({ selected, onChange, onConfirm }) {
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedMinor, setSelectedMinor] = useState("");

  // 부모에서 내려온 값과 동기화 ("대분류/소분류" 형태 허용)
  useEffect(() => {
    if (!selected) { setSelectedMajor(""); setSelectedMinor(""); return; }
    const [maj, min] = String(selected).split("/");
    if (maj && jobCategories[maj]) {
      setSelectedMajor(maj);
      setSelectedMinor(min || "");
    } else {
      setSelectedMajor("");
      setSelectedMinor("");
    }
  }, [selected]);

  const jobValue = useMemo(() => {
    if (selectedMajor && selectedMinor) return `${selectedMajor}/${selectedMinor}`;
    if (selectedMajor) return selectedMajor;
    return "";
  }, [selectedMajor, selectedMinor]);

  const pickMajor = (maj) => {
    setSelectedMajor(maj);
    setSelectedMinor("");
    onChange?.(maj);
  };

  const pickMinor = (min) => {
    setSelectedMinor(min);
    onChange?.(`${selectedMajor}/${min}`);
  };

  const confirm = (e) => {
    e?.preventDefault?.();
    if (!selectedMajor || !selectedMinor) return;
    onConfirm?.(jobValue);
  };

  // Hero/페이지 래퍼 없이 "패널"만 노출
  return (
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
                  onClick={() => pickMajor(major)}
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
                    onClick={() => pickMinor(minor)}
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
              <button className={styles.btnPrimary} onClick={confirm}>선택완료</button>
            </>
          ) : (
            <p>대분류와 소분류를 모두 선택해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
