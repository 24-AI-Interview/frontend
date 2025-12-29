// File: src/pages/MyPage/SpecTab/SpecTab.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./SpecTab.module.css";
import Button from "../../../components/Common/Button";
import { fetchMyProfile, saveMyProfile } from "../../../api/mypage";

import EducationSection from "./EducationSection";
import CertificateList from "./CertificateList";
import ExperienceList from "./ExperienceList";
import SkillsInput from "./SkillsInput";

export default function SpecTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    education: { school: "", major: "", status: "재학", admissionYear: "", graduationYear: "" },
    certificates: [{ name: "", organization: "", issueDate: "" }],
    experience: [{ company: "", role: "", period: "", description: "" }],
    skills: [], // ["Python","Figma"]
  });

  // TODO: 실제 로그인 사용자의 ID로 대체
  const userId = "user_abc";

  // 최초 로딩 (기존 데이터 조회)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchMyProfile({ userId });
        if (ignore) return;
        setForm({
          education: data.education ?? form.education,
          certificates: data.certificates?.length ? data.certificates : form.certificates,
          experience: data.experience?.length ? data.experience : form.experience,
          skills: data.skills ?? [],
        });
      } catch (e) {
        // 데이터가 없어도 신규 입력이면 그냥 무시
        console.warn(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []); // eslint-disable-line

  const setField = (path, value) => {
    setForm(prev => {
      const next = structuredClone(prev);
      // 간단 path setter
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys.at(-1)] = value;
      return next;
    });
  };

  // 필수값 검사
  const validate = () => {
    const { school, major, status, admissionYear } = form.education;
    if (!school?.trim()) return "학력의 학교명을 입력해주세요.";
    if (!major?.trim()) return "학력의 전공을 입력해주세요.";
    if (!status) return "학력의 재학/졸업 상태를 선택해주세요.";
    if (!/^\d{4}$/.test(String(admissionYear))) return "입학연도는 YYYY 형식으로 입력해주세요.";
    if (form.education.graduationYear && !/^\d{4}$/.test(String(form.education.graduationYear))) {
      return "졸업연도는 YYYY 형식으로 입력해주세요.";
    }
    // 자격증 날짜 형식
    for (const c of form.certificates) {
      if (!c.name && !c.organization && !c.issueDate) continue; // 빈줄 허용
      if (!c.name?.trim()) return "자격증명을 입력해주세요.";
      if (!c.organization?.trim()) return "발급 기관을 입력해주세요.";
      if (c.issueDate && !/^\d{4}-\d{2}-\d{2}$/.test(c.issueDate)) return "자격증 발급일은 YYYY-MM-DD 형식입니다.";
    }
    // 경력
    for (const e of form.experience) {
      if (!e.company && !e.role && !e.period && !e.description) continue;
      if (!e.company?.trim()) return "경력의 회사명을 입력해주세요.";
      if (!e.role?.trim()) return "경력의 직무를 입력해주세요.";
    }
    return "";
  };

  const onSave = async () => {
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      window.alert("모든 필수 항목을 확인해주세요."); // 토스트 대체
      return;
    }
    try {
      setSaving(true);
      const payload = {
        userId,
        education: {
          ...form.education,
          admissionYear: Number(form.education.admissionYear) || "",
          graduationYear: form.education.graduationYear ? Number(form.education.graduationYear) : "",
        },
        certificates: form.certificates.filter(c => c.name || c.organization || c.issueDate),
        experience: form.experience.filter(e => e.company || e.role || e.period || e.description),
        skills: form.skills,
      };
      await saveMyProfile(payload);
      window.alert("이력 정보가 저장되었습니다");
    } catch (e) {
      console.error(e);
      window.alert("이력 정보 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const summary = useMemo(() => {
    const school = form.education.school || "-";
    const major = form.education.major || "-";
    const certCount = (form.certificates || []).filter(c => c.name).length;
    const expCount = (form.experience || []).filter(e => e.company).length;
    return { school, major, certCount, expCount, skills: form.skills };
  }, [form]);

  if (loading) return <div className={styles.skeleton}>불러오는 중...</div>;

  return (
    <div className={styles.wrapper}>
      {/* 상단 요약 카드 */}
      <section className={styles.summaryCard}>
        <div>
          <div className={styles.summaryTitle}>{summary.school}</div>
          <div className={styles.summarySub}>{summary.major}</div>
        </div>
        <div className={styles.summaryMeta}>
          <span>자격증 {summary.certCount}개</span>
          <span>경력 {summary.expCount}건</span>
          {!!summary.skills?.length && <span>스킬 {summary.skills.length}개</span>}
        </div>
      </section>

      {/* 입력 폼 */}
      <section className={styles.formSection}>
        <details open className={styles.accordion}>
          <summary>학력</summary>
          <EducationSection value={form.education} onChange={(k, v) => setField(`education.${k}`, v)} />
        </details>

        <details className={styles.accordion}>
          <summary>자격증</summary>
          <CertificateList
            items={form.certificates}
            onChange={(items) => setField("certificates", items)}
          />
        </details>

        <details className={styles.accordion}>
          <summary>경력</summary>
          <ExperienceList
            items={form.experience}
            onChange={(items) => setField("experience", items)}
          />
        </details>

        <details className={styles.accordion}>
          <summary>기술 스택 (선택)</summary>
          <SkillsInput
            value={form.skills}
            onChange={(skills) => setField("skills", skills)}
            placeholder="예: Python, Figma, React"
          />
        </details>

        {error && <p className={styles.errorText}>{error}</p>}
      </section>

      {/* 하단 고정 저장 바 */}
      <div className={styles.saveBar}>
        <div className={styles.saveBar__hint}>필수 항목을 입력한 뒤 저장하세요.</div>
        <Button text={saving ? "저장 중..." : "저장"} onClick={onSave} disabled={saving} />
      </div>
    </div>
  );
}
