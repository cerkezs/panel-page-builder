import { useRef } from "react";
import { useCMS, type AssetItem } from "@/lib/cms/store";
import { Button } from "@/components/ui/button";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function AssetsPanel() {
  const assets = useCMS((s) => s.assets);
  const addAsset = useCMS((s) => s.addAsset);
  const removeAsset = useCMS((s) => s.removeAsset);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} 2MB'den büyük — atlanıyor`);
        continue;
      }
      const dataUrl = await fileToDataUrl(file);
      const asset: AssetItem = {
        id: uid(),
        name: file.name.replace(/\s+/g, "-"),
        dataUrl,
        size: file.size,
        mime: file.type,
      };
      addAsset(asset);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border bg-card/50">
        <h3 className="text-base font-bold text-foreground">🖼️ Görsel Kütüphanesi</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Görselleriniz tarayıcıda saklanır, ZIP indirirken images/ klasörüne eklenir
        </p>
      </div>

      <div className="p-5 border-b border-border">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button onClick={() => inputRef.current?.click()} className="w-full">
          + Görsel Yükle
        </Button>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Maks. 2MB / dosya — JPG, PNG, WebP, SVG
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {assets.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-12">
            Henüz görsel yüklenmedi.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {assets.map((a) => (
              <div
                key={a.id}
                className="border border-border rounded-lg overflow-hidden bg-input/30 group"
              >
                <div className="aspect-square bg-black/30 flex items-center justify-center overflow-hidden">
                  <img src={a.dataUrl} alt={a.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-2">
                  <div className="text-[10px] truncate font-mono">{a.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {(a.size / 1024).toFixed(0)} KB
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`cms-asset://${a.id}`);
                      alert("Asset referansı kopyalandı: cms-asset://" + a.id);
                    }}
                    className="text-[10px] text-primary hover:underline mt-1"
                  >
                    Referansı kopyala
                  </button>
                  <button
                    onClick={() => removeAsset(a.id)}
                    className="text-[10px] text-destructive hover:underline mt-1 ml-2"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
