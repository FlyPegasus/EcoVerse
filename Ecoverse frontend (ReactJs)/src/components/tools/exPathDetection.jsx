import { Upload, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const PathDetection = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResultImage(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result); // optional chaining
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const generatePath = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    // Simulate AI processing
    const formData = new FormData();
    if (imagePreview) formData.append("file", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/tree_analyse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // withCredentials: true,
        }
      );
      // console.log(res);
      if (res.data.success) {
        // console.log(res);
        // const blobUrl = URL.createObjectURL(res.data.path);
        // console.log(blobUrl);
        setResultImage(res.data.path);
        // dispatch(setPosts([res.data.post, ...posts])); // [1] -> [1,2] -> total element = 2
        // toast.success(res.data.message);
        // setOpen(false);
      }
    } catch (error) {
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setFile(null);
    setResultImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2 dark:text-white">
        Path Detection Model
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Upload a forest aerial or satellite image to generate optimal paths
        through dense vegetation.
      </p>

      <div className="space-y-6">
        {imagePreview ? (
          <div className="relative mb-3">
            <img
              src={imagePreview}
              alt="Forest aerial view"
              className="w-full h-64 object-cover rounded-lg"
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
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              Upload forest aerial or satellite image
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              JPG, PNG files accepted
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

        {imagePreview && !resultImage && (
          <button
            onClick={generatePath}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            } transition-colors flex items-center justify-center`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Optimal Path...
              </>
            ) : (
              "Generate Optimal Path"
            )}
          </button>
        )}

        {resultImage && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium dark:text-white">
              Generated Path Result
            </h3>
            <div className="border border-green-200 dark:border-green-900 rounded-lg overflow-hidden">
              <img
                src={resultImage}
                alt="Optimal path result"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                Analysis Results
              </h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
                <li>• Optimal path length: 2.7 km</li>
                <li>• Difficulty level: Moderate</li>
                <li>• Estimated travel time: 1 hour 15 minutes</li>
                <li>• Terrain obstacles avoided: 14</li>
              </ul>
            </div>
            <button
              onClick={clearImage}
              className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Upload New Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PathDetection;
