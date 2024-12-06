import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function PrivateRoute({ children, role }) {
  const { user } = useContext(UserContext);

  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
