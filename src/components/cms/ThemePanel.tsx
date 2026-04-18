import { useCMS } from "@/lib/cms/store";
import { FONT_OPTIONS, DEFAULT_THEME } from "@/lib/cms/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PRESETS = [
  { name: "Mavi (varsayılan)", bg: "#05070a", accent: "#007AFF", text: "#f8fafc", textDim: "#94a3b8" },
  { name: "Mor", bg: "#0a0612", accent: "#8B5CF6", text: "#f8fafc", textDim: "#a1a1aa" },
  { name: "Turuncu", bg: "#0c0907", accent: "#F97316", text: "#fafaf9", textDim: "#a8a29e" },
  { name: "Yeşil", bg: "#05080a", accent: "#10B981", text: "#f8fafc", textDim: "#94a3b8" },
  { name: "Pembe", bg: "#0c0710", accent: "#EC4899", text: "#fdf4ff", textDim: "#a1a1aa" },
  { name: "Beyaz / Açık", bg: "#fafafa", accent: "#0066FF", text: "#0a0a0a", textDim: "#525252" },
];

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-md border border-border bg-input cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-input border-border font-mono text-xs"
        />
      </div>
    </div>
  );
}

export function ThemePanel() {
  const theme = useCMS((s) => s.theme);
  const setTheme = useCMS((s) => s.setTheme);

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border bg-card/50">
        <h3 className="text-base font-bold text-foreground">🎨 Renk & Yazı Tipi</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Site genelinde uygulanır
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-wider font-bold text-primary border-b border-primary/20 pb-1.5">
            Hazır Paletler
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setTheme(p)}
                className="p-3 rounded-lg border border-border hover:border-primary transition-colors text-left bg-input/30"
              >
                <div className="flex gap-1.5 mb-2">
                  <span className="size-4 rounded-full border border-border/50" style={{ background: p.bg }} />
                  <span className="size-4 rounded-full border border-border/50" style={{ background: p.accent }} />
                  <span className="size-4 rounded-full border border-border/50" style={{ background: p.text }} />
                </div>
                <div className="text-xs font-medium">{p.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-wider font-bold text-primary border-b border-primary/20 pb-1.5">
            Renkler
          </div>
          <ColorRow label="Arka Plan" value={theme.bg} onChange={(v) => setTheme({ bg: v })} />
          <ColorRow label="Vurgu Rengi (Aksan)" value={theme.accent} onChange={(v) => setTheme({ accent: v })} />
          <ColorRow label="Yazı Rengi" value={theme.text} onChange={(v) => setTheme({ text: v })} />
          <ColorRow label="Soluk Yazı" value={theme.textDim} onChange={(v) => setTheme({ textDim: v })} />
        </div>

        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-wider font-bold text-primary border-b border-primary/20 pb-1.5">
            Tipografi
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Yazı Tipi</Label>
            <select
              value={theme.fontFamily}
              onChange={(e) => setTheme({ fontFamily: e.target.value })}
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Temel Yazı Boyutu: {theme.baseFontSize}px
            </Label>
            <input
              type="range"
              min={12}
              max={20}
              step={1}
              value={theme.baseFontSize}
              onChange={(e) => setTheme({ baseFontSize: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setTheme(DEFAULT_THEME)}
        >
          Varsayılana döndür
        </Button>
      </div>
    </div>
  );
}
