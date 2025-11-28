import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: "", role: "patient" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", form);
      setMessage(res.data.message);
      // In development, show the token/URL for testing
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
        setResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#153761] via-[#1a4a6b] to-[#153761] p-4">
      <div className="w-full max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
            Forgot <span className="text-[#31a2b4]">Password</span>
          </h1>
          <p className="text-white/80 text-sm">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-700 text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Development Token Display */}
          {resetToken && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
              <p className="text-yellow-800 text-sm font-medium mb-2">
                Development Mode: Reset token generated
              </p>
              <p className="text-xs text-yellow-700 mb-2">Token: {resetToken}</p>
              {resetUrl && (
                <a
                  href={resetUrl}
                  className="text-[#31a2b4] hover:underline text-sm font-medium"
                >
                  Click here to reset password →
                </a>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                Account Type <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a2b4] focus:border-transparent transition-all"
              >
                <option value="patient">Student</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={form.role === "patient" ? "student@nitsikkim.ac.in" : "doctor@example.com"}
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a2b4] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-[#153761] to-[#1a4a6b] text-white py-3.5 rounded-lg font-semibold hover:from-[#31a2b4] hover:to-[#2a8fa0] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#153761] disabled:hover:to-[#1a4a6b] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Send Reset Instructions</span>
              </>
            )}
          </button>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to={form.role === "patient" ? "/student-login" : "/doctor-login"}
                className="font-semibold text-[#31a2b4] hover:text-[#153761] transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-xs">
            Password reset link will expire in 1 hour
          </p>
        </div>
      </div>
    </div>
  );
}

