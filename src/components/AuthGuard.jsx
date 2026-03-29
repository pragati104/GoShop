import { useAuth } from "../zustand/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AuthGuard = () => {
  const location = useLocation();

  const user = useAuth((state) => state.user);
  const isHydrated = useAuth((state) => state.isHydrated);

  // ✅ wait for Zustand to load
  if (!isHydrated) {
    return (
      <div className="bg-gray-100 h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-16 h-16 text-indigo-600" />
      </div>
    );
  }

  // ❌ not logged in
  if (!user) {
    if (location.pathname === "/login") return <Outlet />;
    return <Navigate to="/login" replace />;
  }

  // ✅ already logged in → block login page
  if (location.pathname === "/login") {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/carts" replace />;
    }
  }

  // 🔐 admin routes
  if (location.pathname.startsWith("/admin")) {
    if (user.role !== "admin") {
      return <Navigate to="/user/carts" replace />;
    }
  }

  // 👤 user routes
  if (location.pathname.startsWith("/user")) {
    if (user.role !== "user") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default AuthGuard;
