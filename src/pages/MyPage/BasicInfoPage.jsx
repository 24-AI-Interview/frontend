// File: src/pages/MyPage/BasicInfoPage.jsx
import React, { useState } from "react";
import styles from "./BasicInfoPage.module.css";
import Button from "../../components/Common/Button";
import PageLayout from "../../layouts/PageLayout";
import SpecTab from "./SpecTab/SpecTab";
import MyActivityTab from "./MyActivityTab/MyActivityTab";

export default function BasicInfoPage() {
  const [activeTab, setActiveTab] = useState("기본정보");
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    contactEmail: "",
    phoneNumber: "",
    interest: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const getButtonProps = (text) => {
    const map = {
      중복확인: () => alert("중복확인 로직을 여기에 구현하세요!"),
      변경: () => alert("이메일 변경 로직을 여기에 구현하세요!"),
      인증: () => alert("휴대폰 인증 로직을 여기에 구현하세요!"),
    };
    return { text, onClick: map[text] ?? (() => {}) };
  };

  const tabs = ["기본정보", "스펙관리", "내 활동", "비밀번호 변경·탈퇴"];

  return (
    <PageLayout showHero={false}>
      <div className={styles["mypage-container"]}>
        <div className={styles.bigbox}>
          {/* 상단 탭 */}
          <div className={styles["basic-info__tabs"]}>
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`${styles["basic-info__tab"]} ${
                  activeTab === tab ? styles["basic-info__tab--active"] : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 본문 */}
          <div className={styles["basic-info__box"]}>
            <h3 className={styles["basic-info__section-title"]}>{activeTab}</h3>
            <hr className={styles["basic-info__separator--main"]} />

            {/* 기본정보 */}
            {activeTab === "기본정보" && (
              <>
                <div className={styles["basic-info__row"]}>
                  <label className={styles["basic-info__label"]}>아이디</label>
                  <span className={styles["basic-info__value"]}>
                    ktyjj0306@naver.com
                  </span>
                </div>
                <hr className={styles["basic-info__separator"]} />

                <div className={styles["basic-info__row"]}>
                  <label className={styles["basic-info__label"]}>이름</label>
                  <span className={styles["basic-info__value"]}>예인</span>
                </div>
                <hr className={styles["basic-info__separator"]} />

                <div className={styles["basic-info__row--group"]}>
                  <label className={styles["basic-info__label"]}>닉네임</label>
                  <div className={styles["basic-info__field"]}>
                    <div className={styles["basic-info__input-row"]}>
                      <input
                        className={styles["basic-info__input"]}
                        placeholder="닉네임을 입력해주세요."
                        name="nickname"
                        value={userInfo.nickname}
                        onChange={handleInputChange}
                      />
                      <Button {...getButtonProps("중복확인")} />
                    </div>
                    <p className={styles["basic-info__input-desc"]}>
                      닉네임은 한글/영문 10자 이내로 설정 가능합니다.
                    </p>
                  </div>
                </div>
                <hr className={styles["basic-info__separator"]} />

                <div className={styles["basic-info__row--group"]}>
                  <label className={styles["basic-info__label"]}>이메일</label>
                  <div className={styles["basic-info__field"]}>
                    <div className={styles["basic-info__input-row"]}>
                      <input
                        className={styles["basic-info__input"]}
                        placeholder="이메일을 입력해주세요."
                        name="contactEmail"
                        value={userInfo.contactEmail}
                        onChange={handleInputChange}
                      />
                      <Button {...getButtonProps("변경")} />
                    </div>
                    <p className={styles["basic-info__input-desc"]}>
                      로그인 이메일과 별도로 연락용 이메일을 설정할 수 있습니다.
                    </p>
                  </div>
                </div>
                <hr className={styles["basic-info__separator"]} />

                <div className={styles["basic-info__row--group"]}>
                  <label className={styles["basic-info__label"]}>휴대폰 번호</label>
                  <div className={styles["basic-info__field"]}>
                    <div className={styles["basic-info__input-row"]}>
                      <input
                        className={styles["basic-info__input"]}
                        placeholder="휴대폰 번호를 입력해주세요."
                        name="phoneNumber"
                        value={userInfo.phoneNumber}
                        onChange={handleInputChange}
                      />
                      <Button {...getButtonProps("인증")} />
                    </div>
                    <p className={styles["basic-info__input-desc"]}>
                      본인 인증 및 알림 수신에 사용됩니다.
                    </p>
                  </div>
                </div>
                <hr className={styles["basic-info__separator"]} />

                <div className={styles["basic-info__row--group"]}>
                  <label className={styles["basic-info__label"]}>관심 분야 / 직무</label>
                  <div
                    className={`${styles["basic-info__field"]} ${styles["basic-info__field--inline"]}`}
                  >
                    <input
                      className={`${styles["basic-info__input"]} ${styles["basic-info__input--wide"]}`}
                      placeholder="예: 프론트엔드, 데이터 분석"
                      name="interest"
                      value={userInfo.interest}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 스펙관리 */}
            {activeTab === "스펙관리" && <SpecTab />}

            {/* 내 활동: 자기소개서/스크랩 채용/면접 기록 */}
            {activeTab === "내 활동" && <MyActivityTab />}

            {/* 플레이스홀더 */}
            {activeTab === "비밀번호 변경·탈퇴" && (
              <div style={{ padding: "12px 0", color: "#777" }}>
                비밀번호 변경 및 회원 탈퇴 화면 준비 중
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
