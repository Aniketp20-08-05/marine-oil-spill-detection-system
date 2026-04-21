type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
};

export default function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-2xl bg-slate-800 p-5 text-white shadow-md">
      <h3 className="text-sm opacity-80">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm opacity-70">{subtitle}</p>
    </div>
  );
}