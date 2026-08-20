"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type HeroCarouselProps = {
  title: string;
  subtitle: string;
  images: string[];
};

export function HeroCarousel({ title, subtitle, images }: HeroCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [images]);

  const bgStyle = images.length > 0 
    ? { backgroundImage: `url(${images[currentImageIndex]})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: "var(--brand-primary)" };

  return (
    <>
      <section style={{ 
        ...bgStyle,
        position: "relative",
        padding: "8rem 0 10rem 0", // Increased padding
        textAlign: "center",
        color: "white",
        transition: "background-image 1s ease-in-out"
      }}>
        {images.length > 0 && <div className="absolute inset-0 bg-black/60 z-0" />} {/* Overlay for readability */}
        
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white" dangerouslySetInnerHTML={{ __html: title }}></h1>
          <p className="text-xl md:text-2xl mb-8 mx-auto" style={{ color: "rgba(255, 255, 255, 0.9)", maxWidth: "800px" }}>
            {subtitle}
          </p>
        </div>
        
        {images.length === 0 && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 1, opacity: 0.2 }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", width: "30%", height: "100%", left: "5%" }}>
               <path d="M0,0 L100,50 L0,100 Z" fill="none" stroke="white" strokeWidth="2" />
            </svg>
            <circle cx="80%" cy="20%" r="5%" fill="none" stroke="white" strokeWidth="2" />
          </div>
        )}
      </section>

      {/* Floating Search Box */}
      <section style={{ marginTop: "-6rem", position: "relative", zIndex: 50, padding: "0 1rem", marginBottom: "4rem" }}>
        <div className="container">
          <div style={{ 
            backgroundColor: "white",
            padding: "1.25rem 1.5rem", 
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          }}>
            <form action="/vagas" style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-end", width: "100%" }}>
              <div style={{ flex: "4 1 280px" }}>
                <label className="text-xs font-bold mb-2" style={{ color: "#111827", display: "block" }}>Qual vaga de emprego procura?</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "8px", padding: "0.5rem 0.75rem", width: "100%" }}>
                  <Search size={18} style={{ color: "#6b7280" }} />
                  <input 
                    type="text" 
                    name="q" 
                    placeholder="Digite o nome da vaga ou cargo"
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "0.95rem", marginLeft: "0.5rem", padding: "0.25rem 0", color: "#111827" }}
                  />
                </div>
              </div>
              
              <div style={{ flex: "4 1 280px" }}>
                <label className="text-xs font-bold mb-2" style={{ color: "#111827", display: "block" }}>Onde você procura trabalho?</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "8px", padding: "0.5rem 0.75rem", width: "100%" }}>
                  <MapPin size={18} style={{ color: "#6b7280" }} />
                  <input 
                    type="text" 
                    name="city" 
                    placeholder="Digite o nome da cidade"
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "0.95rem", marginLeft: "0.5rem", padding: "0.25rem 0", color: "#111827" }}
                  />
                </div>
              </div>

              <div style={{ flex: "2 1 150px" }}>
                <Button type="submit" variant="primary" style={{ width: "100%", padding: "0.85rem 1.5rem", fontSize: "1rem", whiteSpace: "nowrap", borderRadius: "8px" }}>
                  Buscar vagas
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
