import { Link } from 'react-router-dom';
import { ShoppingBag, Twitter, Facebook, Instagram, Github, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background pt-20 pb-8 border-t border-border selection:bg-background/20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="space-y-6 lg:col-span-1 border-b md:border-b-0 pb-8 md:pb-0 border-muted/20">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="bg-background text-foreground p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <ShoppingBag size={22} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight">Velora</span>
            </Link>
            <p className="text-muted/80 text-sm leading-relaxed max-w-sm">
              Elevating your everyday style with premium, carefully curated products that combine breathtaking aesthetics with uncompromising functionality.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2.5 bg-background/5 rounded-full text-muted hover:text-background hover:bg-background/20 transition-all hover:scale-110"><Twitter size={18} /></a>
              <a href="#" className="p-2.5 bg-background/5 rounded-full text-muted hover:text-background hover:bg-background/20 transition-all hover:scale-110"><Facebook size={18} /></a>
              <a href="#" className="p-2.5 bg-background/5 rounded-full text-muted hover:text-background hover:bg-background/20 transition-all hover:scale-110"><Instagram size={18} /></a>
              <a href="#" className="p-2.5 bg-background/5 rounded-full text-muted hover:text-background hover:bg-background/20 transition-all hover:scale-110"><Github size={18} /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold tracking-wide">Shop</h4>
            <ul className="space-y-4 text-sm text-muted/80">
              <li><Link to="/products" className="hover:text-background hover:ml-2 transition-all flex items-center">All Products</Link></li>
              <li><Link to="#" className="hover:text-background hover:ml-2 transition-all flex items-center">New Arrivals</Link></li>
              <li><Link to="#" className="hover:text-background hover:ml-2 transition-all flex items-center">Featured Collections</Link></li>
              <li><Link to="#" className="hover:text-background hover:ml-2 transition-all flex items-center flex items-center gap-2">Sale <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold">HOT</span></Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold tracking-wide">Support</h4>
            <ul className="space-y-4 text-sm text-muted/80">
              <li><Link to="#" className="hover:text-background hover:ml-2 transition-all flex items-center">Help Center / FAQ</Link></li>
              <li><Link to="#" className="hover:text-background hover:ml-2 transition-all flex items-center">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-background hover:ml-2 transition-all flex items-center">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-background hover:ml-2 transition-all flex items-center">Track Your Order</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold tracking-wide">Newsletter</h4>
            <p className="text-sm text-muted/80 leading-relaxed">
              Subscribe to receive updates, access to exclusive deals, and early access to new collections.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="bg-background/5 border border-muted/20 rounded-xl px-4 py-3.5 text-sm text-background w-full focus:outline-none focus:border-background/50 focus:bg-background/10 transition-all placeholder:text-muted/50"
                  required
                />
              </div>
              <button 
                type="submit"
                className="bg-background text-foreground px-4 py-3.5 rounded-xl text-sm font-semibold hover:bg-background/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                Subscribe <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-muted/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted/60 text-center md:text-left">
          <p>© {new Date().getFullYear()} Velora Cart. All rights reserved. <br className="md:hidden" /><span className="hidden md:inline"> | </span>Founded by <span className="font-bold text-muted/90">Muhammed Shahal Cm</span></p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 font-medium">
            <Link to="#" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-background transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-background transition-colors">Cookies Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
