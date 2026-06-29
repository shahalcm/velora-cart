import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '../../api';

const FeaturedProducts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getCategories();
        // Fallbacks for cleaner aesthetic representation
        const fallbacks = [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600"
        ];
        
        const enhancedData = data.slice(0, 4).map((item, i) => ({
          ...item,
          cleanImage: (item.image && item.image.startsWith('http')) ? item.image.replace(/\[|\]|"/g, '') : fallbacks[i % 4]
        }));
        
        setCategories(enhancedData);
      } catch (error) {
        console.error("Failed to fetch featured categories", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Featured Categories</h2>
            <p className="text-muted-foreground text-lg">
              Explore our most popular and carefully selected collections designed to elevate your everyday aesthetics.
            </p>
          </div>
          <Link 
            to="/categories"
            className="inline-flex items-center justify-center gap-2 font-semibold hover:text-foreground/70 transition-colors group mt-4 md:mt-0"
          >
            View All Categories
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading 
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-card border border-border rounded-2xl aspect-square sm:aspect-4/5"></div>
              ))
            : categories.map((cat) => (
              <Link key={cat.id} to={`/products`} className="group relative bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col aspect-square sm:aspect-4/5 hover:-translate-y-1">
                
                <div className="absolute inset-0 z-0">
                  <img 
                    src={cat.cleanImage} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-6">
                  <div className="transform sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 font-medium sm:opacity-0 group-hover:opacity-100 transition-opacity duration-500 sm:delay-100">
                      <span>Explore Collection</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

              </Link>
            ))
          }
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
