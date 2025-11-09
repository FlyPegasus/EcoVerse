import { Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user, userProfile } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent animate-pulse-slow relative group">
                Eco
                <span className="text-green-600 dark:text-green-400">
                  Verse
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-500"></span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => navigate("/redeem")}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Rewards"
              >
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">
                  <span>{user?.ecoPoints || 0}</span> ECO Coins
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
