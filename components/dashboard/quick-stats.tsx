import Link from 'next/link';
import { formatNumber, getProfileUrl } from '@/lib/utils';

interface Props {
  totalClicks: number;
  todayClicks: number;
  totalLinks: number;
  username: string;
}

export function QuickStats({ totalClicks, todayClicks, totalLinks, username }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Clicks" value={formatNumber(totalClicks)} />
      <StatCard label="Today" value={formatNumber(todayClicks)} />
      <StatCard label="Active Links" value={formatNumber(totalLinks)} />
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-sm text-gray-400">Your Profile</p>
        <Link
          href={getProfileUrl(username)}
          target="_blank"
          className="mt-1 block text-lg font-semibold text-white hover:underline truncate"
        >
          linkcard.com/{username}
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
