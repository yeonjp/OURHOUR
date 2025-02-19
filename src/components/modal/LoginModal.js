import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Kakao from "../../pages/social/Kakao";
import GoogleLoginButton from "../../pages/social/GoogleLoginButton";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 명명된 내보내기로 수정
import SignupModal from "./SignupModal"; // 추가
import { useTranslation } from "react-i18next";

const customStyles = {
  content: {
    width: '40%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000, // 모달의 z-index 값을 충분히 높게 설정
    position: 'fixed', // 모달의 position을 fixed로 설정
    padding: '20px',
    boxSizing: 'border-box',
  },
  overlay: {
    zIndex: 1000, // 오버레이의 z-index 값을 충분히 높게 설정
  },
};

const mobileStyles = {
  content: {
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: '0',
    transform: 'none',
    padding: '20px',
    boxSizing: 'border-box',
  },
  overlay: {
    zIndex: 1000,
  },
};

Modal.setAppElement('#root');

function LoginModal({ isOpen, onRequestClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // 추가
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    onRequestClose(); // 로그인 모달 닫기
  };

  const closeSignupModal = () => setIsSignupModalOpen(false);

  const onChangeEmail = (e) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);
    const emailRegTest = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    if (!emailRegTest.test(currentEmail)) {
      setEmailMessage("이메일의 형식이 올바르지 않습니다!");
      setIsEmail(false);
    } else {
      setEmailMessage("사용 가능한 이메일 입니다!");
      setIsEmail(true);
    }
  };

  const onChangePassword = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegTest = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    if (!passwordRegTest.test(currentPassword)) {
      setPasswordMessage("영어 대소문자, 특수문자, 숫자를 조합해 8자리 이상 20자리 이하로 입력해주세요!");
      setIsPassword(false);
    } else {
      setPasswordMessage("사용 가능한 비밀번호 입니다!");
      setIsPassword(true);
    }
  };

  const handleLISubmit = (e) => {
    e.preventDefault();

    const formData = { email, password };

    // 배포환경으로 변경해주기
    axios
      .post("http://localhost:8080/api/login", formData)
      .then((response) => {
        if (response.data.token) {
          const decodedToken = jwtDecode(response.data.token); // 토큰 디코드
          console.log(decodedToken);
          localStorage.setItem("token", response.data.token); // JWT토큰 localStorage 저장
          localStorage.setItem("email", decodedToken.email); // localStorage에 이메일 저장
          localStorage.setItem("phoneNumber", decodedToken.phoneNumber); // localStorage에 전화번호 저장
          localStorage.setItem("gender", decodedToken.gender); // localStorage에 성별 저장
          localStorage.setItem("profileImage", decodedToken.profileImage); // localStorage에 프로필이미지 경로 저장
          localStorage.setItem("nickName", decodedToken.nickName); // localStorage에 프로필이미지 경로 저장
          localStorage.setItem("loginType", decodedToken.loginType); // localStorage에 로그인타입 경로 저장
          navigate("/");
          onRequestClose(); // 로그인 성공 시 모달 닫기
        }
      })
      .catch((error) => {
        // 에러 핸들링 : BE에서 회원이 존재하지 않거나 비밀번호가 일치하지 않는 경우
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          console.error("error : ", error);
          setErrorMessage("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
      });
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={isMobile ? mobileStyles : customStyles} contentLabel="Login Modal">
        <div className="py-8 px-8 rounded-xl">
          <h1 className="font-medium text-2xl mt-3 text-center">{t("login")}</h1>
          <form onSubmit={handleLISubmit} className="mt-6">
            <div className="my-5">
              <label htmlFor="email" className="block text-black text-left">
                {t("email")}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={onChangeEmail}
                className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 min-w-full"
                placeholder={t("email")}
              />
              <p className="errorMsg text-red-600 mt-2 text-xl">{emailMessage}</p>
            </div>
            <div className="my-5 text-sm">
              <label htmlFor="password" className="block text-black text-left">
                {t("password")}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={onChangePassword}
                className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 min-w-full"
                placeholder={t("password")}
              />
              <p className="errorMsg text-red-600 mt-2 text-xl">{passwordMessage}</p>
              <div className="flex justify-end mt-5 text-lg text-blue-800 font-semibold">
                <span
                  onClick={() => navigate("/findpwd")}
                  className="text-blue-800 font-semibold cursor-pointer"
                >
                  {t("passwordForgot")}
                </span>
              </div>
            </div>
            {errorMessage && <p className="text-red-600 mt-4 text-xl">{errorMessage}</p>}
            <button
              className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full"
              type="submit"
            >
              {t("login")}
            </button>
          </form>
          <div className="flex md:justify-between justify-center items-center mt-10">
            <div style={{ height: 1 }} className="bg-gray-300 md:block hidden w-4/12" />
            <p className="md:mx-2 text-sm font-light text-gray-400"> Login With Social </p>
            <div style={{ height: 1 }} className="bg-gray-300 md:block hidden w-4/12" />
          </div>
          <div className="flex flex-col md:flex-row gap-2 mt-7 w-full">
            <div className="w-full flex-1">
              <Kakao className="w-full" />
            </div>
            <div className="w-full flex-1 mt-2 md:mt-0 md:ml-4">
              <GoogleLoginButton onRequestClose={onRequestClose} className="w-full p-2" />
            </div>
          </div>
          <p className="mt-12 text-xl text-center font-light text-gray-400">
            {t("haveNoAccount")}{" "}
            <span
              onClick={openSignupModal}
              className="text-blue-800 font-semibold cursor-pointer"
            >
              {t("signup")}
            </span>
          </p>
        </div>
      </Modal>
      <SignupModal isOpen={isSignupModalOpen} onRequestClose={closeSignupModal} />
    </>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default LoginModal;
