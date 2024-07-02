import React, { useState, useEffect } from "react";
import Footer from "../../components/footer/Footer";
import TopNav from "../../components/topnav/TopNav";
import axios from "axios";
import { Link } from "react-router-dom";
import people from "../../assets/people.jpg";
import { useTranslation } from "react-i18next";

function FindPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/findpassword", { email });
      if (response) {
        setMessage("비밀번호 재설정 이메일을 보냈습니다.");
        console.log(response);
      } else {
        setError("이메일 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setError("서버 에러가 발생했습니다. 나중에 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <TopNav />
      <div className="relative min-h-screen flex">
        <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
          {!isMobile && (
            <div className="sm:w-1/2 xl:w-3/5 h-full md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative">
              <img src={people} alt="sidebackground" className="h-full w-full object-cover absolute" />
            </div>
          )}
          <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 mt-40">
            <div className="py-8 px-8 rounded-xl">
              <h1 className="font-medium text-2xl sm:text-3xl lg:text-4xl mt-3 text-center">{t("passwordFind")}</h1>
              <h5 className="mt-3 text-sm sm:text-base lg:text-lg text-center">
                {t("writeUrEmail")}
                <br />
                {t("sendEmail")}
                <br />
              </h5>
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="my-5 text-sm sm:text-base lg:text-lg">
                  <label htmlFor="email" className="block text-black text-left">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full text-lg sm:text-xl lg:text-2xl"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full text-lg sm:text-xl lg:text-2xl"
                >
                  {t("getVerify")}
                </button>
                {message && <p className="text-green-500 mt-2">{message}</p>}
              </form>
              <p className="mt-12 text-sm sm:text-base lg:text-lg text-center font-light text-gray-400">
                {t("haveAccount")}{" "}
                <Link to="/login" className="text-blue-800 font-semibold">
                  {t("login")}
                </Link>
              </p>
              <p className="mt-2 text-sm sm:text-base lg:text-lg text-center font-light text-gray-400">
                {t("haveNoAccount")}{" "}
                <Link to="/signup" className="text-blue-800 font-semibold">
                  {t("signup")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FindPassword;
