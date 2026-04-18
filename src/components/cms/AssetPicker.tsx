// Field tipi "image" olduğunda kullanılır — şu an şablonda <img> yok ama gelecekte kullanılabilir
import { useCMS } from "@/lib/cms/store";
import { Button } from "@/components/ui/button";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function AssetPicker({ value, onChange }: Props) {
  const assets = useCMS((s) => s.assets);
  const id = value.startsWith("cms-asset://") ? value.replace("cms-asset://", "") : "";
  const current = assets.find((a) => a.id === id);

  return (
    <div className="space-y-2">
      {current && (
        <div className="border border-border rounded-md p-2 flex items-center gap-2">
          <img src={current.dataUrl} alt="" className="w-12 h-12 object-cover rounded" />
          <div className="text-xs flex-1 truncate">{current.name}</div>
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
      >
        <option value="">— Seç —</option>
        {assets.map((a) => (
          <option key={a.id} value={`cms-asset://${a.id}`}>
            {a.name}
          </option>
        ))}
      </select>
      {assets.length === 0 && (
        <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
          <span>Önce Görsel Kütüphanesi'nden yükleyin</span>
        </Button>
      )}
    </div>
  );
}
