// File: src/pages/MyPage/BasicInfoPage.jsx
import React, { useState } from "react";
import styles from "./BasicInfoPage.module.css"; // ✅ 같은 폴더의 모듈 CSS
import Button from "../../components/Common/Button";
import PageLayout from "../../layouts/PageLayout";

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

  return (
    <PageLayout showHero={false}>
      {/* 마이페이지 전용 컨테이너(헤더-컨텐츠 간격 포함) */}
      <div className={styles["mypage-container"]}>
        <div className={styles.bigbox}>
          {/* 탭 */}
          <div className={styles["basic-info__tabs"]}>
            {["기본정보", "스펙관리", "비밀번호 변경", "회원 탈퇴"].map((tab) => (
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

            {activeTab === "기본정보" && (
              <>
                {/* 아이디 */}
                <div className={styles["basic-info__row"]}>
                  <label className={styles["basic-info__label"]}>아이디</label>
                  <span className={styles["basic-info__value"]}>
                    ktyjj0306@naver.com
                  </span>
                </div>
                <hr className={styles["basic-info__separator"]} />

                {/* 이름 */}
                <div className={styles["basic-info__row"]}>
                  <label className={styles["basic-info__label"]}>이름</label>
                  <span className={styles["basic-info__value"]}>예인</span>
                </div>
                <hr className={styles["basic-info__separator"]} />

                {/* 닉네임 */}
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

                {/* 이메일 */}
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

                {/* 휴대폰 번호 */}
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

                {/* 관심 분야 / 직무 */}
                <div className={styles["basic-info__row--group"]}>
                  <label className={styles["basic-info__label"]}>
                    관심 분야 / 직무
                  </label>
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
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
