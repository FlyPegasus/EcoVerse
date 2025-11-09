import { ImagePost } from "../models/imgpost.model.js";

// dummy map data
// Replace this with your database model or query
// Example static data:
const pollutionPosts = [
  { latitude: 22.5726, longitude: 88.3639, severity: 0.7 },
  { latitude: 28.7041, longitude: 77.1025, severity: 0.9 },
  { latitude: 19.076, longitude: 72.8777, severity: 0.5 },
];

// GET /api/heatmap
export const dummyMap = async (req, res) => {
  try {
    // If using DB:
    // const posts = await PollutionPost.find({}, 'latitude longitude severity');

    const heatmapData = pollutionPosts.map((post) => [
      post.latitude,
      post.longitude,
      post.severity, // You can normalize here if needed
    ]);

    return res.json({ data: heatmapData });
  } catch (err) {
    console.error("Error fetching heatmap data:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getHeatmapData = async (req, res) => {
  try {
    const posts = await ImagePost.find(
      {},
      {
        location: 1,
        severity: 1,
        _id: 0,
      }
    );

    // Format data for Leaflet Heatmap: [lat, lng, intensity]
    const heatmapPoints = posts.map((post) => {
      const [lng, lat] = post.location.coordinates;
      const intensity = post.severity.score || 0;
      return [lat, lng, intensity]; // Leaflet expects [lat, lng, intensity]
    });

    res.status(200).json({ heatmap: heatmapPoints });
  } catch (err) {
    console.error("Error fetching heatmap data:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
