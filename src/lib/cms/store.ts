import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME, type ThemeSettings, PAGES, SHARED_FIELDS } from "./schema";
import { TEMPLATES } from "./templates";

// Şablondan field'ın varsayılan değerini DOM parser ile çıkar.
function readFieldFromTemplate(templateHtml: string, selector: string, attr?: string): string {
  if (typeof window === "undefined") return "";
  const doc = new DOMParser().parseFromString(templateHtml, "text/html");
  const el = doc.querySelector(selector);
  if (!el) return "";
  if (attr) return el.getAttribute(attr) ?? "";
  return el.innerHTML.trim();
}

// İlk açılışta tüm sayfaların alanlarını şablonlardan oku ve content map'i oluştur.
function buildInitialContent(): Record<string, Record<string, string>> {
  // SSR-safe: window yoksa boş döndür; client-side hydrate sonrası dolar.
  if (typeof window === "undefined") return {};
  const out: Record<string, Record<string, string>> = {};
  for (const page of PAGES) {
    const tpl = TEMPLATES[page.templateKey];
    const map: Record<string, string> = {};
    // Shared fields ortak ama her sayfanın şablonunda da var; ilk sayfadan oku
    for (const f of [...SHARED_FIELDS, ...page.fields]) {
      map[f.id] = readFieldFromTemplate(tpl, f.selector, f.attr);
    }
    out[page.id] = map;
  }
  return out;
}

export interface AssetItem {
  id: string;
  name: string;
  dataUrl: string; // base64 data URL — localStorage'da saklanır, ZIP içine images/ olarak yazılır
  size: number;
  mime: string;
}

interface CMSState {
  theme: ThemeSettings;
  // pageId → fieldId → değer
  content: Record<string, Record<string, string>>;
  assets: AssetItem[];
  initialized: boolean;

  setTheme: (patch: Partial<ThemeSettings>) => void;
  setField: (pageId: string, fieldId: string, value: string) => void;
  resetPage: (pageId: string) => void;
  resetAll: () => void;
  addAsset: (asset: AssetItem) => void;
  removeAsset: (id: string) => void;
  hydrateFromTemplates: () => void;
}

export const useCMS = create<CMSState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      content: {},
      assets: [],
      initialized: false,

      setTheme: (patch) => set({ theme: { ...get().theme, ...patch } }),
      setField: (pageId, fieldId, value) =>
        set({
          content: {
            ...get().content,
            [pageId]: { ...(get().content[pageId] ?? {}), [fieldId]: value },
          },
        }),
      resetPage: (pageId) => {
        const fresh = buildInitialContent();
        set({
          content: { ...get().content, [pageId]: fresh[pageId] ?? {} },
        });
      },
      resetAll: () =>
        set({
          theme: DEFAULT_THEME,
          content: buildInitialContent(),
          assets: [],
        }),
      addAsset: (asset) => set({ assets: [...get().assets, asset] }),
      removeAsset: (id) => set({ assets: get().assets.filter((a) => a.id !== id) }),
      hydrateFromTemplates: () => {
        if (get().initialized) return;
        const initial = buildInitialContent();
        // Sadece eksik alanları doldur — kullanıcı düzenlemelerine dokunma
        const merged: Record<string, Record<string, string>> = {};
        for (const pageId of Object.keys(initial)) {
          merged[pageId] = { ...initial[pageId], ...(get().content[pageId] ?? {}) };
        }
        set({ content: merged, initialized: true });
      },
    }),
    {
      name: "serdar-cms-v1",
      // SSR'da localStorage yok — isteğe bağlı skipHydration
      skipHydration: true,
    }
  )
);
