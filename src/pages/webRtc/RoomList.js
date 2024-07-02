import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function initjanus() {
  return new Promise((resolve, reject) => {
    if (!Janus.isWebrtcSupported()) {
      bootbox.alert("No WebRTC support... ");
      reject(new Error("No WebRTC support"));
      return;
    }

    janus = new Janus({
      server: server,
      success: function () {
        janus.attach({
          plugin: "janus.plugin.videoroom",
          opaqueId: opaqueId,
          success: function (pluginHandle) {
            sfutest = pluginHandle;
            resolve(); // Initialization complete
          },
          error: function (error) {
            reject(error);
          }
        });
      },
      error: function (error) {
        reject(error);
      },
      destroyed: function () {
        reject(new Error("Session destroyed"));
      }
    });
  });
}

function RoomList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6); // 한 페이지에 표시할 방 수
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 관리
  const [isRoomNumberBoxOpen, setIsRoomNumberBoxOpen] = useState(false); // 방 번호 입력 박스 상태 관리
  const [roomNumber, setRoomNumber] = useState(""); // 방 번호 상태 관리

  function getRoomList() {
    var body = { request: "list" };
    sfutest.send({
      message: body,
      success: function (result) {
        if (result && result.list) {
          var rooms = result.list;
          console.log("Rooms list: ", rooms);
          setRooms(rooms);
          setFilteredRooms(rooms);
        }
      },
    });
  }

  const handleJoinRoom = (roomId, roomDescription) => {
    console.log(`참가할 방 ID: ${roomId}`);
    console.log("방제목" + roomDescription);
    navigate(`/joinRoom?roomId=${roomId}&roomDescription=${roomDescription}`);
  };

  useEffect(() => {
    console.log("방목록");
    initjanus()
      .then(() => {
        getRoomList();
      })
      .catch((error) => {
        console.error("Failed to initialize Janus:", error);
      });
  }, []);

  const handleSearch = () => {
    const filtered = rooms.filter((room) => room.description.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredRooms(filtered);
  };

  const handleRoomNumberJoin = () => {
    if (roomNumber.trim() !== "") {
      const room = rooms.find((room) => room.room.toString() === roomNumber);
      if (room) {
        navigate(`/joinRoom?roomId=${roomNumber}&roomDescription=${room.description}`);
      } else {
        alert("해당 방 번호를 찾을 수 없습니다.");
      }
    } else {
      alert("방 번호를 입력하세요.");
    }
  };

  // 현재 페이지에 표시할 방 목록 계산
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRefresh = () => {
    getRoomList();
  };

  // 페이지 번호 구성 요소
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 3;

    // 이전 페이지로 돌아가는 버튼 추가
    if (currentPage > 1) {
      pageNumbers.push(
        <li key="prev-button" className="mx-1">
          <button className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white" onClick={handlePrev}>
            &laquo;
          </button>
        </li>
      );
    }

    for (let i = currentPage; i < currentPage + maxPageNumbersToShow && i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className="mx-1">
          <button
            id={i}
            onClick={handleClick}
            className={`px-3 py-1 rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
          >
            {i}
          </button>
        </li>
      );
    }

    if (currentPage + maxPageNumbersToShow < totalPages) {
      pageNumbers.push(
        <li key="right-dots" className="dots mx-1 text-white">
          ...
        </li>
      );
      pageNumbers.push(
        <li key={totalPages} className="mx-1">
          <button
            id={totalPages}
            onClick={handleClick}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    // 다음 페이지로 가는 버튼 추가
    if (currentPage < totalPages) {
      pageNumbers.push(
        <li key="next-button" className="mx-1">
          <button className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white" onClick={handleNext}>
            &raquo;
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-grow justify-center items-center bg-gray-900 py-8 min-h-screen">
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl min-h-[75vh]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0 text-xl sm:text-2xl">{t("goToList")}</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              className="px-4 py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 text-sm sm:text-base"
              onClick={handleRefresh}
            >
              {t("reroll")}
            </button>
            <input
              type="text"
              placeholder={t("search")}
              className="px-4 py-2 border rounded bg-gray-700 text-white text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 text-sm sm:text-base"
              onClick={handleSearch}
            >
              {t("search")}
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 text-sm sm:text-base"
              onClick={() => setIsRoomNumberBoxOpen(true)}
            >
              {t("enterRoomNum")}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRooms.map((room) => (
            <div
              key={room.room}
              className="p-4 bg-gray-700 rounded shadow-md"
              style={{ backgroundColor: "#3C3C3C" }}
            >
              <div>
                <h2 className="text-xl font-semibold text-white text-base sm:text-xl">{room.description}</h2>
                <p className="text-white text-sm sm:text-base">{t("participant")}: {room.num_participants}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 text-sm sm:text-base"
                  onClick={() => handleJoinRoom(room.room, room.description)}
                >
                  {t("talkingRoomMake")}
                </button>
              </div>
            </div>
          ))}
        </div>
        <ul id="page-numbers" className="flex justify-center mt-6 space-x-2 text-white text-sm sm:text-base">
          {renderPageNumbers()}
        </ul>
      </div>

      {isRoomNumberBoxOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsRoomNumberBoxOpen(false)}
        >
          <div className="bg-gray-700 p-6 rounded shadow-lg w-80" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4 text-white text-base sm:text-xl">{t("enterRoomNumber")}</h2>
            <input
              type="text"
              placeholder={t("enterRoomNumber")}
              className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-800 text-white text-sm sm:text-base"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
              onClick={handleRoomNumberJoin}
            >
              {t("enter")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomList;
