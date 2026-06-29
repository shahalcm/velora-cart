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
} from "lucide-react";
import ProductSkeleton from "../ui/ProductSkeleton";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { WishlistContext } from "../context/WishlistContext";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useContext(CartContext);
  const { showConfirmModal } = useToast();
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleOrderNow = () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
    } else {
      addToCart(product);
      navigate("/checkout");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);

        // Clean images logic similar to Products.jsx
        const fallbacks = [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
        ];

        let cleanedImages = [];
        if (data.images && data.images.length > 0) {
          cleanedImages = data.images.map((img) => img.replace(/\[|\]|"/g, ""));
          // Filter out invalid URLs
          cleanedImages = cleanedImages
            .filter((img) => img.startsWith("http"))
            .slice(0, 4);
        }

        if (cleanedImages.length === 0) {
          cleanedImages = fallbacks;
        } else if (cleanedImages.length < 3) {
          // pad with fallbacks if there are only 1 or 2 valid images
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
    window.scrollTo(0, 0); // scroll to top on load
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 mt-8">
        <div className="animate-pulse">
          <div className="h-4 bg-muted w-32 rounded mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2 aspect-square bg-muted rounded-2xl"></div>
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="h-8 bg-muted w-3/4 rounded"></div>
              <div className="h-12 bg-muted w-1/4 rounded"></div>
              <div className="h-24 bg-muted w-full rounded"></div>
              <div className="h-12 bg-muted w-full rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center mt-8">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">
          {error ||
            "The product you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          <ArrowLeft size={18} /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 mt-8 mb-24">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-muted-foreground mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link
              to="/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <span className="text-foreground font-medium truncate max-w-[200px] inline-block align-bottom">
              {product.title}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-3xl overflow-hidden border border-border shadow-sm relative">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800";
              }}
            />
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground capitalize tracking-wide shadow-sm">
              {product.category?.name || "Premium"}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? "border-blue-500 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
              <Star size={16} className="fill-current mr-1" />
              <Star size={16} className="fill-current mr-1" />
              <Star size={16} className="fill-current mr-1" />
              <Star size={16} className="fill-current mr-1" />
              <Star size={16} className="fill-current mr-1 opacity-50" />
              <span className="text-yellow-700 dark:text-yellow-500 text-sm font-bold ml-1">
                4.2
              </span>
            </div>
            <span className="text-muted-foreground text-sm font-medium hover:underline cursor-pointer">
              128 Reviews
            </span>
          </div>

          <div className="text-4xl font-black text-foreground mb-8">
            ₹{product.price + 1000}.00
          </div>

          <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground mb-10 border-t border-border pt-8">
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-card border border-border hover:bg-muted text-foreground px-6 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
              <button
                onClick={handleOrderNow}
                className="flex-1 sm:flex-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 flex items-center justify-center"
              >
                Order Now
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex-1 p-4 rounded-xl transition-all border flex items-center justify-center gap-2 font-medium ${
                  isInWishlist(product.id)
                    ? "bg-red-50 text-red-500 border-red-100"
                    : "bg-muted hover:bg-red-50 text-foreground hover:text-red-500 border-transparent hover:border-red-100"
                }`}
              >
                <Heart
                  size={20}
                  className={isInWishlist(product.id) ? "fill-current" : ""}
                />{" "}
                <span className="hidden sm:inline">
                  {isInWishlist(product.id) ? "Saved to Wishlist" : "Wishlist"}
                </span>
              </button>
              <button className="flex-1 bg-muted hover:bg-muted/80 text-foreground p-4 rounded-xl transition-all flex items-center justify-center gap-2 font-medium">
                <Share2 size={20} />{" "}
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-12 bg-muted p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-background p-2 rounded-full shadow-sm text-blue-600">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Free Shipping
                </p>
                <p className="text-xs text-muted-foreground">
                  On orders over ₹50
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-background p-2 rounded-full shadow-sm text-green-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  2 Year Warranty
                </p>
                <p className="text-xs text-muted-foreground">
                  Guarantee included
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
