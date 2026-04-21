type Props = {
  sog: number;
};

export default function VesselStatusBadge({ sog }: Props) {
  let label = "NORMAL";
  let className = "bg-green-500 text-white";

  if (sog < 1) {
    label = "ALERT";
    className = "bg-red-500 text-white";
  } else if (sog < 5) {
    label = "MONITOR";
    className = "bg-yellow-400 text-black";
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}