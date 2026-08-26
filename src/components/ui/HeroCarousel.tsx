"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
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
    }, 10000);
    return () => clearInterval(interval);
  }, [images]);

  const hasImage = images.length > 0;

  const bgStyle = hasImage
    ? {
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <>
      <section
        style={{
          ...bgStyle,
          position: "relative",
          padding: "8rem 0 10.5rem",
          textAlign: "center",
          color: "white",
          transition: "background-image 1s ease-in-out",
          overflow: "hidden",
          background: hasImage ? undefined : "var(--brand-gradient)",
        }}
      >
        {/* Overlay quando tem imagem */}
        {hasImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(27,79,216,0.82) 0%, rgba(30,58,138,0.88) 100%)",
              zIndex: 1,
            }}
          />
        )}

        {/* Decorative circles quando não tem imagem */}
        {!hasImage && (
          <>
            <div style={{
              position: "absolute", zIndex: 1,
              width: "500px", height: "500px", borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              top: "-120px", right: "-80px",
            }} />
            <div style={{
              position: "absolute", zIndex: 1,
              width: "320px", height: "320px", borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              bottom: "40px", left: "-60px",
            }} />
            {/* Accent blob laranja */}
            <div style={{
              position: "absolute", zIndex: 1,
              width: "180px", height: "180px", borderRadius: "50%",
              background: "rgba(249,115,22,0.18)",
              bottom: "80px", right: "15%",
            }} />
          </>
        )}

        {/* Content */}
        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "99px",
            background: "rgba(249,115,22,0.25)",
            border: "1px solid rgba(249,115,22,0.4)",
            color: "#FED7AA",
            fontSize: "0.8rem", fontWeight: 700,
            letterSpacing: "0.04em",
            marginBottom: "1.5rem",
            textTransform: "uppercase",
          }}>
            ✨ Portal de Vagas
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
              color: "white",
            }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>

          {/* Dot indicators */}
          {images.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  style={{
                    width: i === currentImageIndex ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "99px",
                    background: i === currentImageIndex ? "white" : "rgba(255,255,255,0.4)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Search Box */}
      <section style={{ marginTop: "-5.5rem", position: "relative", zIndex: 50, padding: "0 1rem", marginBottom: "4rem" }}>
        <div className="container">
          <div style={{
            backgroundColor: "white",
            padding: "1.5rem 1.75rem",
            borderRadius: "16px",
            boxShadow: "0 20px 40px -8px rgba(27,79,216,0.18), 0 8px 16px -4px rgba(0,0,0,0.08)",
            border: "1px solid rgba(27,79,216,0.08)",
          }}>
            <form action="/vagas" style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-end", width: "100%" }}>
              {/* Campo vaga */}
              <div style={{ flex: "4 1 250px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.5rem", letterSpacing: "0.02em" }}>
                  Qual vaga de emprego procura?
                </label>
                <div style={{
                  display: "flex", alignItems: "center",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "0.65rem 0.875rem",
                  gap: "0.5rem",
                  transition: "var(--transition)",
                  background: "var(--bg-primary)",
                }}
                  onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(27,79,216,0.1)"; }}
                  onBlurCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <Search size={17} color="var(--text-tertiary)" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Nome da vaga, cargo ou área..."
                    style={{
                      flex: 1,
                      background: "transparent", border: "none", outline: "none",
                      fontSize: "0.9rem", color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              {/* Campo localidade */}
              <div style={{ flex: "3 1 200px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.5rem", letterSpacing: "0.02em" }}>
                  Onde?
                </label>
                <div style={{
                  display: "flex", alignItems: "center",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "0.65rem 0.875rem",
                  gap: "0.5rem",
                  transition: "var(--transition)",
                  background: "var(--bg-primary)",
                }}
                  onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(27,79,216,0.1)"; }}
                  onBlurCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <MapPin size={17} color="var(--text-tertiary)" />
                  <input
                    type="text"
                    name="city"
                    placeholder="Cidade ou estado"
                    style={{
                      flex: 1,
                      background: "transparent", border: "none", outline: "none",
                      fontSize: "0.9rem", color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              {/* Botão */}
              <div style={{ flex: "1.5 1 140px" }}>
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1.25rem",
                    fontSize: "0.9375rem",
                    borderRadius: "10px",
                  }}
                >
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
