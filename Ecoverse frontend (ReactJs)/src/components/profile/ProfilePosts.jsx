import React, { useState } from "react";
// import { Post } from "../../types";
import { Heart, Eye, TrendingUp, List } from "lucide-react";

const ProfilePosts = ({ posts }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("latest");

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Popular - combines likes and views
      return b.likes + b.views * 0.1 - (a.likes + a.views * 0.1);
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Latest Posts</h2>

        <div className="flex items-center mt-4 sm:mt-0">
          <div className="mr-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`px-3 py-1.5 ${
                viewMode === "grid"
                  ? "bg-green-100 text-green-800"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <TrendingUp size={18} />
            </button>
            <button
              className={`px-3 py-1.5 ${
                viewMode === "list"
                  ? "bg-green-100 text-green-800"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-1 mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Heart size={14} />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Eye size={14} />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center border-b border-gray-100 pb-4"
            >
              {post.image && (
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {post.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="mr-3">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="mr-3">{post.category}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Heart size={16} />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Eye size={16} />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;
