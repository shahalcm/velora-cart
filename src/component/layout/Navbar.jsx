import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Heart, User } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        setUser(JSON.parse(token));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "glass py-3 bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-border group-hover:scale-105 transition-transform duration-300 w-10 h-10 overflow-hidden flex items-center justify-center">
              <img
                src="/src/assets/logo.png"
                alt="Velora Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Velora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-blue-500 relative group py-2 ${
                  location.pathname === link.path
                    ? "text-blue-600"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform origin-left transition-transform duration-300 ${
                    location.pathname === link.path
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Icons Context */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <div
              className={`flex items-center transition-all duration-300 ${isSearchOpen ? "bg-muted/50 rounded-full px-3 py-1 border border-border/50" : ""}`}
            >
              {isSearchOpen && (
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-32 lg:w-48 text-foreground ms-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate(
                        `/products?search=${encodeURIComponent(searchQuery)}`,
                      );
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                />
              )}
              <button
                onClick={() => {
                  if (isSearchOpen && searchQuery.trim()) {
                    navigate(
                      `/products?search=${encodeURIComponent(searchQuery)}`,
                    );
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  } else {
                    setIsSearchOpen(!isSearchOpen);
                  }
                }}
                className={`text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full ${isSearchOpen ? "hover:bg-transparent" : "hover:bg-muted/50"}`}
                title="Search"
              >
                <Search size={20} strokeWidth={2} />
              </button>
            </div>
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="relative text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted/50 rounded-full"
            >
              <Heart size={20} strokeWidth={2} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 shadow-sm">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>
            <div className="h-6 w-[1px] bg-border mx-1"></div>

            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border rounded-full transition-colors group mx-2"
              >
                <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground pr-1 group-hover:text-blue-600 transition-colors">
                  Profile
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                <User size={16} strokeWidth={2} />
                <span>Login</span>
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-foreground hover:scale-105 transition-transform p-2 bg-foreground/5 rounded-full ml-2"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-foreground text-background text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-foreground p-2 bg-foreground/5 rounded-full"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-foreground text-background text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground p-2 focus:outline-none hover:bg-muted/50 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={24} strokeWidth={2} />
              ) : (
                <Menu size={24} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-screen py-4 shadow-xl" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 lg:px-8">
          {user && (
            <div className="py-2 px-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 mb-2">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="text-base font-semibold text-blue-600">
                {user.name}
              </p>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                location.pathname === link.path
                  ? "bg-blue-50/50 text-blue-600"
                  : "text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50 hover:translate-x-1 hover:shadow-sm"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-border px-4">
            <div className="flex items-center gap-2 bg-muted/50 py-2 px-3 rounded-lg border border-border/50 group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm w-full text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(
                      `/products?search=${encodeURIComponent(searchQuery)}`,
                    );
                    setIsMobileMenuOpen(false);
                    setSearchQuery("");
                  }
                }}
              />
            </div>
            <button 
              onClick={() => { setIsWishlistOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-muted/50 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors relative"
            >
              <Heart size={18} />{" "}
              <span className="text-sm font-medium">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-4 mt-2 border-t border-border px-4">
            {user ? (
              <Link
                to="/profile"
                className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 py-2.5 rounded-lg hover:bg-blue-100 transition-colors font-medium shadow-sm"
              >
                <User size={18} /> <span>My Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <User size={18} />{" "}
                <span className="text-sm font-medium">Log In / Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </header>
  );
};

export default Navbar;
