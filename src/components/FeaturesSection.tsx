import { useState, useCallback } from 'react';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';

type Category = 'men' | 'couple' | 'female' | 'kids';

interface Product {
  title: string;
  description: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

const products: Record<Category, Product[]> = {
  men: [
    {
      title: "Men's Portrait Session",
      description: "Ultra-realistic cinematic photo using the exact same face from the uploaded reference image (keep 100% identical facial features and hairstyle). A stylish young man with curly hair and a trimmed beard, wearing a fitted black t-shirt, ripped black jeans, and black boots. He is leaning casually against a sleek black vintage muscle car parked on a winding mountain road. The background shows dramatic mountain silhouettes under a warm golden sunset sky. The mood is cinematic, moody, and atmospheric with soft golden-hour lighting. 4K, high detail.",
      rating: 4.8,
      reviews: 156,
      imageUrl: "/images/men1.jpg"
    },
    {
      title: "Men's Portrait Session",
      description: "Create a retro vintage grainy but bright image of the reference picture but draped in a perfect white colour suit, Pinteresty aesthetic retro pants. It must feel like a 90s movie hair baddie with a small flower bouquet in hand and romanticising a windy environment. The man is standing against a solid deep shadow and contrast drama, creating a mysterious and artistic atmosphere where the lighting is warm with golden tones evoking a sunset or golden hour glow. The background is minimalist.",
      rating: 4.8,
      reviews: 156,
      imageUrl: "/images/men2.jpg"
    },
    {
      title: "Men's Portrait Session",
      description: "A mysterious black-and-white cinematic portrait of a young slim body man in a long dark trench coat, surrounded by pigeons flying dramatically around him. Some pigeons fly very close to the camera, wings blurred in motion, others perch on his shoulder. His expression is serious and enigmatic, half of his face obscured by a pigeon in the foreground. Moody lighting with strong shadows and highlights, high-contrast monochrome film style, grainy analog texture, surreal mystical fashion",
      rating: 4.8,
      reviews: 156,
      imageUrl: "/images/men3.jpg"
    },
    {
      title: "Men's Portrait Session",
      description: "Create a retro vintage grainy but bright image of the reference picture but draped in a perfect brown color Pinteresty. Wearing blue denim Levi's jeans, blue denim Levi's jacket with white sandow. It must feel like a 90s movie, short hair and romanticising environment. The man is standing against a solid wall with deep shadows and contrast drama, creating a mysterious and artistic atmosphere where the lighting is warm with golden tones evoking a sunset. Use the face from the uploaded reference image and preserve the same facial features — do not alter the face.",
      rating: 4.8,
      reviews: 156,
      imageUrl: "/images/men4.jpg"
    },
    {
      title: "Men's Portrait Session",
      description: "Create a hyper-realistic cinematic lifestyle portrait entirely based on the uploaded reference photo, keeping the exact same face, hairstyle, and overall appearance with no alterations. A stylish young Indian man lounges confidently on a modern hanging wicker chair, dressed in a trendy all-white coord set with a casual T-shirt and open shirt, paired with colorful designer sneakers and a luxury wristwatch. His expression is cool and composed as he slightly leans back with a relaxed posture, wearing dark sunglasses that add charisma to his look. The setting is a minimal outdoor terrace with subtle decor, soft natural daylight, and a clean modern vibe. Captured in ultra-detailed 8K resolution with sharp textures, natural skin tones, realistic shadows, and a premium fashion editorial aesthetic.",
      rating: 4.8,
      reviews: 156,
      imageUrl: "/images/men5.jpg"
    },
    {
      title: "Outdoor Adventure Shoot",
      description: "Fashion editorial cinematic portrait, blurred silhouettes trailing foreground, Man Fashionable Costume,glowing in dusky attic atmosphere. Shot on Sony A7R V + 135mm f/1.8 lens, bokeh-heavy shallow depth. Lighting: soft window light + haze diffusion, warm amber prism glow. Background: wooden beams, diffused matte glass with vertical stripes. Styling: , messy loose bun. Editorial mood: Dazed magazine dreamscape. Keywords: cinematic dusky tones, lens flare, 3:4, tonal haze, art direction",
      rating: 4.9,
      reviews: 142,
      imageUrl: "/images/men6.jpg"
    }
  ],
  couple: [
    {
      title: "Engagement Session",
      description: "Capture your love story with our romantic engagement photo session.",
      rating: 5.0,
      reviews: 189,
      imageUrl: ""
    },
    {
      title: "Anniversary Shoot",
      description: "Celebrate your journey together with a romantic anniversary session.",
      rating: 4.9,
      reviews: 145,
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80"
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
    }
  ]
};

export default function FeaturesSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('men');
  const { toast } = useToast();

  const handleCopyPrompt = useCallback(async (product: Product) => {
    try {
      const text = `${product.title}\n${product.description}`;
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The prompt has been copied to your clipboard.",
        duration: 2000
      });
    } catch (error) {
      console.error('Failed to copy text: ', error);
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <section className="min-h-screen py-14">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-saas-orange opacity-10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-orange-700 opacity-15 rounded-full blur-[80px]"></div>
      <div className="absolute top-20 right-1/4 w-[250px] h-[250px] bg-orange-400 opacity-10 rounded-full blur-[70px]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Copy The <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Prompt</span>
            </h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {products[activeCategory].map((product, index) => (
            <Card
              key={index}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-white/20 hover:ring-1 hover:ring-white/10 transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={product.imageUrl}
                  alt={`${product.title} - AI prompt example`}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="leading-none">{product.rating}</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center bg-black/40 backdrop-blur text-white/90 text-xs px-2 py-1 rounded-full">
                    {product.reviews} reviews
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex capitalize bg-white/85 text-gray-900 text-xs px-2.5 py-1 rounded-full">
                    {activeCategory}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base md:text-lg font-semibold text-white">{product.title}</h3>
                <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleCopyPrompt(product)}
                    className="inline-flex items-center gap-2 rounded-md bg-saas-orange text-white px-3 py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-saas-black transition-colors"
                    aria-label={`Copy prompt for ${product.title}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy prompt
                  </button>
                  <span className="ml-auto text-xs text-gray-400 hidden md:inline">
                    Tip: customize the text after copying
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}