import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function TypewriterPhrases() {
  const phrases = ["AI photos", "cinematic portraits", "product shots", "creative concepts"]; 
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[idx % phrases.length];
    const delay = deleting ? 50 : 70;

    const t = setTimeout(() => {
      if (!deleting) {
        if (display.length < phrase.length) {
          setDisplay(phrase.slice(0, display.length + 1));
        } else {
          setDeleting(true);
        }
      } else {
        if (display.length > 0) {
          setDisplay(phrase.slice(0, display.length - 1));
        } else {
          setDeleting(false);
          setIdx((v) => v + 1);
        }
      }
    }, display.length === 0 ? 400 : delay);

    return () => clearTimeout(t);
  }, [display, deleting, idx]);

  return (
    <div className="relative inline-flex items-center mb-6">
      <span className="text-xl md:text-2xl text-white/90">AI-generated </span>
      <span className="text-xl md:text-2xl font-semibold text-white ml-2">
        {display}
        <span className="typewriter-caret">|</span>
      </span>
    </div>
  );
}

const HeroSection = () => {
  const navigate = useNavigate();
  const [heroPrompt, setHeroPrompt] = useState("");
  const handleGenerateClick = () => {
    const query = heroPrompt ? `?prompt=${encodeURIComponent(heroPrompt)}` : "";
    navigate(`/try-on${query}`);
  };
  return (
    <div className="relative bg-gradient-to-b from-saas-black to-[#1c160c] overflow-hidden min-h-[92vh] flex items-center">
      {/* Magic particles */}
      <ParticlesCanvas />
      {/* Orange glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-saas-orange opacity-10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-orange-700 opacity-15 rounded-full blur-[80px]"></div>
      <div className="absolute top-20 right-1/4 w-[250px] h-[250px] bg-orange-400 opacity-10 rounded-full blur-[70px]"></div>
      
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <span className="inline-block bg-saas-orange/10 text-saas-orange px-4 py-2 rounded-full text-sm font-medium mb-6 border border-saas-orange/20">
              Promptory v1.0
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Transform your ideas into reality with
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"> Promptory</span>
            </h1>

            {/* Typewriter sub-headline */}
            <TypewriterPhrases />
            
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
            Turn your ideas into stunning photos instantly with our AI-powered platform. Enjoy effortless creativity, fast results, and a smooth experience designed just for you.            </p>
            
            {/* Prompt input CTA */}
            <div className="glass polish-hover rounded-xl p-2 md:p-3 mb-5">
              <div className="flex items-center gap-2">
                <input
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  placeholder='Describe your photo idea (e.g. "sunset portrait with warm tones")'
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400 px-3 py-3"
                />
                <Button onClick={handleGenerateClick} className="relative shine bg-saas-orange hover:bg-orange-600 text-white font-semibold px-5">
                  Try On Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="relative shine bg-saas-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-saas-orange text-saas-orange hover:bg-saas-orange hover:text-white">
                Book Demo
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" 
                  className="w-10 h-10 rounded-full border-2 border-saas-black float-fast" alt="User" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" 
                  className="w-10 h-10 rounded-full border-2 border-saas-black float-medium" alt="User" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64" 
                  className="w-10 h-10 rounded-full border-2 border-saas-black float-slow" alt="User" />
              </div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-saas-orange">500+</span> People already using our platform
              </p>
            </div>
          </div>

          {/* Right visual column */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 -z-10 bg-grid opacity-[0.15]" />
            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-orange-500/10 blur-2xl float-slow" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-orange-400/10 blur-2xl float-medium" />

            <div className="grid grid-cols-2 gap-4">
              <img src="/images/men1.jpg" alt="Preview 1" className="rounded-xl glass polish-hover float-medium" />
              <img src="/images/men3.jpg" alt="Preview 2" className="rounded-xl glass polish-hover float-fast" />
              <img src="/images/men2.jpg" alt="Preview 3" className="rounded-xl glass polish-hover float-slow" />
              <img src="/images/men5.jpg" alt="Preview 4" className="rounded-xl glass polish-hover float-medium" />
            </div>

            <div className="mt-4 glass rounded-xl p-4 flex items-center gap-3 polish-hover">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-300">★</div>
              <div>
                <p className="text-sm text-white/90 font-medium">Cinematic Portrait Prompt</p>
                <p className="text-xs text-gray-400">One-tap copy for stunning results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Abstract shapes */}
      <div className="absolute bottom-10 left-10 w-20 h-20 border border-saas-orange/20 rounded-full"></div>
      <div className="absolute top-20 right-10 w-10 h-10 border border-saas-orange/20 rounded-full"></div>
      <div className="absolute top-40 left-20 w-5 h-5 bg-saas-orange/20 rounded-full"></div>
    </div>
  );
};

export default HeroSection;

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{x:number;y:number;vx:number;vy:number;size:number;life:number;color:string}>>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = Math.max(window.innerHeight * 0.9, 600));

    const colors = ['#fb923c', '#fdba74', '#fff7ed'];

    function spawnParticle() {
      const size = Math.random() * 2 + 0.6;
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.3 - 0.1,
        size,
        life: Math.random() * 120 + 60,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      if (particlesRef.current.length < 120) {
        for (let i = 0; i < 4; i++) spawnParticle();
      }
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
        if (p.y < -10 || p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 180));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    function onResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = Math.max(window.innerHeight * 0.9, 600);
    }

    window.addEventListener('resize', onResize);
    tick();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 opacity-60 mix-blend-screen pointer-events-none"
    />
  );
}
