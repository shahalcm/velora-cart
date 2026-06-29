const ProductSkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border shadow-sm transition-all flex flex-col h-full animate-pulse">
      <div className="aspect-square bg-muted w-full relative overflow-hidden"></div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-4 bg-muted rounded-md w-1/3 mb-2"></div>
        <div className="h-5 bg-muted rounded-md w-3/4 mb-4"></div>
        
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="h-6 bg-muted rounded-md w-1/4"></div>
          <div className="h-10 bg-muted rounded-xl w-10"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
