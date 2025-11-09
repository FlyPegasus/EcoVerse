import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Upload, X, Loader2 } from "lucide-react";
// import { readFileAsDataURL } from "@/lib/utils";
// import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";

const CreatePost = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locationError, setLocationError] = useState("");
  // const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);
  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Reverse geocode using OpenStreetMap
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state;
          setLocationName(city || "Unknown Location");
          setLocationError("");
        } catch (err) {
          setLocationError("Failed to fetch location name.");
        }
      },
      (err) => {
        setLocationError("Permission denied or error getting location.");
      }
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    formData.append("locationLatitude", location.latitude);
    formData.append("locationLongitude", location.longitude);
    formData.append("locationName", locationName);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUser = res.data.updatedUser;
        dispatch(setPosts([res.data.post, ...posts])); // [1] -> [1,2] -> total element = 2
        dispatch(setAuthUser(updatedUser));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Share Environmental Post
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Describe the environmental issue you've observed..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={3}
            required
          />

          {imagePreview ? (
            <div className="relative mb-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-3 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">
                Click to upload an image of pollution
              </p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {/* Location Button and Display */}
          <div className="mb-3">
            <button
              type="button"
              onClick={handleGetLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Get Location
            </button>
            {locationName && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                Location: {locationName}
              </p>
            )}
            {locationError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {locationError}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!file || loading}
              className={`px-4 py-2 rounded-lg font-medium ${
                !file || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                  : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              } transition-colors flex items-center`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Post & Analyze"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
