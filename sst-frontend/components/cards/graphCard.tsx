import React from "react";

interface GraphCardProps {
  title: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const GraphCard: React.FC<GraphCardProps> = ({
  title,
  subtitle,
  headerRight,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {headerRight && <div className="shrink-0">{headerRight}</div>}
      </div>
      <div className="h-64 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default GraphCard;

