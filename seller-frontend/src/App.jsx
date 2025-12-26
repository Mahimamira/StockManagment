// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import MainHome from "./pages/MainHome";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import AddProduct from "./components/AddProduct";
import Orders from "./components/Orders";
import Stocks from "./components/Stocks";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminRegister from "./pages/admin/Register";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./components/AdminDashboad";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// User
import UserLogin from "./pages/user/Login";
import UserRegister from "./pages/user/Register";
import UserHome from "./pages/user/Home";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import Cart from "./pages/user/Cart";
import UserOrders from "./pages/user/UserOrders";
import UserProfile from "./pages/user/UserProfile"; // ✅ ADD THIS

import { CartProvider } from "./context/CartContext";

function AppWrapper() {
  const location = useLocation();

  const hideSidebarRoutes = [
    "/",
    "/login",
    "/register",
    "/admin/login",
    "/admin/register",
    "/admin/dashboard",
    "/user/login",
    "/user/register",
    "/user/home",
    "/user/cart",
    "/user/orders",
    "/user/profile", // ✅ ADD THIS
  ];

  const showSidebar =
    !hideSidebarRoutes.includes(location.pathname) &&
    location.pathname.startsWith("/seller");

  return (
    <div className="flex bg-gray-900 min-h-screen">
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? "ml-64 w-full" : "w-full"}>
        <Routes>
          {/* Default */}
          <Route path="/" element={<MainHome/>} />

          {/* Seller Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Seller Protected Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/stocks"
            element={
              <ProtectedRoute>
                <Stocks />
              </ProtectedRoute>
            }
          />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* User Auth */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          
          {/* User Protected Routes */}
          <Route
            path="/user/home"
            element={
              <ProtectedUserRoute>
                <UserHome />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/user/cart"
            element={
              <ProtectedUserRoute>
                <Cart />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <ProtectedUserRoute>
                <UserOrders />
              </ProtectedUserRoute>
            }
          />
          {/* ✅ ADD THIS - User Profile Route */}
          <Route
            path="/user/profile"
            element={
              <ProtectedUserRoute>
                <UserProfile />
              </ProtectedUserRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppWrapper />
      </CartProvider>
    </Router>
  );
}

export default App;
