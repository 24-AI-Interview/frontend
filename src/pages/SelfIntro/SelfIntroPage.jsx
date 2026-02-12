/* ----------------------------------------------
   File: src/pages/SelfIntro/SelfIntroPage.jsx
---------------------------------------------- */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import Button from "../../components/Common/Button";
import styles from "./SelfIntroPage.module.css";
import {
  createSelfIntro,
  deleteSelfIntro,
  fetchSelfIntroDetail,
  fetchSelfIntros,
  updateSelfIntro,
} from "../../api/selfintro";

/* 단계(STAGES) 정의 */
const STAGES = [
  { id: "draft", label: "작성 중" },
  { id: "screening", label: "서류 전형" },
  { id: "round1", label: "1차 전형" },
  { id: "round2", label: "2차 전형" },
  { id: "final", label: "최종 전형" },
];

/* 정렬 옵션 */
const SORT_OPTIONS = [
  { id: "latest", label: "최신 순으로 정렬" },
  { id: "oldest", label: "오래된 순으로 정렬" },
  { id: "title", label: "제목순 정렬" },
];

/* 기간 필터 옵션 */
const PERIOD_OPTIONS = [
  { id: "all", label: "전체 기간" },
  { id: "7", label: "최근 7일" },
  { id: "30", label: "최근 30일" },
  { id: "90", label: "최근 90일" },
];

const nowISO = () => new Date().toISOString();

export default function SelfIntroPage() {
  const navigate = useNavigate();

  /* 상태 정의 */
  const [items, setItems] = useState([]); 
  const [search, setSearch] = useState(""); 
  const [sort, setSort] = useState(SORT_OPTIONS[0].id); 
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0].id); 
  const [editing, setEditing] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* API에서 데이터 불러오기 */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchSelfIntros();
        if (!ignore) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setError("자기소개서 목록을 불러오는 데 실패했습니다.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  /* 검색, 기간, 정렬 필터링 */
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let arr = items.filter((it) => {
      // 검색어 필터
      const inSearch =
        !term ||
        String(it.title || "").toLowerCase().includes(term) ||
        String(it.company || "").toLowerCase().includes(term) ||
        String(it.body || "").toLowerCase().includes(term);

      if (!inSearch) return false;

      // 기간 필터
      if (period === "all") return true;
      const days = Number(period);
      const from = Date.now() - days * 24 * 60 * 60 * 1000;
      const updatedAt = new Date(it.updatedAt).getTime();
      return (Number.isFinite(updatedAt) ? updatedAt : 0) >= from;
    });

    // 정렬
    switch (sort) {
      case "oldest":
        arr.sort((a, b) => {
          const at = new Date(a.updatedAt).getTime();
          const bt = new Date(b.updatedAt).getTime();
          return (Number.isFinite(at) ? at : 0) - (Number.isFinite(bt) ? bt : 0);
        });
        break;
      case "title":
        arr.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
        break;
      case "latest":
      default:
        arr.sort((a, b) => {
          const at = new Date(a.updatedAt).getTime();
          const bt = new Date(b.updatedAt).getTime();
          return (Number.isFinite(bt) ? bt : 0) - (Number.isFinite(at) ? at : 0);
        });
    }
    return arr;
  }, [items, search, sort, period]);

  /* 단계별 데이터 그룹화 */
  const byStage = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s.id, []]));
    filtered.forEach((it) => {
      if (!map[it.stage]) map[it.stage] = [];
      map[it.stage].push(it);
    });
    return map;
  }, [filtered]);

  /* 액션 핸들러 */
  const handleCreate = (stageId) => {
    (async () => {
      try {
        const newItem = await createSelfIntro({
          title: "새 자기소개서",
          company: "",
          stage: stageId,
          updatedAt: nowISO(),
          body: "",
        });
        setItems((prev) => [newItem, ...prev]);
        setEditing(newItem);
      } catch (e) {
        alert("자기소개서를 생성하지 못했습니다.");
      }
    })();
  };

  const handleEditOpen = (item) => {
    (async () => {
      try {
        const detail = await fetchSelfIntroDetail(item.id);
        setEditing(detail);
      } catch (e) {
        alert("상세 정보를 불러오는 데 실패했습니다.");
      }
    })();
  };

  const handleDelete = (id) => {
    // 삭제
    if (!window.confirm("삭제하시겠어요?")) return;
    (async () => {
      try {
        await deleteSelfIntro(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
        setEditing(null);
      } catch (e) {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    })();
  };

  const handleMove = (id, nextStage) => {
    (async () => {
      try {
        const updated = await updateSelfIntro(id, {
          stage: nextStage,
          updatedAt: nowISO(),
        });
        setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      } catch (e) {
        alert("단계 이동에 실패했습니다.");
      }
    })();
  };

  const handleSaveModal = (payload) => {
    (async () => {
      try {
        const updated = await updateSelfIntro(payload.id, payload);
        setItems((prev) => prev.map((i) => (i.id === payload.id ? updated : i)));
        setEditing(null);
      } catch (e) {
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      }
    })();
  };

  const goAiSelfIntro = () => {
    // AI 첨삭 페이지 이동
    navigate("/ai-selfintro");
  };

  if (loading) {
    return <div className={styles.page}>불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.page}>{error}</div>;
  }

  return (
    <div className={styles.page}>
      {/* 페이지 상단 히어로 영역 */}
      <PageHero
        badge="자기소개서 작성"
        title="지원 중인 공고별로 자소서를 정리하고 단계별로 관리하세요."
        maxWidth={1200}
      />

      {/* 필터/검색/버튼 툴바 */}
      <div className={styles.toolbar}>
        {/* 왼쪽: 기간/정렬/검색 */}
        <div className={styles.selects}>
          {/* 기간 필터 */}
          <div className={styles.select}>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIOD_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 필터 */}
          <div className={styles.select}>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* 검색창 */}
          <div className={styles.search}>
            <span className={styles.searchIcon} aria-hidden>
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="기업명, 자기소개서 제목, 내용 검색"
            />
          </div>
        </div>

        {/* 오른쪽: AI 첨삭 버튼 */}
        <div className={styles.rightTools}>
          <Button className={styles.aiBtn} onClick={goAiSelfIntro}>
            AI 자기소개서 첨삭
          </Button>
        </div>
      </div>

      {/* 단계별 보드 */}
      <div className={styles.board}>
        {STAGES.map((stage) => (
          <div key={stage.id} className={styles.column}>
            {/* 컬럼 헤더 */}
            <div className={styles.colHeader}>
              <div className={styles.colTitle}>{stage.label}</div>
              <div className={styles.counter}>
                {byStage[stage.id]?.length || 0}
              </div>
            </div>

            {/* 새 자소서 작성 버튼 */}
            <button
              className={styles.addCard}
              onClick={() => handleCreate(stage.id)}
            >
              + 새 자소서 작성
            </button>

            {/* 카드 리스트 */}
            <div className={styles.cardList}>
              {byStage[stage.id]?.map((card) => (
                <article key={card.id} className={styles.card}>
                  <div className={styles.cardHead}>
                    <h4 className={styles.cardTitle}>
                      {card.title || "제목 없음"}
                    </h4>
                    <button
                      className={styles.cardMenu}
                      title="편집"
                      onClick={() => handleEditOpen(card)}
                    >
                      ⋯
                    </button>
                  </div>
                  {card.company && (
                    <div className={styles.cardMeta}>{card.company}</div>
                  )}
                  <div className={styles.cardDate}>
                    {new Date(card.updatedAt).toLocaleDateString()}
                  </div>

                  {/* 빠른 단계 이동 버튼 */}
                  <div className={styles.quickMoves}>
                    {STAGES.filter((s) => s.id !== card.stage).map((s) => (
                      <button
                        key={s.id}
                        className={styles.quickBtn}
                        onClick={() => handleMove(card.id, s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 편집 모달 */}
      {editing && (
        <EditModal
          data={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveModal}
          onDelete={() => handleDelete(editing.id)}
        />
      )}
    </div>
  );
}

/* 편집 모달 컴포넌트 */
function EditModal({ data, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(data.title || "");
  const [company, setCompany] = useState(data.company || "");
  const [stage, setStage] = useState(data.stage);
  const [body, setBody] = useState(data.body || "");

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h3>자기소개서 편집</h3>
        </header>

        <div className={styles.modalBody}>
          {/* 제목 입력 */}
          <label className={styles.field}>
            <span>제목</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 2025 상반기 ○○기업 지원서"
            />
          </label>

          {/* 기업명 입력 */}
          <label className={styles.field}>
            <span>기업명</span>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="회사명을 입력하세요"
            />
          </label>

          {/* 단계 선택 */}
          <label className={styles.field}>
            <span>단계</span>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          {/* 내용 입력 */}
          <label className={styles.field}>
            <span>내용</span>
            <textarea
              rows={9}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="자기소개서 내용을 입력하세요"
            />
          </label>
        </div>

        <footer className={styles.modalFooter}>
          <Button className={styles.deleteBtn} onClick={onDelete}>
            삭제
          </Button>
          <div className={styles.modalActions}>
            <Button className={styles.secondaryBtn} onClick={onClose}>
              닫기
            </Button>
            <Button
              className={styles.primaryBtn}
              onClick={() =>
                onSave({ ...data, title, company, stage, body })
              }
            >
              저장
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
