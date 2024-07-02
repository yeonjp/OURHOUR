// ProfileCard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import ClearIcon from '@mui/icons-material/Clear';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

function ProfileCard() {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState({
    email: '',
    gender: '',
    profileImage: '',
    phoneNumber: '',
    nickName: ''
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserInfo = () => {
      const email = localStorage.getItem('email');
      let gender = localStorage.getItem('gender');
      const profileImage = localStorage.getItem('profileImage');
      const phoneNumber = localStorage.getItem('phoneNumber');
      const nickName = localStorage.getItem('nickName');

      if (gender === undefined || gender === 'undefined' || gender === null) {
        gender = 'none';
      }

      setUserInfo({
        email: email || '',
        gender: gender || 'none',
        profileImage: profileImage || '',
        phoneNumber: phoneNumber || 'undefined',
        nickName: nickName || ''
      });
    };

    loadUserInfo();

    window.addEventListener('storage', loadUserInfo);

    return () => {
      window.removeEventListener('storage', loadUserInfo);
    };
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === 'undefined') return t('addPhoneNumber');
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const handleProfileSettings = () => {
    const loginType = localStorage.getItem('loginType');
    if (loginType === 'LOCAL') {
      navigate('/profileSettings');
    } else if (loginType === 'KAKAO' || loginType === 'GOOGLE') {
      navigate('/SocialProfileSettings');
    }
  };

  const renderGenderIcon = () => {
    let iconStyle = { fontSize: '45px' };
    switch (userInfo.gender) {
      case 'male':
        iconStyle.color = 'blue';
        return <ManIcon style={iconStyle} />;
      case 'female':
        iconStyle.color = 'pink';
        return <WomanIcon style={iconStyle} />;
      case 'none':
      default:
        iconStyle.color = isDarkMode ? 'white' : 'black';
        return <ClearIcon style={iconStyle} />;
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`font-sans antialiased leading-normal tracking-wider ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen pt-16`}> {/* 상단 여백 추가 */}
      <div className="flex flex-col lg:flex-row items-center h-auto lg:h-screen flex-wrap mx-0 lg:mx-auto pt-16 pb-20 lg:my-0">
        <div id="profile" className={`w-full lg:w-2/3 rounded-lg lg:rounded-r-none shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} opacity-75 border ${isDarkMode ? 'border-gray-800' : 'border-white'} overflow-hidden`}>
          <div className="p-4 md:p-8 text-center lg:text-left">
            <div className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-32 w-32 bg-cover bg-center border border-white" style={{ backgroundImage: `url(${userInfo.profileImage || 'https://source.unsplash.com/MP0IUfwrn0A'})` }}></div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold pt-8 mb-2 lg:pt-0">{userInfo.nickName}</h1>
            <div className={`mx-auto lg:mx-0 w-full pt-1 mt-5 border-b-2 ${isDarkMode ? 'border-white' : 'border-gray-900'}`}></div>
            <div className="pt-5 text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-center lg:justify-start">
              <EmailIcon className="mr-2" style={{ fontSize: 24 }} />
              {t("email")}: {userInfo.email}
            </div>
            <div className="pt-5 text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-center lg:justify-start">
              <PersonIcon className="mr-2" style={{ fontSize: 24 }} />
              {t("gender")}: <span className={userInfo.gender === 'none' ? `${isDarkMode ? 'text-white' : 'text-black'}` : ''}>{renderGenderIcon()}</span>
            </div>
            <div className="pt-5 text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-center lg:justify-start">
              <PhoneIcon className="mr-2" style={{ fontSize: 24 }} />
              {t("phoneCall")}: {formatPhoneNumber(userInfo.phoneNumber)}
            </div>
            <div className="pt-10 pb-8">
              <button
                className="bg-gray-700 hover:bg-gray-950 text-lg sm:text-xl lg:text-2xl text-white font-bold py-3 px-6 rounded-full block mx-auto mt-8"
                onClick={handleProfileSettings}
                style={{ width: '200px' }}
              >
                {t("profileEdit")}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
          <img src={userInfo.profileImage} className="h-[200px] sm:h-[300px] lg:h-[500px] rounded-lg lg:rounded-none shadow-2xl mx-auto lg:mx-0 border border-white" alt="Profile" />
        </div>
        <div className="absolute top-16 right-3 h-12 w-18 p-4"> {/* 상단 여백 추가 */}
          <button className="focus:outline-none text-2xl lg:text-5xl" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
