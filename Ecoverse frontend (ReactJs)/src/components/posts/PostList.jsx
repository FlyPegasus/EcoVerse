import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
// import NewPostCard from "./NewPostCard";
import PostCard from "./PostCard";
import { Loader2, Search, Sparkles } from "lucide-react";

// Sample data for initial posts
const initialPosts = [
  {
    _id: "1",
    author: {
      _id: "user1",
      username: "eco_warrior",
      profilePicture:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    analysedImage:
      "https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    caption:
      "Found this plastic waste dumped near the creek. We need to address this before it reaches the ocean!",
    locationName: "Central Park Creek",
    severity: {
      level: "moderate",
      score: 45,
    },
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    _id: "2",
    author: {
      _id: "user2",
      username: "green_activist",
      profilePicture:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    analysedImage:
      "https://images.pexels.com/photos/2873671/pexels-photo-2873671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    caption:
      "Industrial waste being discharged directly into the river. This is unacceptable and needs immediate attention!",
    locationName: "Industrial District River",
    severity: {
      level: "severe",
      score: 92,
    },
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    _id: "3",
    author: {
      _id: "user3",
      username: "earth_guardian",
      profilePicture:
        "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    analysedImage:
      "https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    caption:
      "Air pollution from factories in my neighborhood. The air quality has been getting worse over the past few months.",
    locationName: "Downtown Manufacturing Zone",
    severity: {
      level: "high",
      score: 78,
    },
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    _id: "4",
    author: {
      _id: "user4",
      username: "nature_lover",
      profilePicture:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    analysedImage:
      "https://images.pexels.com/photos/1482101/pexels-photo-1482101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    caption:
      "Littering problem at the beach. Found tons of plastic bottles and bags washed up on shore.",
    locationName: "Sunset Beach",
    severity: {
      level: "low",
      score: 25,
    },
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

const NewPostList = forwardRef(
  ({ searchQuery = "", sortBy = "newest", onPostsUpdate }, ref) => {
    const [posts, setPosts] = useState(initialPosts);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredPosts, setFilteredPosts] = useState(initialPosts);

    const fetchPosts = async (page) => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/post/all?page=${page}&limit=5`
        );
        const fetchedPosts = res.data.posts || initialPosts;
        setPosts(fetchedPosts);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);

        if (onPostsUpdate) {
          onPostsUpdate(fetchedPosts);
        }
      } catch (error) {
        console.log("Failed to fetch posts:", error);
        setPosts(initialPosts);
        setTotalPages(1);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    };

    // Add new post to the beginning of the list
    const addNewPost = (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    // Expose the addNewPost function to parent components
    useImperativeHandle(ref, () => ({
      addNewPost,
    }));

    // Update parent with posts changes
    useEffect(() => {
      if (onPostsUpdate) {
        onPostsUpdate(posts);
      }
    }, [posts, onPostsUpdate]);

    // Filter and sort posts
    useEffect(() => {
      let filtered = [...posts];

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.author.username.toLowerCase().includes(query) ||
            post.caption.toLowerCase().includes(query) ||
            post.locationName.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      switch (sortBy) {
        case "oldest":
          filtered.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "newest":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "severity-high":
          filtered.sort((a, b) => b.severity.score - a.severity.score);
          break;
        case "severity-medium":
          filtered = filtered
            .filter(
              (post) => post.severity.score >= 40 && post.severity.score <= 70
            )
            .sort((a, b) => b.severity.score - a.severity.score);
          break;
        case "severity-low":
          filtered = filtered
            .filter((post) => post.severity.score < 40)
            .sort((a, b) => b.severity.score - a.severity.score);
          break;
        default:
          break;
      }

      setFilteredPosts(filtered);
    }, [posts, searchQuery, sortBy]);

    useEffect(() => {
      fetchPosts(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-green-500" />
            <Sparkles className="h-6 w-6 text-green-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
            Loading environmental posts...
          </span>
          <span className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            Analyzing pollution data
          </span>
        </div>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="relative inline-block">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <Sparkles className="h-6 w-6 text-gray-400 absolute -top-1 -right-1" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No posts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {searchQuery
              ? `No environmental posts match your search for "${searchQuery}". Try different keywords or check your spelling.`
              : "No posts match your current filters. Try adjusting your search criteria."}
          </p>
        </div>
      );
    }

    return (
      <div>
        {/* Search/Filter Results Info */}
        {(searchQuery || sortBy !== "newest") && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Showing {filteredPosts.length} environmental post
                {filteredPosts.length !== 1 ? "s" : ""}
                {searchQuery && ` matching "${searchQuery}"`}
                {sortBy !== "newest" && ` sorted by ${getSortLabel(sortBy)}`}
              </p>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        {!searchQuery && sortBy === "newest" && totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Previous
            </button>

            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => handlePageChange(num + 1)}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === num + 1
                    ? "bg-green-500 text-white shadow-lg transform scale-105"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {num + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
);

// Helper function to get sort label
const getSortLabel = (sortBy) => {
  switch (sortBy) {
    case "newest":
      return "newest first";
    case "oldest":
      return "oldest first";
    case "severity-high":
      return "high severity";
    case "severity-medium":
      return "medium severity";
    case "severity-low":
      return "low severity";
    default:
      return "";
  }
};

NewPostList.displayName = "NewPostList";

export default NewPostList;
