import { useState } from "react";
import {
  Home,
  Users,
  Map,
  Settings,
  PenTool as Tool,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Users, label: "Community", id: "community" },
  { icon: Map, label: "Map", id: "map" },
  { icon: Tool, label: "Tools", id: "tools" },
  { icon: Settings, label: "Profile", id: "settings" },
  { icon: LogOut, label: "Logout", id: "logout" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false);
  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      // setOpen(true);
    } else if (textType === "Map") {
      navigate("/map");
    } else if (textType === "Community") {
      navigate("/community");
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Tools") {
      navigate("/tools");
    }
  };
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        // dispatch(setSelectedPost(null));
        // dispatch(setPosts([]));
        navigate("/login");
        console.log(res.data);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <nav className="mt-12">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  // onClick={() => {
                  //   onNavigate(item.id);
                  //   setIsOpen(false);
                  // }}
                  onClick={() => {
                    sidebarHandler(item.label);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    // currentPage === item.id
                    "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                    // : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
