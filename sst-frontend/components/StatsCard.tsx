import React from 'react';

type Props = {
  label: string;
  value: React.ReactNode;
  progress?: number; // 0-100 optional
  soft?: boolean; // use soft blue background variant
  icon?: React.ReactNode;
};

export default function StatsCard({ label, value, progress, soft = false, icon }: Props) {
  const base = soft
    ? 'relative bg-[#F1FBFF] rounded-xl p-6 shadow-sm border border-blue-50'
    : 'relative bg-white rounded-xl p-6 shadow-sm border border-gray-100';

  return (
    <div className={base}>
      {icon && (
        <div className="absolute top-4 right-4">
          <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center text-[#003366] shadow-sm">
            {icon}
          </div>
        </div>
      )}

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
