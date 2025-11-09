import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, User as UserIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";
import { useRef } from "react";

const EditProfilePage = () => {
  const { userProfile, user } = useSelector((store) => store.auth);
  const currentUser = user?._id === userProfile?._id;
  const fileInputRef = useRef(null);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
    username: user?.username,
  });
  const [imagePreview, setImagePreview] = useState(input.profilePhoto || null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setInput((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const genderChangeHandler = (e) => {
    setInput((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const editProfileHandler = async (e) => {
    console.log(input);
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    formData.append("username", input.username);
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          username: res.data.user?.username,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate(`/profile/${user?._id}`)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 ml-4">
                Edit Profile
              </h1>
            </div>

            <form onSubmit={editProfileHandler} className="space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <UserIcon size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleCameraClick}
                      className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 shadow-lg hover:bg-green-700 transition-colors"
                    >
                      <Camera size={20} className="text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={input.username || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={input.gender || ""}
                  onChange={genderChangeHandler}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={input.bio || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${user?._id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
