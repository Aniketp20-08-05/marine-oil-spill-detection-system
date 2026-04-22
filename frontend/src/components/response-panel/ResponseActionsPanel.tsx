"use client";

import { useState, useEffect } from 'react';
import { triggerResponseAction } from '@/services/responseActionService';
import { AlertItem } from '@/types/alert';
import { ResponseAction } from '@/types/responseAction';
import { useThemeMode } from '@/context/ThemeContext';
import { apiGet } from '@/services/api';

type Props = {
  alerts: AlertItem[];
};

export default function ResponseActionsPanel({ alerts }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [history, setHistory] = useState<ResponseAction[]>([]);
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  const actions = [
    { name: "Dispatch Coast Guard", color: "#4361EE", icon: "🚢" },
    { name: "Mobilize Oil Boom Team", color: "#00B4D8", icon: "🏗️" },
    { name: "Initiate Wildlife Response", color: "#56CFE1", icon: "🐬" },
    { name: "Dispatch Inventory", color: "#0077B6", icon: "📦" },
  ];

  const fetchHistory = async () => {
    try {
      const data = await apiGet<ResponseAction[]>("/actions/");
      setHistory(data.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch action history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (actionType: string) => {
    const latestAlert = alerts.length > 0 ? alerts[0] : null;

    if (!latestAlert) {
      setStatus({ msg: "No active alerts to respond to.", type: 'error' });
      return;
    }

    setLoading(actionType);
    setStatus(null);

    try {
      await triggerResponseAction(latestAlert.alert_id, actionType, "Admin");
      setStatus({ 
        msg: `Order confirmed: ${actionType} is now en route.`, 
        type: 'success' 
      });
      fetchHistory(); // Refresh history immediately
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      setStatus({ msg: `Error: ${err.message || "Connection error"}.`, type: 'error' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div 
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }}
      className="rounded-[28px] border p-6 shadow-sm min-h-[400px] flex flex-col"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 style={{ color: 'var(--text-primary)' }} className="text-lg font-black tracking-tight uppercase">Emergency Response</h3>
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
          <div className="h-2 w-2 rounded-full bg-red-600/30"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.name}
            type="button"
            disabled={loading !== null}
            onClick={() => handleAction(action.name)}
            style={{ 
              backgroundColor: loading === action.name ? 'var(--highlight)' : action.color,
            }}
            className="group flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-left transition-all hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-50"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-[9px] font-black leading-tight text-white uppercase tracking-wider">{action.name}</span>
          </button>
        ))}
      </div>

      {status && (
        <div 
          style={{ 
            backgroundColor: status.type === 'success' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            borderColor: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
            color: status.type === 'success' ? 'var(--success)' : 'var(--danger)'
          }}
          className="mt-4 rounded-xl border p-3 text-[10px] font-bold animate-in fade-in slide-in-from-top-2"
        >
          {status.msg}
        </div>
      )}

      {/* NEW: Response History Section to fill the empty space */}
      <div className="mt-8 flex-grow">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-px flex-grow bg-slate-700/20"></span>
          <span style={{ color: 'var(--text-muted)' }} className="text-[9px] font-black uppercase tracking-[0.2em]">Recent Operations</span>
          <span className="h-px flex-grow bg-slate-700/20"></span>
        </div>

        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-[10px] opacity-40 italic text-center py-4">No recent operations logged.</div>
          ) : (
            history.map((item) => (
              <div 
                key={item.action_id}
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--highlight)' }}
                className="flex items-center justify-between rounded-xl border p-3 transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <div style={{ color: 'var(--secondary)' }} className="text-sm">
                    {actions.find(a => a.name === item.action_type)?.icon || '⚓'}
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-primary)' }} className="text-[10px] font-bold">{item.action_type}</div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-[8px] font-medium uppercase">{new Date(item.timestamp).toLocaleTimeString()} • ADMIN</div>
                  </div>
                </div>
                <span style={{ color: 'var(--success)' }} className="text-[8px] font-black uppercase bg-green-500/10 px-2 py-0.5 rounded">
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}