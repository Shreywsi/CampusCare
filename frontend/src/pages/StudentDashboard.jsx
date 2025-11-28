import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import cclogo from "../images/cclogo9.png";

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [studentInfo, setStudentInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token || !user) {
      navigate("/student-login");
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch user profile
      try {
        const userRes = await api.get(`/auth/profile`);
        setStudentInfo(userRes.data);
      } catch (err) {
        // If profile endpoint fails, use basic user info
        console.warn("Profile endpoint not available, using basic info");
        setStudentInfo({ name: user?.email, email: user?.email });
      }

      // Fetch appointments
      const appointmentsRes = await api.get("/appointments");
      setAppointments(appointmentsRes.data || []);

      // Fetch medical records
      const recordsRes = await api.get("/records");
      setMedicalRecords(recordsRes.data || []);

      // Generate notifications from appointments and records
      const notifs = [];
      const upcomingAppointments = appointmentsRes.data?.filter(
        (apt) => new Date(apt.date || apt.slot?.date) > new Date() && apt.status !== "cancelled"
      );
      if (upcomingAppointments?.length > 0) {
        notifs.push({
          type: "appointment",
          message: `You have ${upcomingAppointments.length} upcoming appointment(s)`,
          date: new Date(),
        });
      }

      const recentRecords = recordsRes.data?.filter(
        (record) => new Date(record.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      if (recentRecords?.length > 0) {
        notifs.push({
          type: "record",
          message: `${recentRecords.length} new medical record(s) available`,
          date: new Date(),
        });
      }

      setNotifications(notifs);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await api.delete(`/appointments/${appointmentId}`);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel appointment");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return timeString ? `${dateStr} at ${timeString}` : dateStr;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#153761] via-[#1a4a6b] to-[#153761] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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
              <span className="text-sm">Welcome, {studentInfo?.name || user?.email}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs Navigation */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                id: "profile",
                label: "Profile",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
              {
                id: "appointments",
                label: "Appointments",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                id: "records",
                label: "Medical Records",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                id: "prescriptions",
                label: "Prescriptions",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
              },
              {
                id: "notifications",
                label: "Notifications",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-[#31a2b4] text-[#31a2b4]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#153761] to-[#31a2b4] rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {studentInfo?.name || "Student"}
              </h2>
              <p className="text-white/90 text-lg">
                Here's a quick overview of your medical information
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Upcoming Appointments</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {appointments.filter(
                        (apt) =>
                          new Date(apt.date || apt.slot?.date) > new Date() &&
                          apt.status !== "cancelled"
                      ).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Medical Records</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {medicalRecords.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Notifications</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {notifications.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h3>
              {appointments.filter(
                (apt) =>
                  new Date(apt.date || apt.slot?.date) > new Date() && apt.status !== "cancelled"
              ).length === 0 ? (
                <p className="text-gray-500">No upcoming appointments</p>
              ) : (
                <div className="space-y-3">
                  {appointments
                    .filter(
                      (apt) =>
                        new Date(apt.date || apt.slot?.date) > new Date() &&
                        apt.status !== "cancelled"
                    )
                    .slice(0, 3)
                    .map((apt) => (
                      <div
                        key={apt._id}
                        className="border-l-4 border-[#31a2b4] bg-gray-50 p-4 rounded-r-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Dr. {apt.doctor?.name || "Doctor"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDateTime(apt.date || apt.slot?.date, apt.timeSlot || apt.slot?.time)}
                            </p>
                            <span
                              className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                                apt.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : apt.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              <button
                onClick={() => setActiveTab("appointments")}
                className="mt-4 text-[#31a2b4] hover:underline font-medium"
              >
                View all appointments →
              </button>
            </div>

            {/* Recent Medical Records */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Medical Records</h3>
              {medicalRecords.length === 0 ? (
                <p className="text-gray-500">No medical records available</p>
              ) : (
                <div className="space-y-3">
                  {medicalRecords.slice(0, 3).map((record) => (
                    <div
                      key={record._id}
                      className="border-l-4 border-green-500 bg-gray-50 p-4 rounded-r-lg"
                    >
                      <p className="font-semibold text-gray-900">{record.diagnosis}</p>
                      <p className="text-sm text-gray-600">
                        Dr. {record.doctor?.name || "Doctor"} • {formatDate(record.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setActiveTab("records")}
                className="mt-4 text-[#31a2b4] hover:underline font-medium"
              >
                View all records →
              </button>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            {studentInfo ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 font-semibold">{studentInfo.name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID / Roll Number
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {studentInfo.studentId || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900 font-semibold">{studentInfo.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {studentInfo.contactNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History Summary</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Total Visits:</span> {medicalRecords.length}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Last Visit:</span>{" "}
                      {medicalRecords.length > 0
                        ? formatDate(medicalRecords[0]?.createdAt)
                        : "No visits yet"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading profile information...</p>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
                <button
                  onClick={() => navigate("/book-appointment")}
                  className="bg-gradient-to-r from-[#153761] to-[#31a2b4] text-white px-6 py-2 rounded-lg font-semibold hover:from-[#31a2b4] hover:to-[#2a8fa0] transition-all"
                >
                  + Book New Appointment
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No appointments found</p>
                  <button
                    onClick={() => navigate("/book-appointment")}
                    className="text-[#31a2b4] hover:underline font-medium"
                  >
                    Book your first appointment →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Dr. {apt.doctor?.name || "Doctor"}
                            </h3>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                apt.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : apt.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : apt.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : apt.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Date & Time:</span>{" "}
                            {formatDateTime(apt.date || apt.slot?.date, apt.timeSlot || apt.slot?.time)}
                          </p>
                          {apt.doctor?.specialization && (
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">Specialization:</span>{" "}
                              {apt.doctor.specialization}
                            </p>
                          )}
                          {apt.symptoms && (
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">Symptoms:</span> {apt.symptoms}
                            </p>
                          )}
                          {apt.notes && (
                            <p className="text-gray-600">
                              <span className="font-medium">Notes:</span> {apt.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {apt.status === "pending" && (
                            <button
                              onClick={() => handleCancelAppointment(apt._id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === "records" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Records / Reports</h2>
            {medicalRecords.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No medical records available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicalRecords.map((record) => (
                  <div
                    key={record._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {record.diagnosis}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Doctor:</span> Dr.{" "}
                          {record.doctor?.name || "Unknown"}
                          {record.doctor?.specialization && (
                            <span className="ml-2 text-gray-500">
                              ({record.doctor.specialization})
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span> {formatDate(record.createdAt)}
                        </p>
                      </div>
                    </div>

                    {record.prescription && record.prescription.length > 0 && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Prescription:</h4>
                        <ul className="space-y-2">
                          {record.prescription.map((med, idx) => (
                            <li key={idx} className="text-gray-700">
                              <span className="font-medium">{med.medicine}</span> - {med.dosage}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {record.notes && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                        <p className="text-gray-700">{record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === "prescriptions" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Medicine / Prescription Info</h2>
            {medicalRecords.filter((r) => r.prescription && r.prescription.length > 0).length ===
            0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No prescriptions available</p>
              </div>
            ) : (
              <div className="space-y-6">
                {medicalRecords
                  .filter((r) => r.prescription && r.prescription.length > 0)
                  .map((record) => (
                    <div
                      key={record._id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Prescribed on {formatDate(record.createdAt)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            By Dr. {record.doctor?.name || "Unknown"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Medications:</h4>
                        {record.prescription.map((med, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#31a2b4]"
                          >
                            <p className="font-medium text-gray-900 text-lg">{med.medicine}</p>
                            <p className="text-gray-700 mt-1">
                              <span className="font-medium">Dosage:</span> {med.dosage}
                            </p>
                          </div>
                        ))}
                      </div>

                      {record.diagnosis && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Notifications / Announcements
            </h2>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No notifications at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-[#31a2b4] bg-gray-50 rounded-r-lg p-4"
                  >
                    <p className="text-gray-900 font-medium">{notif.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(notif.date)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* System Announcements Section */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Reminders</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">
                        Regular Health Checkups Recommended
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Schedule regular checkups to maintain your health and wellness.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Emergency Contact</p>
                      <p className="text-sm text-gray-600 mt-1">
                        For medical emergencies, contact the medical unit immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

