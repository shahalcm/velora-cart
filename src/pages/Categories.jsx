import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api";
import { Layers } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();

        // Filter out any invalid or generic categories for a cleaner look
        // We'll also provide fallback images just in case
        const fallbacks = [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=600",
        ];

        const enhancedData = data.slice(0, 5).map((cat, i) => ({
          ...cat,
          cleanImage:
            cat.image && cat.image.startsWith("http")
              ? cat.image.replace(/\[|\]|"/g, "")
              : fallbacks[i % 5],
        }));

        setCategories(enhancedData);
      } catch (err) {
        console.error("Failed to load categories", err);
        setError("Could not load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header section similar to Products page */}
      <div className="bg-muted py-16 mb-12 border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_40%)] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Layers size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Explore Categories
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Browse our meticulously categorized selection of premium items. Find
            exactly what fits your aesthetic and functional needs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-card border border-border rounded-4xl h-[400px]"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-muted/50 rounded-3xl border border-border">
            <p className="text-xl text-red-500 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/products`} // you can filter by category here later if needed
                className={`group relative overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col aspect-4/5 ${index === 0 ? "md:col-span-2 lg:col-span-2 md:aspect-2/1 lg:aspect-2/1" : ""}`}
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.cleanImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                      {cat.name}
                    </h2>
                    <div className="flex items-center gap-2 text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span>View Collection</span>
                      <div className="w-8 h-[2px] bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
