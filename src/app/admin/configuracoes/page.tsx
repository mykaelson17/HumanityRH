"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Upload, Trash, Save } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({ 
    heroTitle: "", 
    heroSubtitle: "",
    card1Title: "", card1Subtitle: "",
    card2Title: "", card2Subtitle: "",
    card3Title: "", card3Subtitle: "",
    info1Type: "text", info1Title: "", info1Content: "", info1Link: "", info1Image: "",
    info2Type: "text", info2Title: "", info2Content: "", info2Link: "", info2Image: "",
    info3Type: "text", info3Title: "", info3Content: "", info3Link: "", info3Image: "",
    info4Type: "text", info4Title: "", info4Content: "", info4Link: "", info4Image: "",
  });
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings({ 
          heroTitle: data.settings.heroTitle || "O portal de vagas de empregos mais amado do Brasil.", 
          heroSubtitle: data.settings.heroSubtitle || "Conectando o perfil certo com a oportunidade ideal.",
          card1Title: data.settings.card1Title || "8 em cada 10 candidatos",
          card1Subtitle: data.settings.card1Subtitle || "gostam ou amam a nossa plataforma",
          card2Title: data.settings.card2Title || "65 mil vagas de emprego",
          card2Subtitle: data.settings.card2Subtitle || "exclusivas todos os meses",
          card3Title: data.settings.card3Title || "Inscrição 100% grátis",
          card3Subtitle: data.settings.card3Subtitle || "de currículo para candidatos",
          
          info1Type: data.settings.info1Type || "text",
          info1Title: data.settings.info1Title || "Encontre sua vaga ideal",
          info1Content: data.settings.info1Content || "Milhares de oportunidades esperando por você em nossa plataforma.",
          info1Link: data.settings.info1Link || "/vagas",
          info1Image: data.settings.info1Image || "",
          
          info2Type: data.settings.info2Type || "text",
          info2Title: data.settings.info2Title || "Sobre a Humanity",
          info2Content: data.settings.info2Content || "Conectamos talentos a grandes empresas.",
          info2Link: data.settings.info2Link || "/trabalhe-conosco",
          info2Image: data.settings.info2Image || "",

          info3Type: data.settings.info3Type || "image",
          info3Title: data.settings.info3Title || "",
          info3Content: data.settings.info3Content || "",
          info3Link: data.settings.info3Link || "",
          info3Image: data.settings.info3Image || "",

          info4Type: data.settings.info4Type || "image",
          info4Title: data.settings.info4Title || "",
          info4Content: data.settings.info4Content || "",
          info4Link: data.settings.info4Link || "",
          info4Image: data.settings.info4Image || "",
        });
        if (data.images) setImages(data.images);
        setLoading(false);
      });
  }, []);

  const handleSaveText = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    alert("Textos salvos!");
    setSaving(false);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (images.length >= 7) return alert("Limite de 7 imagens atingido.");

    const form = new FormData();
    form.append("image", e.target.files[0]);

    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (res.ok) {
      setImages([...images, data.image]);
    } else {
      alert(data.error);
    }
    setSaving(false);
  };

  const handleUploadFieldImage = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    if (!e.target.files || !e.target.files[0]) return;

    const form = new FormData();
    form.append("image", e.target.files[0]);
    form.append("targetField", targetField);

    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (res.ok) {
      setSettings(prev => ({ ...prev, [targetField]: data.url }));
    } else {
      alert(data.error);
    }
    setSaving(false);
  };

  const handleDeleteImage = async (id: string) => {
    // In a real app we would call DELETE /api/admin/settings/images/[id]
    // For MVP, we can just skip or add a simple delete route.
    alert("Para MVP a exclusão via API precisa ser implementada. O ideal é adicionar uma rota DELETE.");
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Configurações da Tela Inicial</h1>

      <Card className="mb-8">
        <h2 className="text-xl font-bold mb-4">Textos Principais</h2>
        <form onSubmit={handleSaveText} className="flex flex-col gap-4">
          <div className="input-group m-0">
            <label className="input-label">Título Principal (Hero)</label>
            <input 
              className="input-field w-full" 
              value={settings.heroTitle} 
              onChange={e => setSettings({...settings, heroTitle: e.target.value})} 
            />
          </div>
          <div className="input-group m-0">
            <label className="input-label">Subtítulo (Hero)</label>
            <input 
              className="input-field w-full" 
              value={settings.heroSubtitle} 
              onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} 
            />
          </div>
          <Button type="submit" disabled={saving} className="self-end flex items-center gap-2 mt-4">
            <Save size={16} /> Salvar Configurações
          </Button>
        </form>
      </Card>

      <Card className="mb-8">
        <h2 className="text-xl font-bold mb-4">Cards de Vantagens (Home)</h2>
        <form onSubmit={handleSaveText} className="flex flex-col gap-6">
          {/* Card 1 */}
          <div className="grid md:grid-cols-2 gap-4 p-4 border rounded" style={{ borderColor: "var(--border-color)" }}>
            <div className="input-group m-0">
              <label className="input-label">Card 1 - Título (Destaque)</label>
              <input className="input-field w-full" value={settings.card1Title} onChange={e => setSettings({...settings, card1Title: e.target.value})} />
            </div>
            <div className="input-group m-0">
              <label className="input-label">Card 1 - Subtítulo</label>
              <input className="input-field w-full" value={settings.card1Subtitle} onChange={e => setSettings({...settings, card1Subtitle: e.target.value})} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="grid md:grid-cols-2 gap-4 p-4 border rounded" style={{ borderColor: "var(--border-color)" }}>
            <div className="input-group m-0">
              <label className="input-label">Card 2 - Título (Destaque)</label>
              <input className="input-field w-full" value={settings.card2Title} onChange={e => setSettings({...settings, card2Title: e.target.value})} />
            </div>
            <div className="input-group m-0">
              <label className="input-label">Card 2 - Subtítulo</label>
              <input className="input-field w-full" value={settings.card2Subtitle} onChange={e => setSettings({...settings, card2Subtitle: e.target.value})} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="grid md:grid-cols-2 gap-4 p-4 border rounded" style={{ borderColor: "var(--border-color)" }}>
            <div className="input-group m-0">
              <label className="input-label">Card 3 - Título (Destaque)</label>
              <input className="input-field w-full" value={settings.card3Title} onChange={e => setSettings({...settings, card3Title: e.target.value})} />
            </div>
            <div className="input-group m-0">
              <label className="input-label">Card 3 - Subtítulo</label>
              <input className="input-field w-full" value={settings.card3Subtitle} onChange={e => setSettings({...settings, card3Subtitle: e.target.value})} />
            </div>
          </div>

          <Button type="submit" disabled={saving} className="self-end flex items-center gap-2 mt-2">
            <Save size={16} /> Salvar Cards
          </Button>
        </form>
      </Card>

      <Card className="mb-8">
        <h2 className="text-xl font-bold mb-4">Cards Informativos (Rodapé da Home)</h2>
        <form onSubmit={handleSaveText} className="flex flex-col gap-6">
          {[1, 2, 3, 4].map((num) => {
            const typeKey = `info${num}Type` as keyof typeof settings;
            const titleKey = `info${num}Title` as keyof typeof settings;
            const contentKey = `info${num}Content` as keyof typeof settings;
            const linkKey = `info${num}Link` as keyof typeof settings;
            const imageKey = `info${num}Image` as keyof typeof settings;

            return (
              <div key={num} className="p-4 border rounded flex flex-col gap-4" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Espaço {num}</h3>
                  <select 
                    className="input-field py-1"
                    value={settings[typeKey] as string}
                    onChange={e => setSettings({...settings, [typeKey]: e.target.value})}
                  >
                    <option value="text">Card de Texto</option>
                    <option value="image">Card de Imagem</option>
                  </select>
                </div>

                {settings[typeKey] === "text" ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="input-group m-0">
                      <label className="input-label">Título</label>
                      <input className="input-field w-full" value={settings[titleKey] as string} onChange={e => setSettings({...settings, [titleKey]: e.target.value})} />
                    </div>
                    <div className="input-group m-0">
                      <label className="input-label">Conteúdo (Subtítulo)</label>
                      <input className="input-field w-full" value={settings[contentKey] as string} onChange={e => setSettings({...settings, [contentKey]: e.target.value})} />
                    </div>
                    <div className="input-group m-0 md:col-span-2">
                      <label className="input-label">Link do Botão (ex: /vagas)</label>
                      <input className="input-field w-full" value={settings[linkKey] as string} onChange={e => setSettings({...settings, [linkKey]: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      {settings[imageKey] && (
                        <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden relative">
                          <img src={settings[imageKey] as string} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="btn btn-secondary cursor-pointer">
                        <Upload size={16} /> Enviar Nova Imagem
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleUploadFieldImage(e, imageKey)} />
                      </label>
                    </div>
                    <div className="input-group m-0">
                      <label className="input-label">Link de Destino da Imagem (Opcional)</label>
                      <input className="input-field w-full" value={settings[linkKey] as string} onChange={e => setSettings({...settings, [linkKey]: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Button type="submit" disabled={saving} className="self-end flex items-center gap-2 mt-2">
            <Save size={16} /> Salvar Cards Informativos
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Imagens do Carrossel (Máx 7)</h2>
          <label className="btn btn-primary cursor-pointer flex items-center gap-2">
            <Upload size={16} /> Enviar Imagem
            <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} disabled={saving || images.length >= 7} />
          </label>
        </div>
        
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Estas imagens ficarão rotacionando no fundo da tela inicial a cada 10 segundos. ({images.length}/7 enviadas)
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative aspect-video rounded border overflow-hidden group">
              <img src={img.url} className="w-full h-full object-cover" alt="Hero" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button variant="outline" className="border-danger text-danger bg-white" onClick={() => handleDeleteImage(img.id)}>
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-8 text-center" style={{ color: "var(--text-tertiary)" }}>
              Nenhuma imagem cadastrada. A home usará o fundo azul padrão.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
