import { PAGES } from "@/lib/cms/schema";
import { cn } from "@/lib/utils";

interface Props {
  active: string;
  onChange: (id: string) => void;
  showShared: boolean;
  onToggleShared: () => void;
  showTheme: boolean;
  onToggleTheme: () => void;
  showAssets: boolean;
  onToggleAssets: () => void;
}

export function Sidebar({
  active,
  onChange,
  showShared,
  onToggleShared,
  showTheme,
  onToggleTheme,
  showAssets,
  onToggleAssets,
}: Props) {
  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/15 grid place-items-center text-primary font-bold">
            SŞ
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground leading-none">Site Paneli</h2>
            <p className="text-[11px] text-muted-foreground mt-1">Serdar ŞEKER</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-2 font-semibold">
            Sayfalar
          </div>
          <div className="space-y-1">
            {PAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => onChange(p.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  active === p.id
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-2 font-semibold">
            Site Geneli
          </div>
          <div className="space-y-1">
            <button
              onClick={onToggleTheme}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                showTheme ? "bg-primary/15 text-primary font-semibold" : "text-foreground hover:bg-muted"
              )}
            >
              <span>🎨</span> Renk & Yazı Tipi
            </button>
            <button
              onClick={onToggleShared}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                showShared ? "bg-primary/15 text-primary font-semibold" : "text-foreground hover:bg-muted"
              )}
            >
              <span>🧭</span> Menü & Footer
            </button>
            <button
              onClick={onToggleAssets}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                showAssets ? "bg-primary/15 text-primary font-semibold" : "text-foreground hover:bg-muted"
              )}
            >
              <span>🖼️</span> Görsel Kütüphanesi
            </button>
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-border text-[11px] text-muted-foreground">
        Tüm değişiklikler tarayıcınızda saklanır.
      </div>
    </aside>
  );
}
