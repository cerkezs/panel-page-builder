import JSZip from "jszip";
import { saveAs } from "file-saver";
import { PAGES } from "./schema";
import { renderPage } from "./render";
import { useCMS } from "./store";

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] ?? "application/octet-stream";
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export async function downloadCurrentPageAsHtml(pageId: string) {
  const { content, theme, assets } = useCMS.getState();
  const html = renderPage({
    pageId,
    content: content[pageId] ?? {},
    theme,
    assets,
    imageMode: "embed-data-url", // tek dosya — görseller base64 gömülü
  });
  const page = PAGES.find((p) => p.id === pageId)!;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  saveAs(blob, page.fileName);
}

export async function downloadAllAsZip() {
  const { content, theme, assets } = useCMS.getState();
  const zip = new JSZip();

  for (const page of PAGES) {
    const html = renderPage({
      pageId: page.id,
      content: content[page.id] ?? {},
      theme,
      assets,
      imageMode: "zip-relative",
    });
    zip.file(page.fileName, html);
  }

  if (assets.length > 0) {
    const imagesFolder = zip.folder("images");
    for (const asset of assets) {
      imagesFolder?.file(asset.name, dataUrlToBlob(asset.dataUrl));
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "serdarseker-site.zip");
}
