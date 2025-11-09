import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./pages/MainLayout";
import Community from "./pages/Community";
import PostList from "./components/posts/PostList";
import Tools from "./pages/Tools";
import RewardsRedeem from "./pages/RewardsRedeem";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import PollutionHeatmap from "./pages/PollutionHeatmap";
import EditProfile from "./pages/EditProfile";
import ProtectedRoutes from "./pages/ProtectedRoutes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/community",
        element: <Community />,
      },
      {
        path: "/tools",
        element: <Tools />,
      },
      {
        path: "/postlist",
        element: <PostList />,
      },
      {
        path: "/community",
        element: <Community />,
      },
      {
        path: "/redeem",
        element: <RewardsRedeem />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/map",
        element: <PollutionHeatmap />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
