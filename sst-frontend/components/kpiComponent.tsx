"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiComponentProps {
  title: string;
  value: string | number;
  percentage?: number;
  showProgressBar?: boolean;
  icon?: LucideIcon;
  showIcon?: boolean;
  iconPosition?: "top-right" | "top-left";
  iconColor?: string;
  progressBarColor?: string;
  variant?: "default" | "alert";
}

const KpiComponent: React.FC<KpiComponentProps> = ({
  title,
  value,
  percentage,
  showProgressBar = true,
  icon: Icon,
  showIcon = false,
  iconPosition = "top-right",
  iconColor = "text-gray-600",
  progressBarColor = "bg-[#003366]",
  variant = "default",
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
      {/* Icon in corner */}
      {Icon && showIcon && (
        <div
          className={`absolute ${
            iconPosition === "top-right" ? "top-4 right-4" : "top-4 left-4"
          } ${iconColor}`}
        >
          <Icon size={20} />
        </div>
      )}

      {/* Title */}
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>

      {/* Value and Percentage */}
      <div className="flex justify-between items-end mb-3">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {percentage !== undefined && (
          <div className="flex items-center gap-1">
            {percentage > 60 ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${
                percentage > 60 ? "text-green-600" : "text-red-600"
              }`}
            >
              {percentage}%
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {showProgressBar && percentage !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${progressBarColor} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default KpiComponent;
