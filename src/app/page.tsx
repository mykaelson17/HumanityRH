import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { MapPin, Heart, Clock as Timer } from "lucide-react";
import { HeroCarousel } from "@/components/ui/HeroCarousel";

export const dynamic = "force-dynamic";

export default async function Home() {

  const settingsList = await prisma.siteSetting.findMany();
  const settings = settingsList.reduce((acc: any, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  const imagesList = await prisma.heroImage.findMany({ orderBy: { order: "asc" } });
  const images = imagesList.map(img => img.url);

  const title = settings.heroTitle || `O portal de vagas de empregos <br /><span style="color: #fde047">mais amado do Brasil.</span>`;
  const subtitle = settings.heroSubtitle || "Conectando o perfil certo com a oportunidade ideal.";

  const card1Title = settings.card1Title || "8 em cada 10 candidatos";
  const card1Subtitle = settings.card1Subtitle || "gostam ou amam a nossa plataforma";
  const card2Title = settings.card2Title || "65 mil vagas de emprego";
  const card2Subtitle = settings.card2Subtitle || "exclusivas todos os meses";
  const card3Title = settings.card3Title || "Inscrição 100% grátis";
  const card3Subtitle = settings.card3Subtitle || "de currículo para candidatos";

  const infoCards = [
    { 
      type: settings.info1Type || "text", 
      title: settings.info1Title || "Encontre sua vaga ideal", 
      content: settings.info1Content || "Milhares de oportunidades esperando por você em nossa plataforma.", 
      link: settings.info1Link || "/vagas", 
      image: settings.info1Image || "" 
    },
    { 
      type: settings.info2Type || "text", 
      title: settings.info2Title || "Sobre a MaisEmprego.aux", 
      content: settings.info2Content || "Conectamos talentos a grandes empresas.", 
      link: settings.info2Link || "/trabalhe-conosco", 
      image: settings.info2Image || "" 
    },
    { 
      type: settings.info3Type || "image", 
      title: settings.info3Title || "", 
      content: settings.info3Content || "", 
      link: settings.info3Link || "", 
      image: settings.info3Image || "" 
    },
    { 
      type: settings.info4Type || "image", 
      title: settings.info4Title || "", 
      content: settings.info4Content || "", 
      link: settings.info4Link || "", 
      image: settings.info4Image || "" 
    }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <main style={{ flex: 1, backgroundColor: "var(--bg-primary)" }}>
        
        <HeroCarousel title={title} subtitle={subtitle} images={images} />

        {/* Por que somos o melhor site */}
        <section style={{ padding: "4rem 0 4rem 0" }}>
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-10">Porque somos o melhor site de empregos do Brasil</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center flex flex-col items-center justify-center" style={{ border: "1px solid var(--brand-secondary)", padding: "3rem 1.5rem" }}>
                <Heart size={28} className="mb-4" style={{ color: "var(--brand-primary)" }} fill="currentColor" />
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{card1Title}</h3>
                <p className="font-bold" style={{ color: "var(--brand-primary)" }}>{card1Subtitle}</p>
              </Card>
              <Card className="text-center flex flex-col items-center justify-center" style={{ border: "1px solid var(--brand-secondary)", padding: "3rem 1.5rem" }}>
                <Timer size={28} className="mb-4" style={{ color: "var(--brand-primary)" }} />
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{card2Title}</h3>
                <p style={{ color: "var(--text-secondary)" }}>{card2Subtitle}</p>
              </Card>
              <Card className="text-center flex flex-col items-center justify-center" style={{ border: "1px solid var(--brand-secondary)", padding: "3rem 1.5rem" }}>
                <div className="mb-4 text-xl font-bold" style={{ color: "var(--brand-primary)" }}>R$</div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{card3Title}</h3>
                <p style={{ color: "var(--text-secondary)" }}>{card3Subtitle}</p>
              </Card>
            </div>
            <p className="text-xs mt-4 text-center" style={{ color: "var(--text-tertiary)" }}>*Em pesquisa de satisfação com mais de 5000 candidatos</p>
          </div>
        </section>

        {/* Cards Informativos Dinâmicos */}
        <section style={{ padding: "2rem 0 5rem 0" }}>
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {infoCards.map((card, idx) => (
                <div key={idx} className="flex h-full w-full">
                  {card.type === "image" ? (
                    <Link href={card.link || "#"} className="w-full h-full block relative rounded-xl overflow-hidden group" style={{ minHeight: "280px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
                      {card.image ? (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}>
                          <img 
                            src={card.image} 
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} 
                            alt={`Card ${idx + 1}`} 
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "var(--text-tertiary)", backgroundColor: "var(--bg-tertiary)", position: "absolute", top: 0, left: 0 }}>
                          Imagem não configurada
                        </div>
                      )}
                    </Link>
                  ) : (
                    <Card className="flex flex-col justify-between w-full h-full" style={{ padding: "3rem 2.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
                      <div>
                        <h3 className="text-3xl font-bold mb-4" style={{ color: "var(--brand-primary)" }}>{card.title}</h3>
                        <p className="text-lg" style={{ color: "var(--text-secondary)" }}>{card.content}</p>
                      </div>
                      {card.link && (
                        <div className="mt-8">
                          <Link href={card.link}>
                            <Button variant="primary" style={{ padding: "0.75rem 2rem", fontSize: "1.05rem" }}>Acessar</Button>
                          </Link>
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer style={{ padding: "2rem 0", borderTop: "1px solid var(--border-color)", textAlign: "center", color: "var(--text-tertiary)", backgroundColor: "white" }}>
        <p>&copy; {new Date().getFullYear()} MaisEmprego.aux. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
