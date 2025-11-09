import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const { post } = useSelector((store) => store.post);
  // const userPosts = post.posts?.filter((p) => p.author._id === user._id);
  const currentUser = user?._id === userProfile?._id;
  const [stats, setStats] = useState(null);
  // const { userStats, userPosts } = useSelector((store) => store.profile);
  // console.log("Current User:", currentUser);
  if (!currentUser || !userProfile) {
    navigate("/login");
  }
  useEffect(() => {
    if (!userProfile?._id) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/posts/user/${userProfile._id}/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching user stats:", err);
      }
    };

    fetchStats();
  }, [userProfile]);
  if (!stats) return <p>Loading stats...</p>;
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <ProfileHeader user={user} />

        <div className="mt-6">
          <ProfileStats stats={stats} />
          {/* <ProfilePosts posts={userPosts} /> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
