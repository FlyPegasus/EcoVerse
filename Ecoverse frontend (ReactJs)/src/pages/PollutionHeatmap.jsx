import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { MapPin, AlertTriangle, Loader2 } from "lucide-react";

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    // Filter out invalid points
    const validPoints = points.filter(
      (point) =>
        Array.isArray(point) &&
        point.length >= 2 &&
        typeof point[0] === "number" &&
        typeof point[1] === "number"
    );

    if (!validPoints.length) return;

    const heat = L.heatLayer(validPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.0: "#00ff00",
        0.2: "#ffff00",
        0.4: "#ff8000",
        0.6: "#ff4000",
        0.8: "#ff0000",
        1.0: "#800080",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [points, map]);

  return null;
};

const PollutionHeatmap = () => {
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, avgSeverity: 0 });

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8000/api/v1/map/heatmap");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        console.log("API Response:", json);

        // Handle the correct API response structure
        const points = json.heatmap || [];
        setHeatmapPoints(points);

        // Calculate statistics
        if (points.length > 0) {
          const totalSeverity = points.reduce(
            (sum, point) => sum + (point[2] || 0),
            0
          );
          const avgSeverity = totalSeverity / points.length;
          setStats({
            total: points.length,
            avgSeverity: avgSeverity.toFixed(2),
          });
        }
      } catch (err) {
        console.error("Failed to fetch heatmap data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Loading pollution data...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Analyzing environmental conditions
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Data
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't fetch the pollution data. Please check your connection
            and try again.
          </p>
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded">
            Error: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Statistics Panel */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 min-w-[250px]">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Pollution Overview</h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Reports:</span>
            <span className="font-medium text-gray-800">{stats.total}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Avg. Severity:</span>
            <span className="font-medium text-gray-800">
              {stats.avgSeverity}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Heat intensity represents pollution severity levels across
              different locations.
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">
          Pollution Intensity
        </h4>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-green-400 rounded"></div>
              <span className="text-xs text-gray-600">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-yellow-400 rounded"></div>
              <span className="text-xs text-gray-600">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-600">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[22.9734, 78.6569]} // Centered on India
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {heatmapPoints.length > 0 && <HeatmapLayer points={heatmapPoints} />}
      </MapContainer>

      {/* No Data Message */}
      {heatmapPoints.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-black/20">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm mx-4">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Pollution Data
            </h3>
            <p className="text-gray-600 text-sm">
              No pollution reports are currently available for display on the
              map.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollutionHeatmap;
