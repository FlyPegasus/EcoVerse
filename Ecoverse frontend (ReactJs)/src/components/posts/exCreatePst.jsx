import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Upload, X, Loader2, MapPin, Camera, Send } from "lucide-react";
// import { useToast } from "../ui/toast";
import axios from "axios";
import { toast } from "sonner";

const CreatePost = ({ open, setOpen, onPostCreated }) => {
  // const { addToast } = useToast();
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state ||
            data.address.country;
          setLocationName(city || "Unknown Location");
          setLocationError("");
        } catch (err) {
          setLocationError("Failed to fetch location name.");
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationError("Permission denied or error getting location.");
        setLocationLoading(false);
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

  const resetForm = () => {
    setCaption("");
    setImagePreview(null);
    setFile(null);
    setLocation(null);
    setLocationName("");
    setLocationError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast("Please select an image", "error");
      return;
    }

    if (!location) {
      toast("Please get your location", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", file);
      formData.append("locationLatitude", location.latitude.toString());
      formData.append("locationLongitude", location.longitude.toString());
      formData.append("locationName", locationName);

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
        toast("Post created successfully!", "success");

        // Create a new post object for immediate UI update
        const newPost = {
          _id: res.data.post?._id || Date.now().toString(),
          author: {
            _id: "current_user",
            username: "You",
            profilePicture:
              "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
          },
          analysedImage: imagePreview,
          caption,
          locationName,
          severity: {
            level: "moderate",
            score: 50,
          },
          likes: [],
          comments: [],
          createdAt: new Date(),
        };

        // Call the callback to update the parent component
        if (onPostCreated) {
          onPostCreated(newPost);
        }

        resetForm();
        setOpen(false);
      }
    } catch (error) {
      toast(error.response?.data?.message || "Failed to create post", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Camera className="h-6 w-6" />
            Share Environmental Post
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Caption Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe the environmental issue
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What environmental issue did you observe? Provide details about the location, severity, and impact..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Evidence Photo
            </label>
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center">
                  <button
                    type="button"
                    onClick={clearImage}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 transform scale-90 hover:scale-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-200 group"
              >
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-green-500 transition-colors" />
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                  Click to upload pollution evidence
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  PNG, JPG up to 10MB
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
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location Information
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
              >
                {locationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                {locationLoading
                  ? "Getting Location..."
                  : "Get Current Location"}
              </button>

              {locationName && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {locationName}
                  </span>
                </div>
              )}

              {locationError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {locationError}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || !location || loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post & Analyze
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
