type Props = {
  onRun: () => void;
  loading: boolean;
};

export default function PipelineControl({ onRun, loading }: Props) {
  return (
    <div className="rounded-2xl bg-slate-800 p-4 shadow-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Detection Pipeline</h2>
          <p className="text-sm text-slate-300">
            Trigger anomaly, spill, risk, and alert evaluation.
          </p>
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Running..." : "Run Detection Pipeline"}
        </button>
      </div>
    </div>
  );
}