import NewPostList from "@/components/posts/NewPostList";
import PostList from "@/components/posts/PostList";
import { useState } from "react";
import { Plus, X, Search, Filter, ArrowUpDown } from "lucide-react";
import CreatePost from "@/components/posts/CreatePost";

const Home = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, severity-high, severity-medium, severity-low
  const [showSortMenu, setShowSortMenu] = useState(false);

  const getSortLabel = () => {
    switch (sortBy) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "severity-high":
        return "High Severity";
      case "severity-medium":
        return "Medium Severity";
      case "severity-low":
        return "Low Severity";
      default:
        return "Sort by";
    }
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          Environmental Feed
        </h1>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, post details, or location..."
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center justify-between min-w-[180px] px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-sm font-medium">{getSortLabel()}</span>
              </div>
              <Filter className="h-4 w-4" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20 min-w-[180px]">
                <div className="py-1">
                  {[
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                    { value: "severity-high", label: "High Severity" },
                    { value: "severity-medium", label: "Medium Severity" },
                    { value: "severity-low", label: "Low Severity" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                        sortBy === option.value
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || sortBy !== "newest") && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchQuery && (
              <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
                <Search className="h-3 w-3" />
                <span>Search: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-green-900 dark:hover:text-green-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {sortBy !== "newest" && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                <ArrowUpDown className="h-3 w-3" />
                <span>Sort: {getSortLabel()}</span>
                <button
                  onClick={() => setSortBy("newest")}
                  className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Post Button */}
      {showPostForm ? (
        <>
          <button
            onClick={() => setShowPostForm(false)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
          <CreatePost open={showPostForm} setOpen={setShowPostForm} />
        </>
      ) : (
        <button
          onClick={() => setShowPostForm(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Post List with Search and Sort */}
      {/* <NewPostList searchQuery={searchQuery} sortBy={sortBy} /> */}
      <NewPostList searchQuery={searchQuery} sortBy={sortBy} />

      {/* Click outside to close sort menu */}
      {showSortMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </div>
  );
};

export default Home;
