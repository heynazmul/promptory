import React, { useState } from 'react';

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
  const [copyNotification, setCopyNotification] = useState(false);

  const copyToClipboard = async () => {
    const copyText = `${title}\n\n${description}`;
    
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyNotification(true);
      setTimeout(() => {
        setCopyNotification(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group">
      <div className="relative rounded-xl overflow-hidden border border-neutral-200/60 bg-white text-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300 w-[380px] group-hover:scale-[1.02]">
        {/* Copy Button Notification */}
        <div className="absolute top-4 right-4 z-10">
          <div className="relative">
            {copyNotification && (
              <div className="absolute right-0 -translate-x-full -translate-y-1/2 top-1/2 mr-3">
                <div className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg shadow-lg flex items-center whitespace-nowrap">
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Copied to clipboard!
                  <div className="absolute left-full top-1/2 -translate-y-1/2">
                    <div className="w-0 h-0 border-l-4 border-l-green-500 border-y-4 border-y-transparent"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
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
            
            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className={`flex items-center justify-center h-9 w-9 rounded-lg cursor-pointer border transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                copyNotification
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white/90 text-neutral-600 hover:bg-white hover:text-neutral-700 shadow-md border-white/80'
              }`}
            >
              {copyNotification ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
          
          <p className="text-neutral-600 mb-6 leading-relaxed">{description}</p>
          
          {/* Product Features */}
          <div className="flex items-center gap-4 mb-6 text-xs">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">AI generated</span>
          </div>
        </div>
      </div>
    </div>
  );
};