import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { useAuth } from "../../auth/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    agree: false,
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
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        phone: form.phone,
        agree: form.agree,
      });
      navigate("/");
    } catch (err) {
      const message =
        err?.message === "API Error: 409"
          ? "이미 사용 중인 이메일입니다."
          : "회원가입 중 오류가 발생했습니다.";
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
          <span className={styles.copyBadge}>Career Ready</span>
          <h1 className={styles.copyTitle}>
            합격 루틴을
            <br />
            오늘부터 설계하세요.
          </h1>
          <p className={styles.copyDesc}>
            기본 정보를 입력하면 맞춤형 면접 질문과 자기소개서 가이드를
            바로 받을 수 있어요.
          </p>
          <div className={styles.chipRow}>
            <span className={styles.chip}>개인화 대시보드</span>
            <span className={styles.chip}>면접 기록</span>
            <span className={styles.chip}>스펙 관리</span>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>회원가입</h2>
          <p className={styles.cardDesc}>3분만에 계정을 만들고 시작하세요.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>이름</span>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

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
                placeholder="영문/숫자 포함 8자 이상"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>비밀번호 확인</span>
              <input
                className={styles.input}
                type="password"
                name="passwordConfirm"
                placeholder="비밀번호를 다시 입력해주세요"
                value={form.passwordConfirm}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>휴대폰 번호</span>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={handleChange}
              />
              <span className={styles.helper}>선택 입력입니다.</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                required
              />
              이용약관 및 개인정보 처리방침에 동의합니다.
            </label>

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.primaryBtn} type="submit">
              회원가입
            </button>
          </form>

          <div className={styles.divider} />
          <div className={styles.footerRow}>
            <span>이미 계정이 있나요?</span>
            <Link className={styles.link} to="/login">
              로그인
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
