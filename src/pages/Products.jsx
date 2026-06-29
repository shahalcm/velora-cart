import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ShoppingCart,
  Eye,
  Heart,
  Filter,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { getProducts } from "../api";
import ProductSkeleton from "../ui/ProductSkeleton";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const LIMIT = 12;

  const fetchProducts = async (currentOffset, query = "") => {
    setLoading(true);
    try {
      const data = await getProducts(LIMIT, currentOffset, query);

      const fallbacks = [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600",
      ];

      const enhancedData = data.map((item, i) => ({
        ...item,
        cleanImage:
          item.images[0] && item.images[0].startsWith("http")
            ? item.images[0].replace(/\[|\]|"/g, "")
            : fallbacks[i % 4],
      }));

      if (currentOffset === 0) setProducts(enhancedData);
      else setProducts((prev) => [...prev, ...enhancedData]);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]); // Clear existing products
    setOffset(0);
    fetchProducts(0, searchQuery);
  }, [searchQuery]);

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchProducts(newOffset, searchQuery);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-muted py-16 mb-12 border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_40%)] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Our Collection"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {searchQuery
                ? `Showing products matching your search query.`
                : "Discover our full collection of premium products. Carefully curated to ensure the highest quality and best design aesthetics for your everyday lifestyle."}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl hover:bg-muted font-semibold transition-colors shadow-sm">
              <Filter size={18} /> Filters
            </button>
            <span className="text-muted-foreground text-sm font-medium">
              Showing{" "}
              <span className="text-foreground font-bold">
                {products.length}
              </span>{" "}
              results
            </span>
          </div>

          <div className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex justify-between items-center gap-4 px-5 py-2.5 bg-card border border-border rounded-xl hover:bg-muted font-semibold transition-colors shadow-sm">
              <span className="flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> Sort by:
                Featured
              </span>{" "}
              <ChevronDown size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {products.map((product) => (
            <Link
              key={`${product.id}-${Math.random()}`}
              to={`/products/${product.id}`}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                <img
                  src={product.cleanImage}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600";
                  }}
                />

                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground capitalize tracking-wide shadow-sm z-10 border border-border">
                  {product.category?.name || "Premium"}
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-3 translate-y-4 group-hover:translate-y-0 z-10">
                  <button
                    className="bg-background/95 text-foreground p-3 rounded-xl hover:bg-background hover:scale-110 transition-all shadow-lg hidden sm:block delay-75"
                    title="Quick View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-foreground text-background p-3 rounded-xl hover:bg-foreground/90 hover:scale-105 transition-all shadow-lg flex-1 flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`p-3 rounded-xl hover:scale-110 transition-all shadow-lg hidden sm:block delay-75 z-10 ${
                      isInWishlist(product.id) 
                        ? 'bg-red-50 text-red-500' 
                        : 'bg-background/95 text-foreground hover:bg-red-50 hover:text-red-500'
                    }`}
                    title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart size={18} className={isInWishlist(product.id) ? "fill-current" : ""} />
                  </button>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                  {product.description}
                </p>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between pt-4 border-t border-border mt-auto gap-2 xl:gap-0">
                  <span className="text-lg sm:text-xl font-extrabold text-foreground">
                    ₹{product.price + 1000}.00
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    ★ ★ ★ ★{" "}
                    <span className="text-muted-foreground text-xs ml-1 font-medium">
                      ({Math.floor(Math.random() * 100) + 1})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={`skeleton-${i}`} />
            ))}
        </div>

        {!loading && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={loadMore}
              className="px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden group"
            >
              <span className="relative z-10">Load More Products</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
