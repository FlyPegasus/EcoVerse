import React from "react";
// import { UserStats } from "../../types";
import { TrendingUp, ThumbsUp, Eye, FileText, Leaf } from "lucide-react";

const ProfileStats = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Community Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Engagement</h3>
              <TrendingUp size={20} className="text-green-600" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span className="flex items-center">
                    <ThumbsUp size={16} className="mr-2" />
                    Total Likes
                  </span>
                  <span className="font-medium">{stats.totalLikes}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${Math.min(stats.totalLikes / 20, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    Total Views
                  </span>
                  <span className="font-medium">{stats.totalViews}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(stats.totalViews / 200, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Activity</h3>
              <FileText size={20} className="text-green-600" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span className="flex items-center">
                    <FileText size={16} className="mr-2" />
                    Posts This Month
                  </span>
                  <span className="font-medium">{stats.postsThisMonth}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${Math.min(stats.postsThisMonth * 10, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span className="flex items-center">
                    <Leaf size={16} className="mr-2" />
                    Eco Impact
                  </span>
                  <span className="font-medium">{stats.ecoImpact}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${stats.ecoImpact}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Monthly Activity
        </h3>
        <div className="h-40 flex items-end space-x-2">
          {Array.from({ length: 12 }).map((_, i) => {
            const height = Math.floor(Math.random() * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-sm ${
                    i === 3 ? "bg-green-600" : "bg-green-300"
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(2024, i, 1).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
