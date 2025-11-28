import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(""); // Clear error before fetching
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(
          err.response?.data?.error || 
          err.response?.data?.message ||
          err.message || 
          "Failed to load dashboard stats."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
      
      {error && (
        <div className="text-red-500 text-center mb-4 bg-red-50 p-4 rounded">
          {error}
        </div>
      )}
      
      <div className="max-w-2xl mx-auto bg-white rounded shadow-md p-6">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mb-4">
            <div className="font-semibold mb-2">
              Total Patients: {stats.patients || 0}
            </div>
            <div className="font-semibold mb-2">
              Total Doctors: {stats.doctors || 0}
            </div>
            <div className="font-semibold mb-2">
              Total Appointments: {stats.appointments || 0}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}