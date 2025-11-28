import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cclogo from "../images/cclogo9.png";
import bg from "../images/bg.jpg";

const typingText =
  "Welcome to NIT Sikkim's comprehensive medical unit portal. Please select your role to continue.";

export default function Home() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const [logoVisible, setLogoVisible] = useState(false);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(typingText.slice(0, i));
      i++;
      if (i > typingText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Logo fade-in animation
  useEffect(() => {
    setTimeout(() => setLogoVisible(true), 300);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Enhanced Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#153761]/90 via-[#1a4a6b]/85 to-[#153761]/90 z-0"></div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12">
          <div className={`transition-all duration-1000 ${
            logoVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}>
            <img
              src={cclogo}
              alt="CampusCare Logo"
              className="w-36 h-36 mb-6 rounded-full border-4 border-[#31a2b4] shadow-2xl ring-4 ring-[#31a2b4]/20"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-wide drop-shadow-2xl">
            Campus<span className="text-[#31a2b4]">Care</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-2 font-medium">
            NIT Sikkim Medical Portal
          </p>
          <div className="mb-8 text-center min-h-[3rem] max-w-2xl">
            <span className="text-white font-semibold text-lg md:text-xl">
              {displayedText}
              <span className="animate-pulse ml-1">|</span>
            </span>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-[#31a2b4]/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#31a2b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Easy Booking</h3>
            <p className="text-white/70 text-sm">Schedule appointments effortlessly</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-[#31a2b4]/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#31a2b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Digital Records</h3>
            <p className="text-white/70 text-sm">Access medical records anytime</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-[#31a2b4]/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#31a2b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Secure Access</h3>
            <p className="text-white/70 text-sm">Your data is protected</p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-5xl mx-auto">
          {/* Student Card */}
          <div
            className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-3xl border-2 ${
              role === "student" ? "border-[#31a2b4] scale-105 shadow-[#31a2b4]/50" : "border-transparent"
            }`}
            onMouseEnter={() => setRole("student")}
            onMouseLeave={() => setRole("")}
          >
            <div className="w-20 h-20 mb-4 bg-gradient-to-br from-[#153761] to-[#31a2b4] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#153761] mb-3">Student</h2>
            <p className="text-[#8393a7] mb-6 text-center leading-relaxed">
              Access your medical appointments, view records, and manage your health information.
            </p>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 bg-gradient-to-r from-[#153761] to-[#1a4a6b] text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-[#31a2b4] hover:to-[#2a8fa0] transition-all duration-300 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/register");
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-[#8393a7] to-[#6b7a8f] text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-[#31a2b4] hover:to-[#2a8fa0] transition-all duration-300 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/student-login");
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </button>
            </div>
          </div>

          {/* Doctor Card */}
          <div
            className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-3xl border-2 ${
              role === "doctor" ? "border-[#31a2b4] scale-105 shadow-[#31a2b4]/50" : "border-transparent"
            }`}
            onMouseEnter={() => setRole("doctor")}
            onMouseLeave={() => setRole("")}
          >
            <div className="w-20 h-20 mb-4 bg-gradient-to-br from-[#31a2b4] to-[#2a8fa0] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#153761] mb-3">Doctor</h2>
            <p className="text-[#8393a7] mb-6 text-center leading-relaxed">
              Manage patient appointments, create medical records, and provide quality healthcare services.
            </p>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 bg-gradient-to-r from-[#31a2b4] to-[#2a8fa0] text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-[#153761] hover:to-[#1a4a6b] transition-all duration-300 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/doctor-register");
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-[#8393a7] to-[#6b7a8f] text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-[#31a2b4] hover:to-[#2a8fa0] transition-all duration-300 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/doctor-login");
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            Secure • Reliable • Efficient Medical Management System
          </p>
        </div>
      </div>
    </div>
  );
}