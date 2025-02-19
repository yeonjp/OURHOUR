import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import newLogo from "../../assets/new_logo.png"; // 새로운 로고 이미지 경로
import { MdOutlineLanguage } from "react-icons/md";
import i18next from "../../locales/i18n";
import { useTranslation } from "react-i18next";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import LoginModal from "../modal/LoginModal";

function TopNav() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // 로그인 상태 확인
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const nickName = localStorage.getItem("nickName");
  const profileImage = localStorage.getItem("profileImage");

  const handleLogoClick = () => navigate("/");
  const handleMyPage = () => navigate("/mypage");
  const handleVideoAudioSettings = () => navigate("/settings/VideoAudioSetting");

  const clickHandler = (lang) => i18next.changeLanguage(lang);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const toggleSubmenu = (submenu) => {
    setSubmenuOpen((prev) => (prev === submenu ? null : submenu));
  };

  const closeSubmenu = () => {
    setSubmenuOpen(null);
  };

  const handleProtectedLinkClick = (path) => {
    if (token) {
      navigate(path);
    } else {
      openLoginModal();
    }
  };

  return (
    <header className="flex justify-between items-center bg-black p-4 z-50">
      {/* 로고 */}
      <div className="flex-shrink-0">
        <button className="focus:outline-none" onClick={handleLogoClick}>
          <img src={newLogo} alt="New Logo" className="h-9" />
        </button>
      </div>

      {/* 네비게이션 아이템 */}
      <nav className="hidden md:flex items-center space-x-4 text-white">
        <button
          className="hover:text-blue-500"
          onClick={() => handleProtectedLinkClick("/video")}
        >
          {t("room")}
        </button>
        <button
          className="hover:text-blue-500"
          onClick={() => handleProtectedLinkClick("/roomList")}
        >
          {t("list")}
        </button>
        <div className="relative">
          <button
            className="hover:text-blue-500"
            onClick={() => toggleDropdown("about")}
          >
            {t("About")}
          </button>
          {activeDropdown === "about" && (
            <div className="absolute bg-black mt-1 rounded-md shadow-lg z-50 flex flex-col p-2 whitespace-nowrap text-xs md:text-sm lg:text-base">
              <Link
                to="/announcement"
                className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
              >
                {t("notice")}
              </Link>
              <Link
                to="/customerService"
                className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
              >
                {t("customerCenter")}
              </Link>
            </div>
          )}
        </div>

        {token && (
          <div className="relative">
            <button
              className="hover:text-blue-500"
              onClick={() => toggleDropdown("mypage")}
            >
              {t("mypage")}
            </button>
            {activeDropdown === "mypage" && (
              <div
                className="absolute bg-black mt-1 rounded-md shadow-lg z-50 flex flex-col p-2 whitespace-nowrap text-xs md:text-sm lg:text-base"
              >
                <Link
                  to="/mypage"
                  className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
                >
                  {t("myPageProfile")}
                </Link>
                <Link
                  to="/ProfileSettings"
                  className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
                >
                  {t("profile")}
                </Link>
                <Link
                  to="/invite"
                  className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
                >
                  {t("addFriend")}
                </Link>
                <Link
                  to="/friendMain"
                  className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
                >
                  {t("FriendList")}
                </Link>
              </div>
            )}
          </div>
        )}
        <div className="relative">
          <button
            className="hover:text-blue-500"
            onClick={handleVideoAudioSettings}
          >
            {t("avTest")}
          </button>
        </div>

        <div className="relative">
          <button
            className="hover:text-blue-500"
            onClick={() => toggleDropdown("language")}
          >
            <MdOutlineLanguage />
          </button>
          {activeDropdown === "language" && (
            <div className="absolute bg-black mt-1 rounded-md shadow-lg z-50 flex flex-col p-2 whitespace-nowrap text-xs md:text-sm lg:text-base">
              <button
                onClick={() => {
                  clickHandler("ko");
                  setSidebarOpen(false);
                }}
                className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
              >
                한국어
              </button>
              <button
                onClick={() => {
                  clickHandler("en");
                  setSidebarOpen(false);
                }}
                className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
              >
                ENGLISH
              </button>
              <button
                onClick={() => {
                  clickHandler("ar");
                  setSidebarOpen(false);
                }}
                className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
              >
                عربي
              </button>
              <button
                onClick={() => {
                  clickHandler("ja");
                  setSidebarOpen(false);
                }}
                className="block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:bg-gray-700"
              >
                にっぽんご
              </button>
            </div>
          )}
        </div>

        {/* 로그인 했을때 로그아웃으로 변경 / 프로필, 닉네임 추가 */}
        <div className="flex items-center space-x-4">
          {token ? (
            <div className="flex items-center space-x-2">
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
                sx={{ "& .MuiBadge-dot": { backgroundColor: "#00FF00" } }}
              >
                <Avatar
                  src={profileImage}
                  alt="profileImage"
                  className="w-8 h-8"
                />
              </Badge>
              <span className="text-white">{nickName} 님</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-2 rounded-md hover:bg-red-700"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="bg-blue-500 px-3 py-2 rounded-md text-white hover:bg-blue-700"
            >
              {t("login")}
            </button>
          )}
        </div>
      </nav>

      {/* 햄버거 메뉴 버튼 */}
      <div className="flex md:hidden">
        <button
          className="text-white text-2xl focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          &#9776;
        </button>
      </div>

      {/* 햄버거 메뉴 */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          <button
            className="text-white text-6xl absolute top-1 right-1 focus:outline-none" // 크기를 키운 X 버튼
            onClick={() => setSidebarOpen(false)}
          >
            &times;
          </button>
          {!submenuOpen ? (
            <div className="flex flex-col items-center space-y-6">
              <button
                className="text-white text-lg hover:text-blue-500"
                onClick={() => handleProtectedLinkClick("/video")}
              >
                {t("room")}
              </button>
              <button
                className="text-white text-lg hover:text-blue-500"
                onClick={() => handleProtectedLinkClick("/roomList")}
              >
                {t("list")}
              </button>
              <button
                className="text-white text-lg hover:text-blue-500"
                onClick={() => toggleSubmenu("about")}
              >
                {t("About")}
              </button>
              <button
                className="text-white text-lg hover:text-blue-500"
                onClick={() => toggleSubmenu("language")}
              >
                <MdOutlineLanguage />
              </button>
              {token && (
                <button
                  className="text-white text-lg hover:text-blue-500"
                  onClick={() => toggleSubmenu("mypage")}
                >
                  {t("mypage")}
                </button>
              )}
              <button
                className="text-white text-lg hover:text-blue-500"
                onClick={handleVideoAudioSettings}
              >
                {t("avTest")}
              </button>
              {/* 로그인 상태에 따라 로그인/로그아웃 버튼 표시 */}
              <div className="flex items-center space-x-4">
                {token ? (
                  <div className="flex items-center space-x-2">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                      sx={{ "& .MuiBadge-dot": { backgroundColor: "#00FF00" } }}
                    >
                      <Avatar
                        src={profileImage}
                        alt="profileImage"
                        className="w-8 h-8"
                      />
                    </Badge>
                    <span className="text-white">{nickName} 님</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 px-3 py-2 rounded-md hover:bg-red-700"
                    >
                      {t("logout")}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="bg-blue-500 px-3 py-2 rounded-md text-white hover:bg-blue-700"
                  >
                    {t("login")}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <button
                className="text-white text-2xl hover:text-blue-500"
                onClick={closeSubmenu}
              >
                &larr;
              </button>
              {submenuOpen === "about" && (
                <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4 mt-2">
                  <Link
                    to="/announcement"
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t("notice")}
                  </Link>
                  <Link
                    to="/customerService"
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t("customerCenter")}
                  </Link>
                </div>
              )}
              {submenuOpen === "language" && (
                <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4 mt-2">
                  <button
                    onClick={() => {
                      clickHandler("ko");
                      setSidebarOpen(false);
                    }}
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                  >
                    KOREAN
                  </button>
                  <button
                    onClick={() => {
                      clickHandler("en");
                      setSidebarOpen(false);
                    }}
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                  >
                    ENGLISH
                  </button>
                  <button
                    onClick={() => {
                      clickHandler("ar");
                      setSidebarOpen(false);
                    }}
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                  >
                    عربي
                  </button>
                  <button
                    onClick={() => {
                      clickHandler("ja");
                      setSidebarOpen(false);
                    }}
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                  >
                    にっぽんご
                  </button>
                </div>
              )}
              {submenuOpen === "mypage" && (
                <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4 mt-2">
                  <Link
                    to="/mypage"
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t("myPageProfile")}
                  </Link>
                  <Link
                    to="/ProfileSettings"
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t("profile")}
                  </Link>
                  <Link
                    to="/invite"
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t("addFriend")}
                  </Link>
                  <Link
                    to="/friendMain"
                    className="block text-white text-lg px-4 py-2 hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t("FriendList")}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* 로그인 모달 창 */}
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
    </header>
  );
}

export default TopNav;
