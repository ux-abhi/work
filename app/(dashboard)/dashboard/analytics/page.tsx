'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalViews: number;
  totalClicks: number;
  totalScans: number;
  days: { date: string; views: number; clicks: number }[];
  topBlocks: { block_id: string; count: number }[];
}

/** Analytics dashboard — shows views, clicks, QR scans over time */
export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-400">Loading analytics...</p>;
  if (!stats) return <p className="text-sm text-gray-400">Could not load analytics.</p>;

  const maxDay = Math.max(...stats.days.map((d) => d.views + d.clicks), 1);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold">Analytics</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-brand-600">{stats.totalViews}</p>
          <p className="text-xs text-gray-500 mt-0.5">Page Views</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-brand-600">{stats.totalClicks}</p>
          <p className="text-xs text-gray-500 mt-0.5">Link Clicks</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-brand-600">{stats.totalScans}</p>
          <p className="text-xs text-gray-500 mt-0.5">QR Scans</p>
        </div>
      </div>

      {/* 7-day bar chart */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-4">Last 7 Days</h3>
        <div className="flex items-end gap-2 h-32">
          {stats.days.map((day) => {
            const total = day.views + day.clicks;
            const height = Math.max((total / maxDay) * 100, 4);
            const label = new Date(day.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' });
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-400 font-medium">{total}</span>
                <div className="w-full flex flex-col gap-0.5" style={{ height: `${height}%` }}>
                  <div
                    className="flex-1 rounded-t bg-brand-400"
                    title={`${day.views} views`}
                    style={{ flex: day.views }}
                  />
                  {day.clicks > 0 && (
                    <div
                      className="rounded-b bg-brand-200"
                      title={`${day.clicks} clicks`}
                      style={{ flex: day.clicks }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-gray-400">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-brand-400" /> Views
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-brand-200" /> Clicks
          </span>
        </div>
      </div>

      {/* Top blocks */}
      {stats.topBlocks.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold mb-3">Top Clicked Blocks</h3>
          <div className="space-y-2">
            {stats.topBlocks.map((b, i) => (
              <div key={b.block_id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate">
                  #{i + 1} &middot; {b.block_id.slice(0, 8)}...
                </span>
                <span className="font-semibold text-brand-600">{b.count} clicks</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
