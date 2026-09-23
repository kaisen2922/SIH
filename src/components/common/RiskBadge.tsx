import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '', showDot = true }) => {
  const getBadgeStyle = () => {
    switch (level) {
      case 'CRITICAL':
        return 'badge-critical';
      case 'HIGH':
        return 'badge-high';
      case 'MODERATE':
        return 'badge-moderate';
      case 'LOW':
      default:
        return 'badge-low';
    }
  };

  const getDotStyle = () => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MODERATE':
        return 'bg-yellow-500';
      case 'LOW':
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <span className={`inline-flex items-center space-x-1.5 ${getBadgeStyle()} ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`} />}
      <span>{level}</span>
    </span>
  );
};
