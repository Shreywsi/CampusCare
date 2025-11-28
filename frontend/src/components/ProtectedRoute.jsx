import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, ready } = useContext(AuthContext);
  const location = useLocation();

  // avoid UI flicker while auth state initializes
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // not authenticated -> redirect to login, preserve return location
  if (!user) {
    return <Navigate to="/student-login" state={{ from: location }} replace />;
  }

  // role check
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}