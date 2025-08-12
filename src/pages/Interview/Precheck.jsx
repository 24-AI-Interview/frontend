// File: src/pages/Interview/Precheck.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import styles from "./Precheck.module.css";

const STATUS = {
  idle: "idle",
  ok: "ok",
  fail: "fail",
};

export default function Precheck() {
  const videoRef = useRef(null);
  const camStreamRef = useRef(null);
  const micStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const [camStatus, setCamStatus] = useState(STATUS.idle);
  const [micStatus, setMicStatus] = useState(STATUS.idle);
  const [checking, setChecking] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { job, questions } = location.state || {};

  const readyToStart = camStatus === STATUS.ok && micStatus === STATUS.ok;

  useEffect(() => {
    return () => stopAll();
  }, []);

  const stopAll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    [camStreamRef.current, micStreamRef.current].forEach((s) => {
      if (s) s.getTracks().forEach((t) => t.stop());
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      camStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCamStatus(STATUS.ok);
    } catch {
      setCamStatus(STATUS.fail);
    }
  };

  const startMicCheck = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      micStreamRef.current = stream;

      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      source.connect(analyser);

      const threshold = 0.02; // ~ -34dB
      const endAt = performance.now() + 5000;
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);

        if (rms > threshold) {
          setMicStatus(STATUS.ok);
          return;
        }
        if (performance.now() < endAt) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setMicStatus(STATUS.fail);
        }
      };
      tick();
    } catch {
      setMicStatus(STATUS.fail);
    }
  };

  const onStart = async () => {
    setChecking(true);
    setCamStatus(STATUS.idle);
    setMicStatus(STATUS.idle);
    stopAll();
    await startCamera();
    await startMicCheck();
    setChecking(false);
  };

  const handleStartInterview = () => {
    stopAll();
    navigate("/interview/session", { state: { job, questions } });
  };

  // 상태별 배경색 매핑 (초록/빨강/회색)
  const badgeClass = (st) =>
    st === STATUS.ok
      ? styles.badgeSuccess
      : st === STATUS.fail
      ? styles.badgeError
      : styles.badgeIdle;

  return (
    <div className={styles.page}>
      {/* 공통 배지 */}
      <PageHero badge="응시환경 체크하기" />

      {/* 안내문 + 시작하기 */}
      <p className={styles.heroDesc}>
        웹캠과 마이크 체크를 시작합니다.
        <br />
        <button
          type="button"
          className={`${styles.startBtn} ${styles.startBtnPrimary}`}
          onClick={onStart}
          disabled={checking}
          aria-label="시작하기"
        >
          {checking && <span className={styles.spinner} aria-hidden="true" />}
          {checking ? "확인 중..." : "시작하기"}
        </button>{" "}
        버튼을 누르고 가이드 선 안에 얼굴을 위치시켜
        <br />“면접 테스트입니다.” 문구를 소리내어 읽어주세요.
      </p>

      {/* 메인 카드 */}
      <section className={styles.card}>
        <div className={styles.panel}>
          {/* 좌: 웹캠 */}
          <div className={styles.webcamWrap} aria-label="웹캠 미리보기">
            <video ref={videoRef} className={styles.webcamVideo} autoPlay playsInline muted />
          </div>

          {/* 우: 상태 카드 */}
          <div className={styles.statusCol}>
            <div className={badgeClass(camStatus)}>
              <div className={styles.badgeTitle}>
                얼굴인식 {camStatus === STATUS.ok ? "성공" : camStatus === STATUS.fail ? "실패" : "대기"}
              </div>
              <div className={styles.badgeDesc}>
                {camStatus === STATUS.ok
                  ? "얼굴이 인식되었어요!"
                  : camStatus === STATUS.fail
                  ? "카메라가 감지되지 않아요."
                  : "시작하기를 누르고 카메라 권한을 허용해 주세요."}
              </div>
              {camStatus === STATUS.ok && <span className={styles.checkIcon} aria-hidden="true">✓</span>}
              {camStatus === STATUS.fail && <span className={styles.crossIcon} aria-hidden="true">✕</span>}
            </div>

            <div className={badgeClass(micStatus)}>
              <div className={styles.badgeTitle}>
                음성인식 {micStatus === STATUS.ok ? "성공" : micStatus === STATUS.fail ? "실패" : "대기"}
              </div>
              <div className={styles.badgeDesc}>
                {micStatus === STATUS.ok
                  ? "음성이 잘 들려요!"
                  : micStatus === STATUS.fail
                  ? "음성이 제대로 들리지 않아요."
                  : "“면접 테스트입니다.”라고 말해 주세요."}
              </div>
              {micStatus === STATUS.ok && <span className={styles.checkIcon} aria-hidden="true">✓</span>}
              {micStatus === STATUS.fail && <span className={styles.crossIcon} aria-hidden="true">✕</span>}
            </div>
          </div>
        </div>

        {/* 하단 액션 */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="button"
            className={`${styles.startBtn} ${styles.startBtnPrimary}`}
            onClick={handleStartInterview}
            disabled={!readyToStart}
          >
            {readyToStart ? "면접 시작하기" : "환경 확인 필요"}
          </button>
          {!readyToStart && (
            <div style={{ marginTop: 8, fontSize: 14, color: "#7a7f8c" }}>
              카메라와 마이크가 모두 정상이어야 시작할 수 있어요.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
