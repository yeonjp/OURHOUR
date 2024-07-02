import React, { Suspense, lazy } from "react";
import Loading from "../components/loading/Loading";
import PrivateRoute from "../components/PrivateRoute"; // PrivateRoute 컴포넌트 임포트

const VideoRoomListPage = lazy(() => import("../pages/VideoRoomListPage"));
const VideoMeetingPage = lazy(() => import("../pages/VideoMeetingPage")); //방목록에서 누르기
const JoinRoom = lazy(() => import("../pages/VideoJoinRoom"));

// webRtc 관련 링크
const router1 = [
  {
    // videoMeeting
    path: "/video",
    element: (
      <Suspense fallback={<Loading />}>
        <PrivateRoute element={<VideoMeetingPage />} />
      </Suspense>
    ),
  },
  {
    // 방 목록
    path: "/roomlist",
    element: (
      <Suspense fallback={<Loading />}>
        <PrivateRoute element={<VideoRoomListPage />} />
      </Suspense>
    ),
  },
  {
    // JoinRoom
    path: "/joinRoom",
    element: (
      <Suspense fallback={<Loading />}>
        <PrivateRoute element={<JoinRoom />} />
      </Suspense>
    ),
  },
];

export default router1;
