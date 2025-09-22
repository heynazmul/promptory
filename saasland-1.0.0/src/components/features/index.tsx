import React, { useState } from 'react';
import { ProductCard } from './ProductCard';

type Category = 'men' | 'couple' | 'female' | 'kids';

const products = {
  men: [
    {
      title: "Men's Portrait Session",
      description: "Professional photography session perfect for LinkedIn, business profiles, or personal branding.",
      rating: 4.8,
      reviews: 156,
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Outdoor Adventure Shoot",
      description: "Capture your adventurous spirit in stunning natural locations.",
      rating: 4.9,
      reviews: 142,
      imageUrl: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Corporate Headshots",
      description: "Professional headshots for your business needs and corporate profile.",
      rating: 4.7,
      reviews: 98,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Sports Photography",
      description: "Dynamic shots capturing your athletic performance and achievements.",
      rating: 4.8,
      reviews: 112,
      imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Urban Fashion Shoot",
      description: "Stylish portraits in urban settings for your portfolio or social media.",
      rating: 4.6,
      reviews: 89,
      imageUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Black & White Portraits",
      description: "Timeless monochrome portraits that capture your personality.",
      rating: 4.9,
      reviews: 167,
      imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    }
  ],
  couple: [
    {
      title: "Engagement Session",
      description: "Capture your love story with our romantic engagement photo session.",
      rating: 5.0,
      reviews: 189,
      imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Anniversary Shoot",
      description: "Celebrate your journey together with a romantic anniversary session.",
      rating: 4.9,
      reviews: 145,
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Pre-Wedding Photos",
      description: "Beautiful pre-wedding shots to commemorate your special journey.",
      rating: 4.8,
      reviews: 167,
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Destination Couples",
      description: "Romantic photos in stunning destinations around the world.",
      rating: 4.9,
      reviews: 134,
      imageUrl: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Casual Couple Shoot",
      description: "Natural, candid moments capturing your everyday love story.",
      rating: 4.7,
      reviews: 156,
      imageUrl: "https://images.unsplash.com/photo-1511090289856-e39b41f6af6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Adventure Couples",
      description: "Document your adventures together in spectacular settings.",
      rating: 4.8,
      reviews: 178,
      imageUrl: "https://images.unsplash.com/photo-1526485856375-9110812fbf35?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    }
  ],
  female: [
    {
      title: "Portrait Session",
      description: "Professional portraits that capture your unique personality and style.",
      rating: 4.9,
      reviews: 203,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Fashion Photography",
      description: "High-end fashion shots for your portfolio or social media.",
      rating: 4.8,
      reviews: 167,
      imageUrl: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Business Headshots",
      description: "Professional headshots for your corporate and business needs.",
      rating: 4.7,
      reviews: 145,
      imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Lifestyle Session",
      description: "Natural, candid photos that showcase your everyday life.",
      rating: 4.8,
      reviews: 156,
      imageUrl: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Artistic Portraits",
      description: "Creative and artistic portraits that tell your story.",
      rating: 4.9,
      reviews: 189,
      imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Outdoor Beauty",
      description: "Beautiful portraits in natural settings and golden light.",
      rating: 4.8,
      reviews: 178,
      imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    }
  ],
  kids: [
    {
      title: "Child Portraits",
      description: "Capture precious moments of your little ones with our child photography session.",
      rating: 4.9,
      reviews: 234,
      imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Family Session",
      description: "Beautiful family portraits that will be cherished for generations.",
      rating: 4.8,
      reviews: 189,
      imageUrl: "https://images.unsplash.com/photo-1518438136221-e3c6a959b3c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Milestone Photos",
      description: "Document special moments in your child's growth journey.",
      rating: 4.9,
      reviews: 167,
      imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "School Portraits",
      description: "Professional school photos that capture their personality.",
      rating: 4.7,
      reviews: 145,
      imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Outdoor Play",
      description: "Natural, candid shots of kids being kids in the great outdoors.",
      rating: 4.8,
      reviews: 178,
      imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    },
    {
      title: "Sibling Photos",
      description: "Capture the special bond between siblings in beautiful portraits.",
      rating: 4.9,
      reviews: 156,
      imageUrl: "https://images.unsplash.com/photo-1499159058454-75067059248a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
    }
  ]
};

const FeaturesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('men');

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Photography Sessions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional photography services for every occasion
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 gap-1">
            {(['men', 'couple', 'female', 'kids'] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {products[activeCategory].map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              rating={product.rating}
              reviews={product.reviews}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;