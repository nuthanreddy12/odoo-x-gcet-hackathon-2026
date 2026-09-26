import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

import { MovementTrend } from '../../types';

interface MovementSummaryProps {
  trends?: MovementTrend[];
}

export const MovementSummary: React.FC<MovementSummaryProps> = ({ trends }) => {
  const chartData = (trends && trends.length > 0)
    ? trends.map(t => ({
        day: t.date,
        receipts: t.receipts,
        deliveries: t.deliveries,
        transfers: t.transfers
      }))
    : [
        { day: 'Mon', receipts: 0, deliveries: 0, transfers: 0 },
        { day: 'Tue', receipts: 0, deliveries: 0, transfers: 0 },
        { day: 'Wed', receipts: 0, deliveries: 0, transfers: 0 },
        { day: 'Thu', receipts: 0, deliveries: 0, transfers: 0 },
        { day: 'Fri', receipts: 0, deliveries: 0, transfers: 0 },
        { day: 'Sat', receipts: 0, deliveries: 0, transfers: 0 },
        { day: 'Sun', receipts: 0, deliveries: 0, transfers: 0 },
      ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Inventory Movement Velocity</h4>
          <p className="text-xs text-slate-500">Real-time inbound receipts vs outbound deliveries (Last 7 Days)</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="receiptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="deliveryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px'
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey="receipts"
              name="Receipts (Inbound)"
              stroke="#16a34a"
              fillOpacity={1}
              fill="url(#receiptGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="deliveries"
              name="Deliveries (Outbound)"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#deliveryGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
