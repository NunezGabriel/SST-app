import React from 'react';

type Props = {
  label: string;
  value: React.ReactNode;
  progress?: number; // 0-100 optional
  soft?: boolean; // use soft blue background variant
};

export default function StatsCard({ label, value, progress, soft = false }: Props) {
  const base = soft
    ? 'bg-[#F1FBFF] rounded-xl p-6 shadow-sm border border-blue-50'
    : 'bg-white rounded-xl p-6 shadow-sm border border-gray-100';

  return (
    <div className={base}>
      <h3 className={`text-sm font-medium mb-2 ${soft ? 'text-[#003366]' : 'text-gray-600'}`}>{label}</h3>
      <div className="flex justify-between items-end mb-3">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {typeof progress === 'number' && (
          <span className="text-green-600 text-sm font-medium flex items-center gap-1">{progress}%</span>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#003366] h-2 rounded-full"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
