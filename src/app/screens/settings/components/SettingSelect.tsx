interface SettingSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

export default function SettingSelect({ label, value, options, onChange }: SettingSelectProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-stone-100 last:border-b-0">
      <label className="text-sm text-stone-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-white border border-stone-200 rounded-lg px-3 py-1.5 min-w-[120px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
