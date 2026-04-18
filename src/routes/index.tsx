import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCMS } from "@/lib/cms/store";
import { Sidebar } from "@/components/cms/Sidebar";
import { EditorPanel } from "@/components/cms/EditorPanel";
import { ThemePanel } from "@/components/cms/ThemePanel";
import { AssetsPanel } from "@/components/cms/AssetsPanel";
import { PreviewFrame } from "@/components/cms/PreviewFrame";
import { TopBar } from "@/components/cms/TopBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Site Yönetim Paneli — Serdar ŞEKER" },
      { name: "description", content: "Sitenizi panel üzerinden düzenleyin ve HTML olarak indirin." },
    ],
  }),
  component: AdminPanel,
});

type View = "page" | "shared" | "theme" | "assets";

function AdminPanel() {
  const [pageId, setPageId] = useState("index");
  const [view, setView] = useState<View>("page");
  const [hydrated, setHydrated] = useState(false);

  // localStorage'dan rehydrate (skipHydration true ayarı için manuel tetikleme)
  useEffect(() => {
    void useCMS.persist.rehydrate();
    // İçerik şablonlardan eksik alanlarla doldurulsun
    setTimeout(() => {
      useCMS.getState().hydrateFromTemplates();
      setHydrated(true);
    }, 50);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-center">
          <div className="size-12 mx-auto rounded-xl bg-primary/15 grid place-items-center text-primary text-xl font-bold mb-3">
            SŞ
          </div>
          <p className="text-sm text-muted-foreground">Panel yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar
        active={view === "page" ? pageId : ""}
        onChange={(id) => {
          setPageId(id);
          setView("page");
        }}
        showShared={view === "shared"}
        onToggleShared={() => setView(view === "shared" ? "page" : "shared")}
        showTheme={view === "theme"}
        onToggleTheme={() => setView(view === "theme" ? "page" : "theme")}
        showAssets={view === "assets"}
        onToggleAssets={() => setView(view === "assets" ? "page" : "assets")}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar pageId={pageId} />
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] min-h-0">
          <div className="border-r border-border bg-card overflow-hidden">
            {view === "theme" ? (
              <ThemePanel />
            ) : view === "assets" ? (
              <AssetsPanel />
            ) : (
              <EditorPanel pageId={pageId} showShared={view === "shared"} />
            )}
          </div>
          <div className="p-3 bg-background min-h-0">
            <PreviewFrame pageId={pageId} />
          </div>
        </div>
      </div>
    </div>
  );
}
