import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Loader, TrendingUp, Zap, Palette, Smile, Mail, Github, Linkedin, Twitter } from "lucide-react";
import * as THREE from 'three';

// Import all portfolio components as requested by the user
import CosmicPortfolio from "./CosmicPortfolio";
import SkyPortfolio from "./SkyPortfolio";
import ModernPortfolio from "./ModernPortfolio";
import Portfolio2 from "./Portfolio2";
import Portfolio3 from "./Portfolio3";


// =============================================================================
// HomePageContent Component
// This component contains all the content for the landing page.
// =============================================================================
function HomePageContent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [showContactMessage, setShowContactMessage] = useState(false);

  const templateCategories = {
    "Featured Templates": [
      { name: "Cosmic", route: "/cosmic", img: "https://placehold.co/600x400/2a0044/ffffff?text=Cosmic" },
    ],
    "Professional & Corporate": [
      { name: "Modern", route: "/modern", img: "https://placehold.co/600x400/171717/ffffff?text=Modern" },
      { name: "Personal", route: "/personal", img: "https://placehold.co/600x400/831843/fce7f3?text=Personal" },
    ],
    "Creative & Artistic": [
      { name: "Dynamic", route: "/dynamic", img: "https://placehold.co/600x400/312e81/e0e7ff?text=Dynamic" },
      { name: "Sky", route: "/sky", img: "https://placehold.co/600x400/e0f2fe/1e40af?text=Sky" },
    ],
    "Minimalist & Clean": [
      { name: "Clean", route: "/clean", img: "https://placehold.co/600x400/F3F4F6/6B7280?text=Minimalist" },
    ],
  };

  const handleSelectTemplate = (route) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(route);
      setIsLoading(false);
    }, 1000);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", contactForm);
    setShowContactMessage(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setShowContactMessage(false), 3000);
  };

  const HeroBackground = () => {
    const mountRef = useRef(null);
    useEffect(() => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 2;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 2000;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x9089fc,
        size: 0.01,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particlesGeometry, particleMaterial);
      scene.add(particles);
      const animate = () => {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
        renderer.render(scene, camera);
      };
      animate();
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }, []);
    return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-80" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10">
        <nav className="p-4 md:p-6 sticky top-0 bg-slate-950/70 backdrop-blur-sm z-20 shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a href="#top" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
              Template Hub
            </a>
            <div className="space-x-4 hidden md:block">
              {Object.keys(templateCategories).map(category => (
                <a
                  key={category}
                  href={`#${category.toLowerCase().replace(/\s/g, '-')}`}
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  {category}
                </a>
              ))}
              <a
                href="#contact"
                className="text-sm font-medium text-gray-300 hover:text-white transition"
              >
                Contact
              </a>
            </div>
          </div>
        </nav>
        <main className="px-6 pt-24">
          <section id="top" className="flex flex-col items-center justify-center text-center py-20 md:py-32 px-8 animate-fadeIn min-h-[60vh]">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
              Your Professional Portfolio, <br className="hidden md:inline" />Starts Here.
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 font-light max-w-3xl mx-auto mb-8">
              Explore a curated collection of modern, responsive, and customizable
              portfolio templates designed to help you showcase your work with
              confidence and style.
            </p>
            <a
              href="#featured-templates"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              Explore Templates
            </a>
          </section>
          <section className="p-8 md:p-16 mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose Our Templates?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/10 transition hover:scale-105">
                <TrendingUp className="mx-auto mb-4 text-purple-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Modern Design</h3>
                <p className="text-sm text-gray-400">
                  Stay ahead with sleek, professional, and contemporary layouts.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/10 transition hover:scale-105">
                <Zap className="mx-auto mb-4 text-blue-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Blazing Fast</h3>
                <p className="text-sm text-gray-400">
                  Optimized for performance to ensure quick loading times.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/10 transition hover:scale-105">
                <Palette className="mx-auto mb-4 text-pink-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Fully Customizable</h3>
                <p className="text-sm text-gray-400">
                  Easily adjust colors, fonts, and content to match your brand.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/10 transition hover:scale-105">
                <Smile className="mx-auto mb-4 text-green-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">Developer Friendly</h3>
                <p className="text-sm text-gray-400">
                  Clean, well-structured code that's a joy to work with.
                </p>
              </div>
            </div>
          </section>
          {isLoading && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
              <Loader size={64} className="animate-spin text-blue-400" />
              <span className="sr-only">Opening template...</span>
            </div>
          )}
          {Object.entries(templateCategories).map(([category, templates]) => (
            <div key={category} id={category.toLowerCase().replace(/\s/g, '-')}>
              <h2 className="text-3xl font-bold mt-16 mb-8 text-center">{category}</h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((tpl) => (
                  <div
                    key={tpl.name}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all transform hover:scale-105 hover:shadow-indigo-500/50"
                    onClick={() => handleSelectTemplate(tpl.route)}
                  >
                    <img
                      src={tpl.img}
                      alt={`${tpl.name} Portfolio Preview`}
                      className="w-full h-48 object-cover object-center rounded-t-2xl border-b-2 border-white/10"
                    />
                    <div className="p-6 flex flex-col items-center text-center">
                      <h2 className="text-xl md:text-2xl font-bold mb-2">
                        {tpl.name}
                      </h2>
                      <p className="text-sm text-gray-400 mb-4">
                        A unique design tailored for your work.
                      </p>
                      <button
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium shadow-lg transition transform hover:-translate-y-1"
                        onClick={(e) => { e.stopPropagation(); handleSelectTemplate(tpl.route); }}
                      >
                        View Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <section className="py-20 px-8 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What Developers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
                <p className="text-gray-300 mb-4 italic">
                  "This template saved me so much time. The design is perfect, and the code is incredibly clean. I highly recommend it!"
                </p>
                <p className="text-sm font-medium text-gray-400">- Alex R.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
                <p className="text-gray-300 mb-4 italic">
                  "Finally, a portfolio template that's both beautiful and functional. It was super easy to customize and launch."
                </p>
                <p className="text-sm font-medium text-gray-400">- Sam P.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
                <p className="text-gray-300 mb-4 italic">
                  "The designs are professional and modern. I was able to find a template that perfectly matched my personal style."
                </p>
                <p className="text-sm font-medium text-gray-400">- Jordan B.</p>
              </div>
            </div>
          </section>
          <section id="contact" className="text-center py-20 px-8 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's Talk
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Have questions about our templates or a custom project in mind?
              Reach out to us!
            </p>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 max-w-xl mx-auto shadow-lg border border-white/10">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="4"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
              {showContactMessage && (
                <div className="mt-4 p-4 rounded-xl bg-green-500/20 text-green-300">
                  Message sent! We'll get back to you soon.
                </div>
              )}
            </div>
          </section>
        </main>
        <footer className="p-6 text-center text-gray-500">
          <p>&copy; 2024 Template Hub. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" aria-label="GitHub"><Github size={24} className="hover:text-white transition" /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={24} className="hover:text-white transition" /></a>
            <a href="#" aria-label="Twitter"><Twitter size={24} className="hover:text-white transition" /></a>
          </div>
        </footer>
      </div>
    </div>
  );
}

// =============================================================================
// App Component (The Main Router)
// This component now handles the routing for the application.
// =============================================================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageContent />} />
        <Route path="/cosmic" element={<CosmicPortfolio />} />
        <Route path="/modern" element={<ModernPortfolio />} />
        <Route path="/personal" element={<Portfolio2 />} />
        <Route path="/dynamic" element={<Portfolio3 />} />
        <Route path="/sky" element={<SkyPortfolio />} />
       
      </Routes>
    </BrowserRouter>
  );
}