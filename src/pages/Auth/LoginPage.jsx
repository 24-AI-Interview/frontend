import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { useAuth } from "../../auth/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login({
        email: form.email,
        password: form.password,
        remember: form.remember,
      });
      navigate("/");
    } catch (err) {
      const message =
        err?.message === "API Error: 401"
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : "로그인 중 오류가 발생했습니다.";
      setError(message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.heroDecor}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={styles.gridOverlay} />
      </div>

      <section className={styles.content}>
        <div className={styles.copy}>
          <span className={styles.copyBadge}>AI 커리어 코치</span>
          <h1 className={styles.copyTitle}>
            면접 준비부터 합격까지,
            <br />
            한 번에 관리하세요.
          </h1>
          <p className={styles.copyDesc}>
            맞춤형 면접 시뮬레이션과 자기소개서 첨삭, 인적성 검사까지.
            지금 로그인하고 개인화된 준비 플랜을 시작하세요.
          </p>
          <div className={styles.chipRow}>
            <span className={styles.chip}>AI 면접</span>
            <span className={styles.chip}>자기소개서</span>
            <span className={styles.chip}>인적성</span>
            <span className={styles.chip}>마이페이지</span>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>로그인</h2>
          <p className={styles.cardDesc}>이메일과 비밀번호를 입력해 주세요.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>이메일</span>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>비밀번호</span>
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <div className={styles.inlineRow}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                로그인 유지
              </label>
              <button type="button" className={styles.mutedBtn}>
                비밀번호 찾기
              </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.primaryBtn} type="submit">
              로그인
            </button>
          </form>

          <div className={styles.divider} />
          <div className={styles.footerRow}>
            <span>아직 계정이 없나요?</span>
            <Link className={styles.link} to="/signup">
              회원가입
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
