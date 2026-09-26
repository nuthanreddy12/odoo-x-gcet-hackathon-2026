import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { CategoryStock } from '../../types';

interface StockLevelChartProps {
  data: CategoryStock[];
}

export const StockLevelChart: React.FC<StockLevelChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Inventory by Category</h4>
          <p className="text-xs text-slate-500">Total units stored per merchandise group</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="category_name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(val: any) => [`${val} Units`, 'Quantity']}
            />
            <Bar dataKey="total_quantity" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
