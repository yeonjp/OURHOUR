import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { registerUser, sendEmailVerification, confirmEmailVerification } from "../../api/apiService"; // API 서비스 함수들 가져오기
import { useTranslation } from "react-i18next";
import "./SignupModal.css";
import logo from "../../assets/logo.png";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    position: 'fixed',
    width: '70%',
    height: '90%',
    padding: '10px',
    paddingTop: '30px',
  },
  overlay: {
    zIndex: 1000,
  },
};

const mobileStyles = {
  content: {
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: '0',
    transform: 'none',
    zIndex: 1000,
    position: 'fixed',
    width: '100%',
    height: '100%',
    padding: '20px',
    paddingTop: '30px',
  },
  overlay: {
    zIndex: 1000,
  },
};

Modal.setAppElement('#root'); // 애플리케이션 루트를 설정하여 접근성을 향상시킴

function SignupModal({ isOpen, onRequestClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [min, setMin] = useState(5);
  const [sec, setSec] = useState(0);
  const time = useRef(300);
  const timerId = useRef(null);
  const isMobile = window.innerWidth <= 768;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    phoneNumber: "",
    gender: "none",
    language: "korean",
    profilePicture: null,
    profilePictureUrl: '',
    nickName: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [messages, setMessages] = useState({
    emailMessage: "",
    passwordMessage: "",
    passwordCheckMessage: "",
    phoneNumberMessage: "",
  });

  const [validity, setValidity] = useState({
    isEmail: false,
    isPassword: false,
    isPasswordCheck: false,
    isPhoneNumber: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          profilePictureUrl: reader.result,
          profilePicture: file
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert(t('uploadValidImg'));
    }
  };

  const onChangeEmail = (e) => {
    const currentEmail = e.target.value;
    setFormData({ ...formData, email: currentEmail });

    const emailRegTest = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    if (!emailRegTest.test(currentEmail)) {
      setMessages({ ...messages, emailMessage: t('invalidEmail') });
      setValidity({ ...validity, isEmail: false });
    } else {
      setMessages({ ...messages, emailMessage: "" });
      setValidity({ ...validity, isEmail: true });
    }
  };

  const onChangePassword = (e) => {
    const currentPassword = e.target.value;
    setFormData({ ...formData, password: currentPassword });

    const passwordRegTest = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    if (!passwordRegTest.test(currentPassword)) {
      setMessages({ ...messages, passwordMessage: t('passwordFormatError') });
      setValidity({ ...validity, isPassword: false });
    } else {
      setMessages({ ...messages, passwordMessage: t('passwordValid') });
      setValidity({ ...validity, isPassword: true });
    }
  };

  const onChangePasswordCheck = (e) => {
    const currentPasswordCheck = e.target.value;
    setFormData({ ...formData, passwordCheck: currentPasswordCheck });

    if (formData.password !== currentPasswordCheck) {
      setMessages({ ...messages, passwordCheckMessage: t('passwordMismatch') });
      setValidity({ ...validity, isPasswordCheck: false });
    } else {
      setMessages({ ...messages, passwordCheckMessage: t('passwordMatch') });
      setValidity({ ...validity, isPasswordCheck: true });
    }
  };

  const onChangePhone = (e) => {
    const currentPhoneNumber = e.target.value;
    setFormData({ ...formData, phoneNumber: currentPhoneNumber });

    const phoneRegTest = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
    if (!phoneRegTest.test(currentPhoneNumber)) {
      setMessages({ ...messages, phoneNumberMessage: t('phoneNumberFormatError') });
      setValidity({ ...validity, isPhoneNumber: false });
    } else {
      setMessages({ ...messages, phoneNumberMessage: t('phoneNumberValid') });
      setValidity({ ...validity, isPhoneNumber: true });
    }
  };

  const handleSUSubmit = async (e) => {
    e.preventDefault();

    if (!validity.isEmail || !validity.isPassword || !validity.isPasswordCheck || !validity.isPhoneNumber) {
      alert(t('plzWriteAll'));
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await registerUser(data);
      if (response.success) {
        onRequestClose();
        navigate("/");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("error : ", error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await sendEmailVerification(formData.email);
      if (response === t("serverResponseEmailExists")) {
        setMessages({ ...messages, emailMessage: t("emailExists") });
        setValidity({ ...validity, isEmail: false });
      } else {
        setMessages({ ...messages, emailMessage: t("verificationSent") });
        setValidity({ ...validity, isEmail: true });
        setIsCodeInputVisible(true);
      }
    } catch (error) {
      console.error("error : ", error);
      setMessages({ ...messages, emailMessage: t("serverError") });
      setValidity({ ...validity, isEmail: false });
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await confirmEmailVerification(formData.email, verificationCode);
      alert(response);
    } catch (error) {
      console.error("error : ", error);
    }
  };

  useEffect(() => {
    if (isCodeInputVisible) {
      time.current = 300;
      setMin(5);
      setSec(0);
      setIsTimerExpired(false);

      timerId.current = setInterval(() => {
        setMin(parseInt(time.current / 60));
        setSec(time.current % 60);
        time.current -= 1;
      }, 1000);

      return () => clearInterval(timerId.current);
    }
  }, [isCodeInputVisible]);

  useEffect(() => {
    if (time.current <= 0 && timerId.current) {
      console.log("타이머 시간 끝!!!!!");
      clearInterval(timerId.current);
      setIsTimerExpired(true);
    }
  }, [sec]);

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleLanguageChange = (event) => {
    setFormData({ ...formData, language: event.target.value });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      style={isMobile ? mobileStyles : customStyles} 
      contentLabel="Signup Modal"
    >
      <div className="flex justify-end">
        <button className="text-2xl font-bold" onClick={onRequestClose}>&times;</button>
      </div>
      <div className="flex justify-center items-center">
        <div className="bg-white w-full p-4 rounded-xl">
          <h1 className="font-medium text-2xl text-center mb-6">{t("signup")}</h1>
          <form onSubmit={handleSUSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="flex justify-center items-center mb-6">
                <img src={logo} className="w-64" alt="ourhour logo" />
              </div>
              <div className="text-sm text-center">
                <label htmlFor="profilePicture" className="block text-black text-center">{t("picture")}</label>
                <div
                  className="flex items-center justify-center w-full h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 sm:w-64 sm:h-64 lg:w-96 lg:h-96"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    {formData.profilePictureUrl ? (
                      <img src={formData.profilePictureUrl} alt="Profile Preview" className="object-cover w-full h-full rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <span className="text-4xl">+</span>
                        <p className="text-sm">{t("uploadImg")}</p>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  name="profilePicture"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm">
                <label htmlFor="nickName" className="block text-black text-left">{t("nickname")}</label>
                <input
                  type="text"
                  name="nickName"
                  id="nickName"
                  value={formData.nickName}
                  onChange={handleChange}
                  className="rounded-sm px-2 py-2 mt-1 focus:outline-none bg-gray-100 w-full"
                  placeholder={t("nickname")}
                />
              </div>
              <div className="text-sm">
                <label htmlFor="email" className="block text-black text-left">{t("email")}</label>
                <div className="relative flex mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={onChangeEmail}
                    className="rounded-sm px-2 py-2 mt-1 focus:outline-none bg-gray-100 w-full pr-20"
                    placeholder={t("email")}
                  />
                  <button
                    className="absolute right-1 top-1 text-center text-white bg-gray-800 px-1 py-1 mt-1 duration-300 rounded-sm hover:bg-black"
                    onClick={handleEmailSubmit}
                  >
                    {t("getVerify")}
                  </button>
                </div>
                <p className="errorMsg mt-1 text-red-600">{messages.emailMessage}</p>
              </div>
              {isCodeInputVisible && (
                <div className="text-sm">
                  <label htmlFor="emainCheck" className="flex justify-end block text-black">{t("writeVerify")}</label>
                  <div className="relative flex mt-1 justify-end">
                    <input
                      type="text"
                      name="emainCheck"
                      id="emainCheck"
                      value={verificationCode}
                      onChange={handleCodeChange}
                      className="rounded-sm px-2 py-2 focus:outline-none bg-gray-100 w-48 pr-24"
                      placeholder={t("verify")}
                    />
                    <button
                      className="absolute right-1 top-1 text-center text-white bg-gray-800 px-2 py-1 duration-300 rounded-sm hover:bg-black"
                      onClick={handleCodeSubmit}
                      disabled={isTimerExpired}
                    >
                      {t("checkVerify")}
                    </button>
                    <p className="timer mt-1 text-red-600 grid place-items-center absolute right-16 top-1">{min}:{sec}</p>
                  </div>
                </div>
              )}
              <div className="text-sm">
                <label htmlFor="password" className="block text-black text-left">{t("password")}</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={onChangePassword}
                  className="rounded-sm px-2 py-2 mt-1 focus:outline-none bg-gray-100 w-full"
                  placeholder={t("password")}
                />
                <p className="errorMsg mt-1 text-lg text-red-600">{messages.passwordMessage}</p>
              </div>
              <div className="text-sm">
                <label htmlFor="passwordCheck" className="block text-black text-left">{t("checkPassword")}</label>
                <input
                  type="password"
                  name="passwordCheck"
                  id="passwordCheck"
                  value={formData.passwordCheck}
                  onChange={onChangePasswordCheck}
                  className="rounded-sm px-2 py-2 mt-1 focus:outline-none bg-gray-100 w-full"
                  placeholder={t("checkPassword")}
                />
                <p className="errorMsg mt-1 text-lg text-red-600">{messages.passwordCheckMessage}</p>
              </div>
              <div className="text-sm">
                <label htmlFor="phoneNumber" className="block text-black text-left">{t("phoneCall")}</label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={onChangePhone}
                  className="rounded-sm px-2 py-2 mt-1 focus:outline-none bg-gray-100 w-full"
                  placeholder={t("phoneCall")}
                />
                <p className="errorMsg mt-1 text-lg text-red-600">{messages.phoneNumberMessage}</p>
              </div>
              <div className="text-sm">
                <label htmlFor="gender" className="block text-black text-left">{t("gender")}</label>
                <div className="flex items-center mt-2">
                  <label className="inline-flex items-center mr-2">
                    <input
                      type="radio"
                      name="gender"
                      value="none"
                      className="mr-1"
                      defaultChecked
                      onChange={handleChange}
                    />
                    <span className="radio-label animate">{t("noCheck")}</span>
                  </label>
                  <label className="inline-flex items-center mr-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className="mr-1"
                      onChange={handleChange}
                    />
                    <span className="radio-label animate">{t("man")}</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="mr-1"
                      onChange={handleChange}
                    />
                    <span className="radio-label animate">{t("woman")}</span>
                  </label>
                </div>
              </div>
              <div className="text-sm">
                <FormControl fullWidth>
                  <InputLabel id="language-select-label">{t("language")}</InputLabel>
                  <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={formData.language}
                    label="Language"
                    onChange={handleLanguageChange}
                  >
                    <MenuItem value="korean">{t("korean")}</MenuItem>
                    <MenuItem value="english">{t("english")}</MenuItem>
                    <MenuItem value="japanese">{t("japanese")}</MenuItem>
                    <MenuItem value="chinese">{t("chinese")}</MenuItem>
                    <MenuItem value="spanish">{t("spanish")}</MenuItem>
                    <MenuItem value="arabic">{t("arabic")}</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-span-1 lg:col-span-2">
                <button
                  className="block text-center text-white bg-gray-800 p-2 duration-300 rounded-sm hover:bg-black w-full"
                  type="submit"
                >
                  {t("signup")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

SignupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default SignupModal;
