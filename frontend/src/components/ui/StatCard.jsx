import React from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-teal-600",
  iconBgColor = "bg-teal-100",
  showChange = true,
  changeLabel = "vs período anterior",
}) => {
  const getChangeIcon = (changeValue) => {
    if (changeValue > 0) {
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    } else if (changeValue < 0) {
      return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getChangeColor = (changeValue) => {
    if (changeValue > 0) return "text-green-600";
    if (changeValue < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {showChange && change !== undefined && (
            <div className="flex items-center mt-2">
              {getChangeIcon(change)}
              <span className={`ml-1 text-sm ${getChangeColor(change)}`}>
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              <span className="ml-1 text-sm text-gray-500">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-full ${iconBgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
