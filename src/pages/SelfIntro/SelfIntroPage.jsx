import React, { useEffect, useMemo, useState } from "react";
import PageHero from "../../components/Common/PageHero";
import Button from "../../components/Common/Button";
import styles from "./SelfIntroPage.module.css";

const STAGES = [
  { id: "draft", label: "작성 중" },
  { id: "screening", label: "서류 전형" },
  { id: "round1", label: "1차 전형" },
  { id: "round2", label: "2차 전형" },
  { id: "final", label: "최종 전형" },
];

const SORT_OPTIONS = [
  { id: "latest", label: "최신 순으로 정렬" },
  { id: "oldest", label: "오래된 순으로 정렬" },
  { id: "title", label: "제목순 정렬" },
];

const PERIOD_OPTIONS = [
  { id: "all", label: "전체 기간" },
  { id: "7", label: "최근 7일" },
  { id: "30", label: "최근 30일" },
  { id: "90", label: "최근 90일" },
];

const STORAGE_KEY = "selfintro:board:v1";

function nowISO() {
  return new Date().toISOString();
}

export default function SelfIntroPage() {
  // --------- 상태
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0].id);
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0].id);

  // 편집 모달
  const [editing, setEditing] = useState(null); // item 또는 null

  // --------- 로컬스토리지
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      else {
        // 첫 진입용 샘플
        setItems([
          {
            id: crypto.randomUUID(),
            title: "새 자기소개서",
            company: "",
            stage: "draft",
            updatedAt: nowISO(),
            body: "",
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // --------- 필터링/정렬
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let arr = items.filter((it) => {
      const inSearch =
        !term ||
        it.title.toLowerCase().includes(term) ||
        (it.company || "").toLowerCase().includes(term) ||
        (it.body || "").toLowerCase().includes(term);

      if (!inSearch) return false;

      if (period === "all") return true;
      const days = Number(period);
      const from = Date.now() - days * 24 * 60 * 60 * 1000;
      return new Date(it.updatedAt).getTime() >= from;
    });

    switch (sort) {
      case "oldest":
        arr = arr.sort(
          (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
        );
        break;
      case "title":
        arr = arr.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "latest":
      default:
        arr = arr.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    }
    return arr;
  }, [items, search, sort, period]);

  const byStage = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s.id, []]));
    filtered.forEach((it) => {
      if (!map[it.stage]) map[it.stage] = [];
      map[it.stage].push(it);
    });
    return map;
  }, [filtered]);

  // --------- 액션
  const handleCreate = (stageId) => {
    const newItem = {
      id: crypto.randomUUID(),
      title: "새 자기소개서",
      company: "",
      stage: stageId,
      updatedAt: nowISO(),
      body: "",
    };
    setItems((prev) => [newItem, ...prev]);
    setEditing(newItem);
  };

  const handleEditOpen = (item) => setEditing(item);
  const handleDelete = (id) => {
    if (!window.confirm("삭제하시겠어요?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    setEditing(null);
  };

  const handleMove = (id, nextStage) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, stage: nextStage, updatedAt: nowISO() } : i))
    );
  };

  const handleSaveModal = (payload) => {
    setItems((prev) =>
      prev.map((i) => (i.id === payload.id ? { ...i, ...payload, updatedAt: nowISO() } : i))
    );
    setEditing(null);
  };

  return (
    <div className={styles.page}>
      <PageHero
        badge="자기소개서"
        title="자기소개서 작성"
        subtitle="지원 중인 공고 별로 자소서를 정리하고 단계별로 관리해 보세요."
        maxWidth={1200}
      />

      {/* 필터 바 */}
      <div className={styles.toolbar}>
        <div className={styles.selects}>
          <div className={styles.select}>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIOD_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.select}>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.search}>
          <span className={styles.searchIcon} aria-hidden>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="기업명, 자기소개서 제목, 내용 검색"
          />
        </div>
      </div>

      {/* 보드 */}
      <div className={styles.board}>
        {STAGES.map((stage) => (
          <div key={stage.id} className={styles.column}>
            <div className={styles.colHeader}>
              <div className={styles.colTitle}>{stage.label}</div>
              <div className={styles.counter}>
                {byStage[stage.id]?.length || 0}
              </div>
            </div>

            <button
              className={styles.addCard}
              onClick={() => handleCreate(stage.id)}
            >
              + 새 자소서 작성
            </button>

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

                  {/* 빠른 이동 버튼 */}
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

/* ----------------- 모달 컴포넌트 ----------------- */
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
          <label className={styles.field}>
            <span>제목</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 2025 상반기 ○○기업 지원서"
            />
          </label>

          <label className={styles.field}>
            <span>기업명</span>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="회사명을 입력하세요"
            />
          </label>

          <label className={styles.field}>
            <span>단계</span>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>

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
          <Button className={styles.deleteBtn} onClick={onDelete}>삭제</Button>
          <div className={styles.modalActions}>
            <Button className={styles.secondaryBtn} onClick={onClose}>닫기</Button>
            <Button
              className={styles.primaryBtn}
              onClick={() => onSave({ ...data, title, company, stage, body })}
            >
              저장
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
