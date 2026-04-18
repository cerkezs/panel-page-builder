import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadAllAsZip, downloadCurrentPageAsHtml } from "@/lib/cms/download";
import { PAGES } from "@/lib/cms/schema";
import { useCMS } from "@/lib/cms/store";

interface Props {
  pageId: string;
}

export function TopBar({ pageId }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const resetAll = useCMS((s) => s.resetAll);
  const page = PAGES.find((p) => p.id === pageId);

  async function doDownloadOne() {
    setBusy(true);
    try {
      await downloadCurrentPageAsHtml(pageId);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  async function doDownloadZip() {
    setBusy(true);
    try {
      await downloadAllAsZip();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-5 shrink-0">
      <div>
        <h1 className="text-sm font-bold text-foreground">
          {page?.title ?? "Site Yönetimi"}
        </h1>
        <p className="text-[10px] text-muted-foreground">Canlı önizleme — sağda</p>
      </div>

      <div className="flex items-center gap-2 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (confirm("TÜM değişiklikleri sıfırlayıp şablon haline döndürmek istiyor musun?")) {
              resetAll();
            }
          }}
        >
          Tümünü sıfırla
        </Button>
        <Button onClick={() => setOpen((v) => !v)} disabled={busy}>
          {busy ? "Hazırlanıyor..." : "⬇ Kodları İndir"}
        </Button>
        {open && (
          <div className="absolute right-0 top-12 z-50 w-72 bg-popover border border-border rounded-lg shadow-2xl p-2">
            <button
              onClick={doDownloadOne}
              className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors"
            >
              <div className="text-sm font-semibold">Sadece bu sayfa</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {page?.fileName} — tek HTML dosyası (görseller gömülü)
              </div>
            </button>
            <button
              onClick={doDownloadZip}
              className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors mt-1"
            >
              <div className="text-sm font-semibold">Tüm site (ZIP)</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                5 sayfa + images/ klasörü
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
