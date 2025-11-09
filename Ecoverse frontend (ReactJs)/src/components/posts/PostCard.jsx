import { useState } from "react";
import {
  Leaf,
  MessageCircle,
  Share2,
  AlertCircle,
  Send,
  Trash2,
  MoreVertical,
  Copy,
  Check,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const PostCard = ({ post }) => {
  // const { addToast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { newComment },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);
        toast(res.data.message, "success");
        setNewComment("");
      }
    } catch (error) {
      console.log(error);
      toast("Failed to add comment", "error");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? likeCount - 1 : likeCount + 1;
        setLikeCount(updatedLikes);
        setLiked(!liked);
        toast(res.data.message, "success");
      }
    } catch (error) {
      console.log(error);
      toast("Failed to update like", "error");
    }
  };

  const deletePostHandler = async () => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast(res.data.message || "Post deleted successfully", "success");
        // Note: In a real app, you'd want to update the parent component's state
        // to remove this post from the list
      }
    } catch (error) {
      console.log(error);
      toast(error.response?.data?.message || "Failed to delete post", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setShowOptions(false);
    }
  };

  const shareHandler = async () => {
    const shareData = {
      title: `${post.author.username}'s Pollution Report`,
      text: `Check out this pollution report: ${post.caption}`,
      url: `${window.location.origin}/post/${post._id}`,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        toast("Shared successfully!", "success");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log("Error sharing:", error);
          setShowShareMenu(true);
        }
      }
    } else {
      setShowShareMenu(true);
    }
  };

  const copyToClipboard = async () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast("Link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log("Failed to copy:", error);
      toast("Failed to copy link", "error");
    }
  };

  const shareToSocialMedia = (platform) => {
    const postUrl = encodeURIComponent(
      `${window.location.origin}/post/${post._id}`
    );
    const text = encodeURIComponent(
      `Check out this pollution report by ${post.author.username}: ${post.caption}`
    );

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${postUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${postUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const getSeverityColor = (score) => {
    if (score >= 70) return "bg-red-100 text-red-700 border-red-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getSeverityLevel = (score) => {
    if (score >= 70) return "High";
    if (score >= 40) return "Medium";
    return "Low";
  };

  const formatTimeAgo = (date) => {
    if (!date) return "Unknown time";
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // For demo purposes, assume current user can delete posts
  const isPostOwner = true; // In real app: user && post.author._id === user._id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author.profilePicture}
            alt={post.author.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {post.author.username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTimeAgo(post.createdAt)}
            </p>
            {post.locationName && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {post.locationName}
              </div>
            )}
          </div>
        </div>

        {isPostOwner && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image with Severity Badge */}
      <div className="relative">
        <img
          src={post.analysedImage}
          alt="Environmental issue"
          className="w-full h-80 object-cover"
        />
        <div
          className={`absolute bottom-3 right-3 ${getSeverityColor(
            post.severity.score
          )} px-3 py-1 rounded-full text-sm font-medium flex items-center border`}
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          {getSeverityLevel(post.severity.score)} Severity
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-900 dark:text-white mb-3 leading-relaxed">
          {post.caption}
        </p>

        {/* Pollution Score and Rewards */}
        <div className="flex items-center justify-between text-sm mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">
              Pollution Score:
            </span>
            <span
              className={`font-bold ${
                post.severity.score > 70
                  ? "text-red-500"
                  : post.severity.score > 40
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {post.severity.score}/100
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">
              Reward:
            </span>
            <span className="text-yellow-500 font-bold">
              {Math.floor(post.severity.score / 10)} ECO Coins
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <button
              onClick={likeOrDislikeHandler}
              className={`flex items-center gap-2 transition-all duration-300 ${
                liked
                  ? "text-green-500 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
              }`}
            >
              <Leaf
                className={`w-5 h-5 transition-transform duration-300 ${
                  liked ? "fill-current transform rotate-12 scale-110" : ""
                }`}
              />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{comments.length}</span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={shareHandler}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>

            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20 min-w-[200px] p-2">
                <div className="space-y-1">
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-3 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>

                  <button
                    onClick={() => shareToSocialMedia("twitter")}
                    className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-3 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Share on Twitter
                  </button>

                  <button
                    onClick={() => shareToSocialMedia("facebook")}
                    className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-3 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Share on Facebook
                  </button>

                  <button
                    onClick={() => shareToSocialMedia("linkedin")}
                    className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-3 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Share on LinkedIn
                  </button>

                  <button
                    onClick={() => shareToSocialMedia("whatsapp")}
                    className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex items-center gap-3 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Share on WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commentHandler();
              }}
              className="flex gap-2 mb-4"
            >
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={comment.id || index} className="flex gap-3">
                  <img
                    src={
                      comment.author?.profilePicture ||
                      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300"
                    }
                    alt={comment.author?.username || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <p className="font-medium text-sm dark:text-white">
                        {comment.author?.username || "User"}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {comment.text}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimeAgo(comment.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold dark:text-white">
                Delete Post
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deletePostHandler}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(showOptions || showShareMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowOptions(false);
            setShowShareMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
