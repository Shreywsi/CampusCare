import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/records");
        setRecords(res.data || []);
      } catch (err) {
        console.error("Error fetching records:", err);
        setError(
          err.response?.data?.error || 
          err.response?.data?.message ||
          err.message || 
          "Failed to load medical records."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Medical Records</h2>
      
      {error && (
        <div className="text-red-500 text-center mb-4 bg-red-50 p-4 rounded">
          {error}
        </div>
      )}
      
      <div className="max-w-2xl mx-auto bg-white rounded shadow-md p-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="text-center text-gray-500">No records found.</div>
        ) : (
          <ul>
            {records.map(record => (
              <li key={record._id} className="mb-4 border-b pb-4">
                <div className="font-semibold">{record.diagnosis}</div>
                <div>Doctor: {record.doctor?.name || record.doctor || "N/A"}</div>
                <div>Date: {new Date(record.createdAt).toLocaleDateString()}</div>
                <div>
                  Prescription: {
                    record.prescription && record.prescription.length > 0 ? (
                      record.prescription.map((med, idx) => (
                        <span key={idx}>
                          {med.medicine} ({med.dosage}){idx < record.prescription.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No prescription</span>
                    )
                  }
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}