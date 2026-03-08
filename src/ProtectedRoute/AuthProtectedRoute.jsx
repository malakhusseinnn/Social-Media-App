import React from "react";
import { Navigate } from "react-router-dom";

export default function AuthProtectedRoute({ children }) {
  if (localStorage.getItem("userToken")) {
    return <Navigate to="/home"></Navigate>;
  } else {
    return <>{children}</>;
  }
}
