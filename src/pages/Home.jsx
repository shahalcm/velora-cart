import Hero from '../component/home/Hero';
import FeaturedProducts from '../component/home/FeaturedProducts';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedProducts />
      
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 rounded-full"></div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full border border-background/20 text-background/80 text-sm font-semibold tracking-wide">
                Our Philosophy
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">Sustainable & <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Ethical Design.</span></h2>
              <p className="text-lg md:text-xl text-background/70 leading-relaxed max-w-lg">
                We believe in creating products that not only look good but do good. 
                Our entire collection is meticulously sourced from sustainable materials and crafted by artisans under fair trade conditions.
              </p>
              <button className="mt-4 px-8 py-4 bg-background text-foreground rounded-xl font-bold hover:scale-105 hover:shadow-xl shadow-background/20 transition-all duration-300">
                Learn More About Our Mission
              </button>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group border border-background/10">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600" 
                alt="Sustainable Fashion"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="font-bold text-xl text-white">Eco-Friendly Materials</p>
                  <p className="text-white/70 mt-2">Sourced responsibly around the globe.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
