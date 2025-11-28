import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import cclogo from "../images/cclogo9.png";

export default function BookAppointment() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    doctor: "",
    date: "",
    timeSlot: "",
    symptoms: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token || !user) {
      navigate("/student-login");
      return;
    }

    fetchDoctors();
  }, [user, navigate]);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const res = await api.get("/appointments/doctors");
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.post("/appointments", form);
      setMessage("Appointment booked successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum tomorrow
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Maximum 30 days ahead
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-gradient-to-r from-[#153761] to-[#1a4a6b] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img
                src={cclogo}
                alt="CampusCare Logo"
                className="w-10 h-10 rounded-full border-2 border-[#31a2b4]"
              />
              <h1 className="text-2xl font-bold">
                Campus<span className="text-[#31a2b4]">Care</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm hover:text-[#31a2b4] transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h2>
            <p className="text-gray-600">
              Schedule an appointment with a doctor from the medical unit
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-700 text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <label
                htmlFor="doctor"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Select Doctor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                {loadingDoctors ? (
                  <div className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <span className="text-gray-500 text-sm">Loading doctors...</span>
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <span className="text-gray-500 text-sm">No doctors available</span>
                  </div>
                ) : (
                  <select
                    id="doctor"
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    required
                    disabled={loading || loadingDoctors}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a2b4] focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name}
                        {doctor.doctorProfile?.specialization
                          ? ` - ${doctor.doctorProfile.specialization}`
                          : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {doctors.length > 0 && form.doctor && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected:{" "}
                  {doctors.find((d) => d._id === form.doctor)?.doctorProfile?.specialization &&
                    `Specialization: ${
                      doctors.find((d) => d._id === form.doctor).doctorProfile.specialization
                    }`}
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a2b4] focus:border-transparent transition-all"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Select a date between tomorrow and 30 days from now
              </p>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label
                htmlFor="timeSlot"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Time Slot <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={form.timeSlot}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a2b4] focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">Select a time slot...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label
                htmlFor="symptoms"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Symptoms / Reason for Visit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={form.symptoms}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows="5"
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a2b4] focus:border-transparent transition-all resize-none"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Provide details about your symptoms or the reason for your visit
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || loadingDoctors || doctors.length === 0}
                className="flex-1 bg-gradient-to-r from-[#153761] to-[#1a4a6b] text-white py-3 rounded-lg font-semibold hover:from-[#31a2b4] hover:to-[#2a8fa0] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#153761] disabled:hover:to-[#1a4a6b] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Book Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
