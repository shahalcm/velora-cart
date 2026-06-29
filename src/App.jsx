import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Footer from "./component/layout/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import ProtectedRoute from "./component/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";

const MainLayout = () => (
  <>
    {" "}
    <Navbar /> <Outlet /> <Footer />{" "}
  </>
);
const AuthLayout = () => (
  <>
    {" "}
    <Outlet /> <Footer />{" "}
  </>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-(--background) text-(--foreground) transition-colors duration-300">
      <main className="grow pt-16">
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
