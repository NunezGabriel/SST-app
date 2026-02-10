import React from 'react';

type Props = {
  title: string;
  children?: React.ReactNode;
};

export default function InfoCard({ title, children }: Props) {
  return (
    <div className="p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold text-[#003366]">{title}</h3>
      <div className="mt-4 text-sm text-[var(--muted-text)]">{children}</div>
    </div>
  );
}
