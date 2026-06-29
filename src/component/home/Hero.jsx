import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import heroImage from "../../assets/hero.png"



const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-muted overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 py-20 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-sm text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              New Summer Collection 2026
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Elevate Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">
                Everyday Style.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Discover our meticulously curated collection of premium products designed to bring aesthetic brilliance and functional excellence into your life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-semibold text-lg hover:bg-foreground/90 hover:scale-105 hover:shadow-xl transition-all duration-300 group"
              >
                <ShoppingBag size={20} />
                Shop Now
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link 
                to="/categories"
                className="inline-flex items-center justify-center gap-2 bg-background border-2 border-border px-8 py-4 rounded-xl font-semibold text-lg hover:border-foreground/20 hover:bg-muted/50 transition-all duration-300"
              >
                Explore Categories
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-8 border-t border-border mt-4">
              <div className="flex-1 min-w-[100px]">
                <p className="text-2xl sm:text-3xl font-bold">10k+</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Happy Customers</p>
              </div>
              <div className="hidden sm:block w-[1px] h-12 bg-border"></div>
              <div className="flex-1 min-w-[100px]">
                <p className="text-2xl sm:text-3xl font-bold">Premium</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Quality</p>
              </div>
              <div className="hidden sm:block w-[1px] h-12 bg-border"></div>
              <div className="flex-1 min-w-[100px]">
                <p className="text-2xl sm:text-3xl font-bold">24/7</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Support</p>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group border-[8px] border-background animate-[fadeIn_1s_ease-out]">
              <img 
                src={heroImage}
                alt="Fashion Model" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            
            <div className="absolute top-[10%] -right-[5%] bg-background p-4 rounded-2xl shadow-xl border border-border hidden lg:block animate-[bounce_3s_infinite]">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-muted rounded-xl bg-center bg-cover" style={{backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200')"}}></div>
                <div>
                  <p className="text-sm font-bold">Smart Watch</p>
                  <p className="text-xs text-muted-foreground">₹299.00</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-[20%] -left-[5%] bg-background p-4 rounded-full shadow-xl border border-border hidden md:flex items-center justify-center h-24 w-24 animate-[pulse_4s_infinite]">
              <span className="text-foreground font-bold text-2xl text-center leading-none">50%<br/><span className="text-[10px] text-muted-foreground uppercase">Off Sale</span></span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
