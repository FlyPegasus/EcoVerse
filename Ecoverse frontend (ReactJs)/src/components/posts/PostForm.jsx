import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Toast from "../ui/Toast";

const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);

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

    // Simulate AI processing and post creation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setShowToast(true);

    // Reset form after a brief delay
    setTimeout(() => {
      setCaption("");
      setImagePreview(null);
      setFile(null);
      onPostCreated();
    }, 500);

    // Hide toast after animation
    setTimeout(() => {
      setShowToast(false);
    }, 5000); // Increased to 5 seconds
  };

  return (
    <>
      {showToast && (
        <Toast
          message="Small Steps, Green Futures: Let's Walk Together"
          type="success"
          duration={5000} // Increased to 5 seconds
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Share Environmental Concern
        </h2>

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
      </div>
    </>
  );
};

export default PostForm;
