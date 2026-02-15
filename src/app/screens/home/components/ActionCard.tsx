interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

export default function ActionCard({ icon, title, description, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-4 px-5 py-5 bg-white border border-stone-200 rounded-xl text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer"
    >
      <span className="text-2xl mt-0.5">{icon}</span>
      <div>
        <div className="font-semibold text-stone-800">{title}</div>
        <div className="text-sm text-stone-500 mt-1">{description}</div>
      </div>
    </button>
  );
}
