import { PAGES, SHARED_FIELDS, type ThemeSettings, FONT_OPTIONS } from "./schema";
import { TEMPLATES } from "./templates";
import type { AssetItem } from "./store";

// Verilen şablon HTML'ine state uygulayıp final HTML üretir.
// imageMode: "embed-data-url" → görseller src="data:..." olarak kalır (tek dosya indirme)
//            "zip-relative" → görseller "images/{name}" olarak referanslanır (ZIP indirme)
export function renderPage(opts: {
  pageId: string;
  content: Record<string, string>;
  theme: ThemeSettings;
  assets: AssetItem[];
  imageMode: "embed-data-url" | "zip-relative";
}): string {
  const page = PAGES.find((p) => p.id === opts.pageId);
  if (!page) return "";
  const tpl = TEMPLATES[page.templateKey];
  if (typeof window === "undefined") return tpl;

  const doc = new DOMParser().parseFromString(tpl, "text/html");

  const allFields = [...SHARED_FIELDS, ...page.fields];
  for (const f of allFields) {
    const value = opts.content[f.id];
    if (value === undefined) continue;
    const el = doc.querySelector(f.selector);
    if (!el) continue;
    if (f.attr) {
      el.setAttribute(f.attr, value);
    } else if (f.type === "text") {
      el.textContent = value;
    } else {
      el.innerHTML = value;
    }
  }

  // Tema renkleri ve fontu — :root değişkenlerini override eden bir <style> ekle
  const themeStyle = doc.createElement("style");
  themeStyle.setAttribute("data-cms-theme", "true");
  themeStyle.textContent = `
:root {
  --bg: ${opts.theme.bg} !important;
  --accent: ${opts.theme.accent} !important;
  --text: ${opts.theme.text} !important;
  --text-dim: ${opts.theme.textDim} !important;
}
html { font-size: ${opts.theme.baseFontSize}px; }
body { font-family: ${opts.theme.fontFamily} !important; }
`;
  doc.head.appendChild(themeStyle);

  // Eğer özel bir Google Font seçildiyse, link ekle
  const selectedFont = FONT_OPTIONS.find((f) => f.value === opts.theme.fontFamily);
  if (selectedFont && selectedFont.googleName !== "Plus+Jakarta+Sans:wght@300;400;600;800") {
    const link = doc.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", `https://fonts.googleapis.com/css2?family=${selectedFont.googleName}&display=swap`);
    doc.head.appendChild(link);
  }

  // Vanta arka plan rengi tema ile senkron — body'deki script'i yakalayıp accent rengini güncelle
  // Basit yaklaşım: scriptin içindeki 0x007aff ve 0x05070a değerlerini değiştir
  const accentHex = opts.theme.accent.replace("#", "0x").toLowerCase();
  const bgHex = opts.theme.bg.replace("#", "0x").toLowerCase();
  const scripts = doc.querySelectorAll("script:not([src])");
  scripts.forEach((s) => {
    if (s.textContent && s.textContent.includes("VANTA")) {
      s.textContent = s.textContent
        .replace(/0x007aff/gi, accentHex)
        .replace(/0x05070a/gi, bgHex);
    }
  });

  // Görselleri çöz: src="cms-asset://{id}" → gerçek URL
  const imgs = doc.querySelectorAll('img[src^="cms-asset://"]');
  imgs.forEach((img) => {
    const src = img.getAttribute("src") || "";
    const id = src.replace("cms-asset://", "");
    const asset = opts.assets.find((a) => a.id === id);
    if (!asset) return;
    if (opts.imageMode === "embed-data-url") {
      img.setAttribute("src", asset.dataUrl);
    } else {
      img.setAttribute("src", `images/${asset.name}`);
    }
  });

  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
}

// Önizleme için iframe'e basılacak — link tıklamalarını engellemek istiyoruz
// ama o iş PreviewFrame'de yapılacak. Burada sadece raw HTML lazım.
