import React from "react";
import { useTranslation } from "react-i18next";
import kakaoLogin from "../../assets/kakao_login.png";

function Kakao() {
    const { t } = useTranslation();

    //rest api key : 이거 현재 내 rest api key
    const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
    //redirect uri
    const REDIRECT_URI = "http://localhost:3000/auth";
    // 배포환경
    // const REDIRECT_URI = process.env.REACT_PP_REDIRECT_URI;

    //oauth 요청 url
    const Kakao_Oauth_Url = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    //내 Client secret code
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

    const handleKakaoLogin = () => {
        window.location.href = Kakao_Oauth_Url;
    }

    return (
        <>
            <img src={kakaoLogin} onClick={handleKakaoLogin} className="h-10 w-52 ml-6 cursor-pointer" />
        </>
    )
}

export default Kakao;
