import { useMemo } from "react";
import { PAGES, SHARED_FIELDS, type FieldDef } from "@/lib/cms/schema";
import { useCMS } from "@/lib/cms/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AssetPicker } from "./AssetPicker";

interface Props {
  pageId: string;
  showShared: boolean;
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">{field.label}</Label>
      {field.type === "textarea" || field.type === "html" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={field.type === "html" ? 2 : 4}
          className="font-mono text-xs bg-input border-border resize-y"
        />
      ) : field.type === "image" ? (
        <AssetPicker value={value} onChange={onChange} />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={field.type === "url" ? "url" : "text"}
          className="bg-input border-border"
        />
      )}
      {field.helper && (
        <p className="text-[10px] text-muted-foreground">{field.helper}</p>
      )}
    </div>
  );
}

export function EditorPanel({ pageId, showShared }: Props) {
  const page = PAGES.find((p) => p.id === pageId);
  const content = useCMS((s) => s.content[pageId] ?? {});
  const setField = useCMS((s) => s.setField);
  const resetPage = useCMS((s) => s.resetPage);

  const fields = useMemo(() => {
    if (!page) return [] as FieldDef[];
    return showShared ? SHARED_FIELDS : page.fields;
  }, [page, showShared]);

  // Group by 'group'
  const grouped = useMemo(() => {
    const map = new Map<string, FieldDef[]>();
    for (const f of fields) {
      const g = f.group ?? "Genel";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(f);
    }
    return Array.from(map.entries());
  }, [fields]);

  if (!page) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-card/50">
        <div>
          <h3 className="text-base font-bold text-foreground">
            {showShared ? "Menü & Footer" : page.title}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {showShared
              ? "Tüm sayfalarda paylaşılan alanlar"
              : `${page.fields.length} düzenlenebilir alan`}
          </p>
        </div>
        {!showShared && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Bu sayfanın tüm değişiklikleri sıfırlansın mı?")) resetPage(pageId);
            }}
            className="text-xs"
          >
            Sıfırla
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {grouped.map(([groupName, groupFields]) => (
          <div key={groupName} className="space-y-3">
            <div className="text-[10px] uppercase tracking-wider font-bold text-primary border-b border-primary/20 pb-1.5">
              {groupName}
            </div>
            {groupFields.map((f) => (
              <FieldEditor
                key={f.id}
                field={f}
                value={content[f.id] ?? ""}
                onChange={(v) => setField(pageId, f.id, v)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
