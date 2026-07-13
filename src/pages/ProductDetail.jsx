import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../api";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Star,
  Share2,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Award,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  X,
  Clock,
  ThumbsUp,
  Eye,
  ShoppingBag
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { WishlistContext } from "../context/WishlistContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState("description");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Hover zoom magnifier state
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center" });
  const [isZoomed, setIsZoomed] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { addToast } = useToast();
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const mockSizes = ["XS", "S", "M", "L", "XL"];
  const mockColors = [
    { name: "Charcoal Black", hex: "#1F2937" },
    { name: "Velvet Crimson", hex: "#991B1B" },
    { name: "Forest Olive", hex: "#3F6212" },
    { name: "Royal Sapphire", hex: "#1E3A8A" },
  ];
  const [selectedColor, setSelectedColor] = useState(mockColors[0]);

  // Review states with helper upvote action
  const initialReviews = [
    {
      id: 1,
      author: "Aarav Sharma",
      avatarColor: "bg-blue-500",
      rating: 5,
      date: "June 28, 2026",
      title: "Absolutely stunning quality!",
      comment: "This exceeded my expectations in every way. The materials feel incredibly premium, and the design detail is outstanding. Worth every rupee!",
      helpful: 24,
    },
    {
      id: 2,
      author: "Priya Patel",
      avatarColor: "bg-purple-500",
      rating: 4,
      date: "July 02, 2026",
      title: "Very good, but shipping was slightly delayed",
      comment: "The product itself is beautiful and exactly as described. Very sturdy and feels like it will last. Shipping took 4 days instead of 2, but overall very happy.",
      helpful: 12,
    },
    {
      id: 3,
      author: "Vikram Singh",
      avatarColor: "bg-emerald-500",
      rating: 5,
      date: "July 10, 2026",
      title: "Top-tier design & feel",
      comment: "Top notch design. The finish is clean and the micro-textures are subtle. Velora Cart's customer service was also very helpful when I needed to update my delivery address.",
      helpful: 8,
    },
  ];

  const [reviewsState, setReviewsState] = useState(initialReviews);
  const [votedReviews, setVotedReviews] = useState({});

  const handleHelpfulClick = (reviewId) => {
    if (votedReviews[reviewId]) return;
    setReviewsState((prev) =>
      prev.map((rev) =>
        rev.id === reviewId ? { ...rev, helpful: rev.helpful + 1 } : rev
      )
    );
    setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
    if (addToast) {
      addToast("Thank you for your feedback!", "success");
    }
  };

  const handleOrderNow = () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
    } else {
      addToCart(product, quantity);
      navigate("/checkout");
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    addToCart(product, quantity);
    if (addToast) {
      addToast(`${product.title} (${quantity}) added to cart!`, "success");
    }
    setIsAddingToCart(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    if (addToast) {
      addToast("Product link copied!", "success");
    }
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Image Magnifier coordinates
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)",
    });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ transformOrigin: "center" });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);

        const fallbacks = [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
        ];

        let cleanedImages = [];
        if (data.images && data.images.length > 0) {
          cleanedImages = data.images.map((img) => img.replace(/\[|\]|"/g, ""));
          cleanedImages = cleanedImages
            .filter((img) => img.startsWith("http"))
            .slice(0, 4);
        }

        if (cleanedImages.length === 0) {
          cleanedImages = fallbacks;
        } else if (cleanedImages.length < 3) {
          cleanedImages = [
            ...cleanedImages,
            ...fallbacks.slice(0, 3 - cleanedImages.length),
          ];
        }

        setProduct({
          ...data,
          images: cleanedImages,
        });
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Mobile Sticky bar detector
  useEffect(() => {
    const handleScroll = () => {
      const buyBtnEl = document.getElementById("main-buy-buttons");
      if (buyBtnEl) {
        const rect = buyBtnEl.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      } else {
        setShowStickyBar(window.scrollY > 600);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getSpecs = (categoryName) => {
    const category = categoryName?.toLowerCase() || "general";
    if (category.includes("cloth") || category.includes("apparel") || category.includes("shoe")) {
      return [
        { label: "Material", value: "100% Organic Certified Cotton" },
        { label: "Fit", value: "Regular fit (true to size)" },
        { label: "Weight", value: "240 GSM heavy-knit fabric" },
        { label: "Care Instructions", value: "Machine wash cold, tumble dry low" },
        { label: "Country of Origin", value: "India" },
      ];
    }
    if (category.includes("elect") || category.includes("tech") || category.includes("phone")) {
      return [
        { label: "Battery Life", value: "Up to 18 hours of typical usage" },
        { label: "Connectivity", value: "Bluetooth 5.3 & Wi-Fi 6" },
        { label: "Weight", value: "185 grams (0.4 lbs)" },
        { label: "Materials", value: "Recycled aluminum and ceramic glass" },
        { label: "Warranty", value: "2-year manufacturer warranty" },
      ];
    }
    return [
      { label: "Material", value: "Eco-friendly, sourced responsibly" },
      { label: "Dimensions", value: "Standard size" },
      { label: "Weight", value: "Lightweight & portable" },
      { label: "Warranty", value: "2-year brand warranty" },
      { label: "Includes", value: "Retail packaging and safety guides" },
    ];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 mt-8 max-w-7xl animate-pulse">
        <div className="h-6 bg-muted w-48 rounded mb-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex gap-4 flex-col-reverse lg:flex-row">
            <div className="flex lg:flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square w-16 lg:w-20 bg-muted rounded-2xl"></div>
              ))}
            </div>
            <div className="grow aspect-square bg-muted rounded-3xl"></div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-muted w-24 rounded-full"></div>
            <div className="h-10 bg-muted w-3/4 rounded-2xl"></div>
            <div className="h-6 bg-muted w-1/3 rounded-lg"></div>
            <div className="h-12 bg-muted w-1/4 rounded-xl"></div>
            <div className="space-y-2 border-t border-border pt-6">
              <div className="h-4 bg-muted w-full rounded"></div>
              <div className="h-4 bg-muted w-full rounded"></div>
              <div className="h-4 bg-muted w-2/3 rounded"></div>
            </div>
            <div className="h-14 bg-muted w-full rounded-2xl mt-8"></div>
            <div className="h-14 bg-muted w-full rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center mt-8 max-w-lg">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
          <X className="text-red-500" size={36} />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tight">Product Not Found</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          {error || "The product you're looking for doesn't exist or has been removed from our catalog."}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
        >
          <ArrowLeft size={18} /> Back to Products
        </Link>
      </div>
    );
  }

  const discountAmount = 1000;
  const originalPrice = product.price + discountAmount;
  const discountPercent = Math.round((discountAmount / originalPrice) * 100);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 mt-8 mb-24 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex text-xs md:text-sm text-muted-foreground mb-8 overflow-hidden items-center whitespace-nowrap">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors font-medium">
              Home
            </Link>
          </li>
          <li className="text-muted-foreground/60"><ChevronRight size={14} /></li>
          <li>
            <Link to="/products" className="hover:text-foreground transition-colors font-medium">
              Products
            </Link>
          </li>
          <li className="text-muted-foreground/60"><ChevronRight size={14} /></li>
          <li className="text-foreground font-semibold truncate max-w-[150px] md:max-w-[300px]">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails vertical strip */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[480px] no-scrollbar scroll-smooth shrink-0 py-1 justify-center lg:justify-start">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square w-16 lg:w-20 rounded-2xl overflow-hidden border-2 transition-all relative group shrink-0 ${
                    activeImage === idx
                      ? "border-foreground shadow-sm scale-102"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300";
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Interactive Zoom Area */}
            <div
              className="grow aspect-square bg-muted rounded-3xl overflow-hidden border border-border shadow-sm relative group cursor-zoom-in select-none"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setLightboxIndex(activeImage);
                setIsLightboxOpen(true);
              }}
            >
              <img
                src={product.images[activeImage]}
                alt={product.title}
                style={isZoomed ? zoomStyle : { transformOrigin: "center" }}
                className={`w-full h-full object-cover transition-transform duration-100 ${
                  isZoomed ? "" : "scale-100"
                }`}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute top-4 left-4 bg-background/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-foreground capitalize tracking-wide shadow-sm border border-border">
                {product.category?.name || "Premium"}
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Click to expand view
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Action Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Tag Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
              <Sparkles size={12} className="animate-pulse" />
              Featured Selection
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
              <TrendingUp size={12} />
              Best Seller
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 animate-pulse">
              <Eye size={12} />
              18 looking now
            </span>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < 4 ? "fill-amber-400 text-amber-400" : "fill-muted text-border"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setActiveTab("reviews");
                  const el = document.getElementById("product-tabs");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                128 Reviews
              </button>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                Verified Purchase
              </span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="border-y border-border py-5 space-y-2">
            <div className="flex items-baseline gap-3.5 flex-wrap">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                ₹{product.price.toLocaleString("en-IN")}.00
              </span>
              <span className="text-lg text-muted-foreground line-through decoration-red-500/40">
                ₹{originalPrice.toLocaleString("en-IN")}.00
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                Save ₹{discountAmount.toLocaleString("en-IN")} ({discountPercent}% OFF)
              </span>
            </div>
            {/* In Stock & Urgent Banner */}
            <div className="flex items-center gap-2 pt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">
                In Stock - Ready to Ship
              </span>
              <span className="text-muted-foreground text-xs font-medium ml-1">
                (Order in next 3 hours for same-day dispatch)
              </span>
            </div>
          </div>

          {/* Short Description preview */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {product.description?.substring(0, 160)}...
          </p>

          {/* Color Option Selector */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-foreground">
                Color: <span className="font-semibold text-muted-foreground">{selectedColor.name}</span>
              </span>
            </div>
            <div className="flex gap-3">
              {mockColors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color.hex }}
                  className={`w-9 h-9 rounded-full cursor-pointer transition-all border border-black/10 dark:border-white/10 ${
                    selectedColor.name === color.name
                      ? "ring-2 ring-offset-2 ring-foreground dark:ring-offset-background scale-110"
                      : "hover:scale-105"
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Option Selector */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-foreground">
                Size: <span className="font-semibold text-muted-foreground">{selectedSize}</span>
              </span>
              <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold">
                Size Guide
              </button>
            </div>
            <div className="flex gap-2">
              {mockSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 min-w-12 px-3.5 rounded-xl border text-sm font-bold transition-all ${
                    selectedSize === size
                      ? "bg-foreground text-background border-foreground shadow-sm scale-102"
                      : "bg-background border-border text-foreground hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3 pt-2">
            <span className="text-sm font-bold text-foreground">Quantity</span>
            <div className="flex items-center w-36 border border-border rounded-xl p-1 bg-muted/40">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-background transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Minus size={16} />
              </button>
              <span className="grow text-center text-sm font-black text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-background transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div id="main-buy-buttons" className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-background border-2 border-foreground hover:bg-muted text-foreground px-6 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-sm flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-75"
            >
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShoppingCart size={20} />
              )}
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 sm:flex-[1.3] bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <ShoppingBag size={20} />
              Order Now
            </button>
          </div>

          {/* Secondary Options */}
          <div className="flex gap-4 border-t border-border pt-6">
            <button
              onClick={() => {
                toggleWishlist(product);
                if (addToast) {
                  const saved = !isInWishlist(product.id);
                  addToast(
                    saved ? `${product.title} saved to Wishlist!` : `Removed from Wishlist.`,
                    saved ? "success" : "info"
                  );
                }
              }}
              className={`flex-1 p-3.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                isInWishlist(product.id)
                  ? "bg-red-50 text-red-500 border-red-200 dark:bg-red-500/10 dark:border-red-500/20"
                  : "bg-background border-border hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 hover:border-red-200 text-foreground"
              }`}
            >
              <Heart
                size={18}
                className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}
              />
              {isInWishlist(product.id) ? "Saved" : "Add to Wishlist"}
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex-1 bg-background border border-border hover:bg-muted text-foreground p-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Share2 size={18} />
              Share Product
            </button>
          </div>

          {/* Trust Benefits Widget */}
          <div className="grid grid-cols-3 gap-3 bg-muted/40 p-4 rounded-2xl border border-border/60 text-center">
            <div className="flex flex-col items-center p-2 space-y-1.5">
              <div className="bg-background text-blue-600 p-2 rounded-full shadow-sm">
                <Truck size={16} />
              </div>
              <p className="text-[11px] font-black text-foreground">Free Shipping</p>
              <p className="text-[9px] text-muted-foreground">Orders above ₹50</p>
            </div>
            <div className="flex flex-col items-center p-2 space-y-1.5 border-x border-border/60">
              <div className="bg-background text-green-600 p-2 rounded-full shadow-sm">
                <ShieldCheck size={16} />
              </div>
              <p className="text-[11px] font-black text-foreground">2 Year Warranty</p>
              <p className="text-[9px] text-muted-foreground">Premium guarantee</p>
            </div>
            <div className="flex flex-col items-center p-2 space-y-1.5">
              <div className="bg-background text-orange-600 p-2 rounded-full shadow-sm">
                <RotateCcw size={16} />
              </div>
              <p className="text-[11px] font-black text-foreground">30-Day Return</p>
              <p className="text-[9px] text-muted-foreground">Hassle-free swap</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-b border-border mt-20 scroll-mt-24" id="product-tabs">
        <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "description", name: "Description" },
            { id: "specifications", name: "Specifications" },
            { id: "shipping", name: "Shipping & Delivery" },
            { id: "reviews", name: `Reviews (${reviewsState.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm md:text-base font-bold relative transition-colors ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full animate-[fadeIn_0.2s_ease-out]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="py-8">
        {activeTab === "description" && (
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-4xl text-muted-foreground leading-relaxed space-y-4">
            <p className="whitespace-pre-line text-sm md:text-base">{product.description}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/20 p-6 rounded-2xl border">
              <div className="flex items-start gap-3">
                <Award className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-foreground">Authenticity Guaranteed</h4>
                  <p className="text-xs text-muted-foreground">Every item is directly sourced and thoroughly inspected.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-orange-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-foreground">Dispatched in 24 Hours</h4>
                  <p className="text-xs text-muted-foreground">Packed with care and shipped out within one business day.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="max-w-2xl border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                {getSpecs(product.category?.name).map((spec, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border/60 last:border-0 ${
                      i % 2 === 0 ? "bg-muted/20" : "bg-background"
                    }`}
                  >
                    <td className="py-4 px-6 font-bold text-foreground w-1/3">{spec.label}</td>
                    <td className="py-4 px-6 text-muted-foreground">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-3xl text-muted-foreground space-y-5 leading-relaxed">
            <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">Delivery Timelines</h3>
            <p>
              We ship our products worldwide. Deliveries inside India generally arrive in 2 to 4 business days. International shipping can take 7 to 14 business days depending on customs.
            </p>
            <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight pt-2">Easy Returns & Exchanges</h3>
            <p>
              Not happy with your product? No problem. We offer a 30-day window for hassle-free returns. Simply contact our support team, and we will dispatch a delivery agent to collect the item from your doorstep. All refunds are processed to your original payment method in 3-5 working days.
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-3xl space-y-6">
            {/* Reviews list */}
            <div className="space-y-6">
              {reviewsState.map((review) => (
                <div key={review.id} className="p-6 rounded-2xl border border-border/80 bg-card shadow-sm flex flex-col md:flex-row gap-5">
                  {/* User profile image placeholder */}
                  <div className="flex items-center md:items-start shrink-0">
                    <div className={`w-12 h-12 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-black shadow-sm`}>
                      {review.author.split(" ").map(w => w[0]).join("")}
                    </div>
                  </div>

                  {/* Review text contents */}
                  <div className="grow space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div>
                        <h4 className="font-bold text-foreground">{review.author}</h4>
                        <div className="flex items-center text-amber-400 gap-1.5 mt-0.5">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={`fill-current ${i < review.rating ? "text-amber-400" : "text-muted/40"}`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <span className="inline-flex self-start sm:self-center items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/10">
                        Verified Buyer
                      </span>
                    </div>

                    <h5 className="font-bold text-foreground text-sm md:text-base">{review.title}</h5>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                    {/* Review Helpfulness action */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => handleHelpfulClick(review.id)}
                        disabled={votedReviews[review.id]}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                          votedReviews[review.id]
                            ? "bg-muted text-foreground border-transparent"
                            : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                        }`}
                      >
                        <ThumbsUp size={12} />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal Dialog */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-card w-full max-w-md m-4 p-6 md:p-8 rounded-3xl shadow-2xl border border-border relative animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <button
              onClick={() => setIsShareOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground bg-muted p-2 rounded-full transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl md:text-2xl font-black text-foreground mb-2">Share Product</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-6">
              Spread the word! Share this product with friends and family.
            </p>

            <div className="space-y-4">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Copy Link</label>
              <div className="flex items-center gap-2 border border-border p-2 rounded-xl bg-muted/40">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="grow bg-transparent text-xs font-medium focus:outline-none overflow-x-auto text-muted-foreground px-2"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-foreground text-background text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                >
                  {copySuccess ? <Check size={13} /> : <Copy size={13} />}
                  {copySuccess ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("Check out this awesome product: " + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 py-3.5 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors text-center"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out this product!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-50 dark:bg-sky-500/10 text-sky-600 border border-sky-100 dark:border-sky-500/20 py-3.5 rounded-xl font-bold text-xs hover:bg-sky-100 transition-colors text-center"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border border-indigo-100 dark:border-indigo-500/20 py-3.5 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors text-center"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Zoom Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm select-none animate-[fadeIn_0.2s_ease-out]">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <button
            onClick={() => setLightboxIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="max-w-4xl max-h-[80vh] p-4 flex items-center justify-center">
            <img
              src={product.images[lightboxIndex]}
              alt={`Fullscreen ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800";
              }}
            />
          </div>

          <button
            onClick={() => setLightboxIndex((prev) => (prev + 1) % product.images.length)}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors rotate-180"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 flex gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  lightboxIndex === i ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Buy Action Footer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3.5 shadow-2xl flex items-center justify-between gap-4 lg:hidden transition-all duration-300 ${
          showStickyBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-11 h-11 object-cover rounded-lg border bg-muted shrink-0"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300";
            }}
          />
          <div className="overflow-hidden">
            <p className="text-xs font-black text-foreground truncate max-w-[130px] md:max-w-[250px]">
              {product.title}
            </p>
            <p className="text-sm font-extrabold text-foreground">
              ₹{product.price.toLocaleString("en-IN")}.00
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toggleWishlist(product);
              if (addToast) {
                const saved = !isInWishlist(product.id);
                addToast(
                  saved ? `${product.title} saved to Wishlist!` : `Removed from Wishlist.`,
                  saved ? "success" : "info"
                );
              }
            }}
            className={`p-3 rounded-xl border transition-all shrink-0 ${
              isInWishlist(product.id)
                ? "bg-red-50 text-red-500 border-red-200 dark:bg-red-500/10 dark:border-red-500/20"
                : "bg-background border-border text-foreground"
            }`}
          >
            <Heart
              size={18}
              className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-blue-600 text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 active:scale-95 shrink-0"
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart size={16} />
            )}
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
