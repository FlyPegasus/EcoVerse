import {
  Users,
  Award,
  BarChart2,
  Calendar,
  MapPin,
  TrendingUp,
  Star,
  ChevronRight,
  Zap,
  Target,
  Globe,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const Community = () => {
  // const topContributors = [
  //   {
  //     id: 1,
  //     name: "eco_warrior",
  //     avatar:
  //       "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     posts: 47,
  //     coins: 520,
  //     badge: "Environmental Champion",
  //     level: "Gold",
  //   },
  //   {
  //     id: 2,
  //     name: "green_activist",
  //     avatar:
  //       "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     posts: 35,
  //     coins: 410,
  //     badge: "Climate Hero",
  //     level: "Silver",
  //   },
  //   {
  //     id: 3,
  //     name: "earth_guardian",
  //     avatar:
  //       "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     posts: 29,
  //     coins: 385,
  //     badge: "Sustainability Expert",
  //     level: "Silver",
  //   },
  //   {
  //     id: 4,
  //     name: "planet_protector",
  //     avatar:
  //       "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     posts: 23,
  //     coins: 310,
  //     badge: "Eco Innovator",
  //     level: "Bronze",
  //   },
  //   {
  //     id: 5,
  //     name: "eco_innovator",
  //     avatar:
  //       "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     posts: 18,
  //     coins: 275,
  //     badge: "Green Pioneer",
  //     level: "Bronze",
  //   },
  // ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Ocean Cleanup Initiative",
      date: "2025-01-25",
      participants: 156,
      location: "Marina Bay",
      category: "cleanup",
      impact: "Remove 500kg of ocean plastic",
      organizer: "Ocean Warriors",
      featured: true,
    },
    {
      id: 2,
      title: "Urban Forest Restoration",
      date: "2025-02-02",
      participants: 89,
      location: "Central Park",
      category: "planting",
      impact: "Plant 200 native trees",
      organizer: "Green City Initiative",
    },
    {
      id: 3,
      title: "Sustainable Living Workshop",
      date: "2025-02-08",
      participants: 45,
      location: "Eco Center",
      category: "education",
      impact: "Educate 50+ families",
      organizer: "EcoEducate",
    },
    {
      id: 4,
      title: "Renewable Energy Fair",
      date: "2025-02-15",
      participants: 234,
      location: "Convention Center",
      category: "expo",
      impact: "Showcase green tech solutions",
      organizer: "Future Energy",
    },
  ];

  const achievements = [
    {
      icon: Globe,
      label: "Carbon Reduced",
      value: "2.4M kg",
      color: "text-green-600",
    },
    {
      icon: Target,
      label: "Goals Achieved",
      value: "1,247",
      color: "text-blue-600",
    },
    {
      icon: Zap,
      label: "Impact Score",
      value: "98.5%",
      color: "text-purple-600",
    },
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case "cleanup":
        return "🌊";
      case "planting":
        return "🌱";
      case "education":
        return "📚";
      case "expo":
        return "⚡";
      default:
        return "🌍";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case "Bronze":
        return "bg-gradient-to-r from-orange-400 to-orange-600";
      default:
        return "bg-gradient-to-r from-green-400 to-green-600";
    }
  };

  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/community/get"
        );
        setTopContributors(res.data);
      } catch (err) {
        console.error("Failed to load top contributors", err);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Environmental Community
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of eco-warriors making a real difference. Track your
            impact, connect with like-minded individuals, and participate in
            meaningful environmental actions.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-12 h-12 text-green-600 dark:text-green-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  5,243
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +12% this month
                </div>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-300 font-medium">
              Active Members
            </h3>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <BarChart2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  12,567
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  +8% this week
                </div>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-300 font-medium">
              Reports Submitted
            </h3>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  156,780
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  +15% today
                </div>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-300 font-medium">
              ECO Coins Earned
            </h3>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  89.2%
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Impact Score
                </div>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-300 font-medium">
              Community Health
            </h3>
          </div>
        </div>

        {/* Achievement Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 text-center hover:shadow-2xl transition-all duration-300"
            >
              <achievement.icon
                className={`w-16 h-16 mx-auto mb-4 ${achievement.color}`}
              />
              <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {achievement.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {achievement.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Contributors */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                Top Contributors
              </h2>
              <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="space-y-4">
              {topContributors.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-sm mr-4">
                    {index + 1}
                  </div>

                  <div className="relative mr-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${getLevelColor(
                        user.level
                      )} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                    >
                      {user.level[0]}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {user.badge}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {user.posts} environmental reports
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center text-yellow-500 font-bold text-lg mb-1">
                      <Award className="w-5 h-5 mr-1" />
                      {user.coins}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ECO Coins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-500" />
                Upcoming Events
              </h2>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center transition-colors">
                View Calendar <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    event.featured
                      ? "border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
                      : "border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700"
                  }`}
                >
                  {event.featured && (
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                        Featured Event
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getCategoryIcon(event.category)}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          by {event.organizer}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-2 text-purple-500" />
                      {event.participants} joined
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    {event.location}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Expected Impact: {event.impact}
                    </p>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Join Event
                  </button>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-3 text-center text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600">
              Explore All Events
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Join our community of environmental champions and start your journey
            towards a sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Contributing
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
