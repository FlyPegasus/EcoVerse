import React from "react";
// import { User as UserType } from "../../types";
import {
  Calendar,
  Users,
  FileText,
  Award,
  ExternalLink,
  Edit2,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-green-800 to-green-500 relative">
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="px-6 py-6 relative">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-6 border-4 border-white rounded-full shadow-lg overflow-hidden">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-32 h-32 object-cover"
          />
        </div>

        <div className="ml-36 pb-6 mb-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h1>
              <p className="text-gray-600 mt-1">{user.bio}</p>
            </div>

            <div className="flex mt-4 sm:mt-0">
              <Link
                to="/profile/edit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mr-2 flex items-center"
              >
                <Edit2 size={18} className="mr-1" />
                Edit Profile
              </Link>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center text-gray-600">
              <Users size={18} className="mr-2" />
              <span>
                <strong>{user.followers}</strong> Followers
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users size={18} className="mr-2" />
              <span>
                <strong>{user.following}</strong> Following
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <FileText size={18} className="mr-2" />
              <span>
                <strong>{user?.imgposts.length || 0}</strong> Posts
              </span>
            </div>
            <div className="flex items-center text-green-700">
              <Award size={18} className="mr-2" />
              <span>
                <strong>{user.ecoPoints}</strong> Eco Coins
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-2" />
              <span>
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
