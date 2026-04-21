export default function ActionsPanel() {
  return (
    <div className="rounded-2xl bg-slate-800 p-5 text-white shadow-md">
      <h2 className="mb-4 text-xl font-bold">Response Actions</h2>

      <div className="space-y-3">
        <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">
          Dispatch Coast Guard
        </button>
        <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">
          Mobilize Oil Boom Team
        </button>
        <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">
          Initiate Wildlife Response
        </button>
        <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">
          Dispatch Inventory
        </button>
      </div>
    </div>
  );
}