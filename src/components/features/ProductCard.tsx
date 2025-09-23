import React from 'react';

interface ProductCardProps {
  title: string;
  description: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  rating,
  reviews,
  imageUrl
}) => {
  return (
    <div className="relative group">
      <div className="relative rounded-xl overflow-hidden border border-neutral-200/60 bg-white text-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300 w-[380px] group-hover:scale-[1.02]">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img 
            src={imageUrl}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Product Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-800 leading-tight mb-1">{title}</h2>
              <div className="flex items-center text-sm text-neutral-500">
                <svg className="w-4 h-4 mr-1 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>{rating} ({reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <p className="text-neutral-600 mb-6 leading-relaxed">{description}</p>
          
          {/* Category Tag */}
          <div className="flex items-center gap-4 mb-6 text-xs">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">Book Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};