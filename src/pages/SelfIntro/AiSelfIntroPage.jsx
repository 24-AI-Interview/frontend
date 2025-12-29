/* ------------------------------------------------
   File: src/pages/SelfIntro/AiSelfIntroPage.jsx
------------------------------------------------ */

import React, { useEffect, useMemo, useState } from "react";
import PageHero from "../../components/Common/PageHero";
import Button from "../../components/Common/Button";
import styles from "./AiSelfIntroPage.module.css";
import { fetchSelfIntros } from "../../api/selfintro";

/* 자기소개서 진행 단계 옵션 */
const STAGES = [
  { id: "draft", label: "작성 중" },
  { id: "screening", label: "서류 전형" },
  { id: "round1", label: "1차 전형" },
  { id: "round2", label: "2차 전형" },
  { id: "final", label: "최종 전형" },
];

/* 모드(입력 방식) 상수 */
const MODE = {
  INPUT: "input",
  FILE: "file",
  SAVED: "saved",
};

export default function AiSelfIntroPage() {
  /* 공통 폼 상태 */
  const [industry, setIndustry] = useState("");
  const [job, setJob] = useState("");
  const [mode, setMode] = useState(MODE.INPUT);

  /* 직접 입력 상태 */
  const [text, setText] = useState("");
  const MAX = 2000;

  /* 파일 업로드 상태 */
  const [file, setFile] = useState(null);

  /* 저장된 자기소개서 상태 */
  const [saved, setSaved] = useState([]);
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [savedError, setSavedError] = useState("");

  /* 페이지 로드 시 API 데이터 불러오기 */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchSelfIntros();
        if (!ignore) setSaved(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setSavedError("저장된 자기소개서를 불러오지 못했습니다.");
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  /* 단계 필터 적용된 저장 데이터 */
  const filteredSaved = useMemo(() => {
    if (stageFilter === "all") return saved;
    return saved.filter((s) => s.stage === stageFilter);
  }, [saved, stageFilter]);

  /* 파일 드래그 앤 드롭 처리 */
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };
  /* 첨삭 요청 버튼 클릭 처리 */
  const handleAnalyze = () => {
    if (mode === MODE.INPUT && !text.trim()) {
      alert("자기소개서 내용을 입력해 주세요.");
      return;
    }
    if (mode === MODE.FILE && !file) {
      alert("파일을 업로드해 주세요.");
      return;
    }
    if (mode === MODE.SAVED && !selectedId) {
      alert("자기소개서를 선택해 주세요.");
      return;
    }
    alert("AI 첨삭을 요청했습니다. (API 연동 지점)");
  };

  return (
    <div className={styles.page}>
      <PageHero
        badge="AI 자기소개서 첨삭"
        title="AI가 자기소개서를 분석하고 개선점을 제안해드립니다."
        maxWidth={1200}
      />

      {/* 업종/직무 선택 폼 */}
      <section className={styles.formBar}>
        <div className={styles.select}>
          <label>업무분야</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="">업무분야를 선택해주세요</option>
            <option value="개발">개발</option>
            <option value="디자인">디자인</option>
            <option value="마케팅">마케팅</option>
            <option value="영업">영업</option>
          </select>
        </div>

        <div className={styles.select}>
          <label>직무</label>
          <select value={job} onChange={(e) => setJob(e.target.value)}>
            <option value="">지원 직무를 선택해주세요</option>
            <option value="웹 프론트엔드">웹 프론트엔드</option>
            <option value="백엔드">백엔드</option>
            <option value="제품 디자이너">제품 디자이너</option>
            <option value="마케팅 매니저">마케팅 매니저</option>
          </select>
        </div>
      </section>

      {/* 모드 선택 버튼 */}
      <section className={styles.modeCards}>

        {/* 직접 입력 모드 */}
        <button
          className={`${styles.modeCard} ${mode === MODE.INPUT ? styles.active : ""}`}
          onClick={() => setMode(MODE.INPUT)}
        >
          <strong>직접 입력</strong>
          <span>자기소개서를 직접 붙여넣거나 입력합니다.</span>
        </button>

        {/* 파일 업로드 모드 */}
        <button
          className={`${styles.modeCard} ${mode === MODE.FILE ? styles.active : ""}`}
          onClick={() => setMode(MODE.FILE)}
        >
          <strong>파일 업로드</strong>
          <span>PDF, DOC, DOCX, HWP 텍스트 파일을 업로드합니다.</span>
        </button>

        {/* 저장된 자기소개서 모드 */}
        <button
          className={`${styles.modeCard} ${mode === MODE.SAVED ? styles.active : ""}`}
          onClick={() => setMode(MODE.SAVED)}
        >
          <strong>저장된 자기소개서</strong>
          <span>보드에 저장된 자기소개서에서 선택합니다.</span>
        </button>
      </section>

      {/* 모드별 입력 패널 */}
      <section className={styles.panel}>

        {/* 직접 입력 패널 */}
        {mode === MODE.INPUT && (
          <div className={styles.inputWrap}>
            <textarea
              className={styles.textarea}
              placeholder="자기소개서를 입력하세요."
              value={text}
              maxLength={MAX}
              onChange={(e) => setText(e.target.value)}
            />
            <div className={styles.counter}>
              {text.length}/{MAX}
            </div>
          </div>
        )}

        {/* 파일 업로드 패널 */}
        {mode === MODE.FILE && (
          <div
            className={styles.drop}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              id="file-input"
              type="file"
              className={styles.file}
              accept=".txt,.pdf,.doc,.docx,.hwp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <label htmlFor="file-input" className={styles.dropInner}>
              {file ? (
                <>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileHint}>다시 선택하려면 클릭</div>
                </>
              ) : (
                <>
                  <div className={styles.dropTitle}>
                    파일을 여기에 끌어오거나 클릭해서 선택하세요.
                  </div>
                  <div className={styles.fileHint}>
                    지원 형식: TXT, PDF, DOC, DOCX, HWP
                  </div>
                </>
              )}
            </label>
          </div>
        )}

        {/* 저장된 자기소개서 패널 */}
        {mode === MODE.SAVED && (
          <>
            <div className={styles.stageChips}>
              <button
                className={`${styles.chip} ${stageFilter === "all" ? styles.chipActive : ""}`}
                onClick={() => setStageFilter("all")}
              >
                전체
              </button>
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  className={`${styles.chip} ${stageFilter === s.id ? styles.chipActive : ""}`}
                  onClick={() => setStageFilter(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className={styles.savedList}>
              {savedError ? (
                <div className={styles.emptySaved}>{savedError}</div>
              ) : filteredSaved.length === 0 ? (
                <div className={styles.emptySaved}>
                  해당 단계의 저장된 자기소개서가 없습니다.
                </div>
              ) : (
                filteredSaved.map((it) => (
                  <label
                    key={it.id}
                    className={`${styles.savedItem} ${
                      selectedId === it.id ? styles.savedActive : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="saved"
                      value={it.id}
                      checked={selectedId === it.id}
                      onChange={() => setSelectedId(it.id)}
                    />
                    <div className={styles.savedTitle}>
                      {it.title || "제목 없음"}
                    </div>
                    <div className={styles.savedMeta}>
                      {STAGES.find((s) => s.id === it.stage)?.label || "-"} ·{" "}
                      {it.company || "기업명 없음"}
                    </div>
                  </label>
                ))
              )}
            </div>
          </>
        )}
      </section>

      {/* 하단 첨삭 요청 버튼 */}
      <div className={styles.footer}>
        <Button className={styles.primaryBtn} onClick={handleAnalyze}>
          자기소개서 첨삭받기
        </Button>
      </div>
    </div>
  );
}
