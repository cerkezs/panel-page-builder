import { useEffect, useMemo, useRef } from "react";
import { useCMS } from "@/lib/cms/store";
import { renderPage } from "@/lib/cms/render";

interface Props {
  pageId: string;
}

export function PreviewFrame({ pageId }: Props) {
  const content = useCMS((s) => s.content[pageId] ?? {});
  const theme = useCMS((s) => s.theme);
  const assets = useCMS((s) => s.assets);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const html = useMemo(
    () =>
      renderPage({
        pageId,
        content,
        theme,
        assets,
        imageMode: "embed-data-url",
      }),
    [pageId, content, theme, assets]
  );

  // srcdoc kullanıyoruz; her değişikte iframe yeniden yüklenir.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.srcdoc = html;
  }, [html]);

  return (
    <div className="w-full h-full bg-black/40 rounded-xl overflow-hidden border border-border">
      <iframe
        ref={iframeRef}
        title="Site önizleme"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
