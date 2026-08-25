import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Users from "./pages/Users";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import Inventory from "./pages/Inventory";
import Invoice from "./pages/Invoice";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import ApiDocumentation from "./pages/ApiDocumentation";
import Contacts from "./pages/Contacts";

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <main className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen">
                {/* Premium Support Badge */}
                <div className="px-4 py-2 text-sm font-medium text-center text-white shadow-sm bg-gradient-to-r from-amber-500 to-orange-500">
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <span>📞 0909 123 456</span>
                    <span>📍 TP Huế, Việt Nam</span>
                    <a href="#">
                      <span>✉️ support@yourshop.com</span>
                    </a>
                  </div>
                </div>
                <Navbar />
                <div className="flex w-full">
                  <div className="fixed z-10 w-16 min-h-screen border-r-2 sm:w-64 lg:w-72">
                    <Sidebar />
                  </div>
                  <div className="flex-1 px-3 py-2 ml-16 sm:px-5 sm:ml-64 lg:ml-72">
                    <ScrollToTop />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/add" element={<Add token={token} />} />
                      <Route path="/list" element={<List token={token} />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/brands" element={<Brands />} />
                      <Route
                        path="/orders"
                        element={<Orders token={token} />}
                      />
                      <Route path="/users" element={<Users token={token} />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/invoice" element={<Invoice />} />
                      <Route path="/api-docs" element={<ApiDocumentation />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
