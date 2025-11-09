import {
  Upload,
  Loader2,
  X,
  MapPin,
  Clock,
  TreePine,
  Route,
  AlertTriangle,
} from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";

const PathDetection = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [pathResult, setPathResult] = useState(null);
  const [allPathsResult, setAllPathsResult] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [goalPoint, setGoalPoint] = useState({ x: 360, y: 390 });
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPathResult(null);
      setAllPathsResult(null);
      setAnalysisData(null);
      setError(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const generatePath = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("start_x", startPoint.x);
    formData.append("start_y", startPoint.y);
    formData.append("goal_x", goalPoint.x);
    formData.append("goal_y", goalPoint.y);

    try {
      const res = await axios.post(
        "http://localhost:5000/tree_analyse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setPathResult(res.data.path);
        setAllPathsResult(res.data.all_paths);
        setAnalysisData({
          totalGreenArea: res.data.total_green_area,
          totalSteps: res.data.total_steps,
          message: res.data.message,
        });
        toast.success("Path analysis completed successfully!");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError({
          type: "path_not_found",
          message:
            error.response.data.message ||
            "No valid path could be found in the provided image.",
        });
        toast.error("No valid path found in the image");
      } else {
        setError({
          type: "general_error",
          message:
            error.response?.data?.message ||
            "An error occurred while processing the image.",
        });
        toast.error("Failed to process image");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setFile(null);
    setPathResult(null);
    setAllPathsResult(null);
    setAnalysisData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatGreenArea = (area) => {
    if (area >= 1000000) {
      return `${(area / 1000000).toFixed(2)} unit²`;
    } else if (area >= 1000) {
      return `${(area / 1000).toFixed(2)} unit²`;
    }
    return `${area} unit²`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Route className="w-8 h-8 text-emerald-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Path Detection
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Upload a forest aerial or satellite image to generate optimal paths
          through dense vegetation
        </p>
      </div>

      {/* Coordinate Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <MapPin className="w-5 h-5 text-green-600 mr-2" />
            Start Point
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                X Coordinate
              </label>
              <input
                type="number"
                value={startPoint.x}
                onChange={(e) =>
                  setStartPoint((prev) => ({
                    ...prev,
                    x: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Y Coordinate
              </label>
              <input
                type="number"
                value={startPoint.y}
                onChange={(e) =>
                  setStartPoint((prev) => ({
                    ...prev,
                    y: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <MapPin className="w-5 h-5 text-red-600 mr-2" />
            Goal Point
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                X Coordinate
              </label>
              <input
                type="number"
                value={goalPoint.x}
                onChange={(e) =>
                  setGoalPoint((prev) => ({
                    ...prev,
                    x: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Y Coordinate
              </label>
              <input
                type="number"
                value={goalPoint.y}
                onChange={(e) =>
                  setGoalPoint((prev) => ({
                    ...prev,
                    y: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Image Upload Section */}
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Forest aerial view"
              className="w-full h-80 object-cover rounded-xl shadow-md"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:border-emerald-400"
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Upload forest aerial or satellite image
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              JPG, PNG files accepted • Max size 10MB
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

        {/* Generate Button */}
        {imagePreview && !pathResult && !error && (
          <button
            onClick={generatePath}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-lg ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl"
            } transition-all duration-200 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Analyzing Image & Generating Optimal Path...
              </>
            ) : (
              <>
                <Route className="w-6 h-6 mr-3" />
                Generate Optimal Path
              </>
            )}
          </button>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                Path Generation Failed
              </h3>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {error.message}
            </p>
            <button
              onClick={clearImage}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Another Image
            </button>
          </div>
        )}

        {/* Results Section */}
        {(pathResult || allPathsResult) && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Path Analysis Results
            </h3>

            {/* Path Images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {pathResult && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Route className="w-6 h-6 text-emerald-600 mr-2" />
                    Optimal Path
                  </h4>
                  <div className="border-2 border-emerald-200 dark:border-emerald-800 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={pathResult}
                      alt="Optimal path result"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}

              {allPathsResult && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <TreePine className="w-6 h-6 text-blue-600 mr-2" />
                    All Possible Paths
                  </h4>
                  <div className="border-2 border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={allPathsResult}
                      alt="All possible paths"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Data */}
            {analysisData && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2" />
                  Detailed Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Total Green Area:
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {formatGreenArea(analysisData.totalGreenArea)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Total Steps:
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {analysisData.totalSteps?.toLocaleString() || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Start Point:
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        ({startPoint.x}, {startPoint.y})
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Goal Point:
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        ({goalPoint.x}, {goalPoint.y})
                      </span>
                    </div>
                  </div>
                </div>
                {analysisData.message && (
                  <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <p className="text-emerald-800 dark:text-emerald-300 text-center font-medium">
                      {analysisData.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={clearImage}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
            >
              Analyze New Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PathDetection;
