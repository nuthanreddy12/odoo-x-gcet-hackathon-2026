import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo' | 'slate';
  badgeText?: string;
  badgeType?: 'neutral' | 'alert' | 'warning' | 'success';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'slate',
  badgeText,
  badgeType = 'neutral',
  onClick
}) => {
  const colorStyles = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'focus:ring-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'focus:ring-amber-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'focus:ring-rose-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'focus:ring-blue-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'focus:ring-indigo-500' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'focus:ring-slate-500' }
  }[color];

  const badgeStyles = {
    neutral: 'bg-slate-100 text-slate-700',
    alert: 'bg-rose-100 text-rose-800 animate-pulse',
    warning: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-800'
  }[badgeType];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorStyles.bg} ${colorStyles.text}`}>
          <Icon className="w-5 h-5" />
        </div>
        {badgeText && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeStyles}`}>
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
