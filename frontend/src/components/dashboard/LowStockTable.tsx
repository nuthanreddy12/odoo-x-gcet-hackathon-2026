import React from 'react';
import { Product } from '../../types';
import { Badge } from '../common/Badge';
import { AlertCircle, PlusCircle } from 'lucide-react';

interface LowStockTableProps {
  items: Product[];
  onTriggerReceipt?: (product: Product) => void;
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ items, onTriggerReceipt }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Critical Stock & Reorder Alerts</h4>
            <p className="text-xs text-slate-500">Products operating below safety buffer</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          {items.length} Attention Needed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-5 py-3">Product / SKU</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Available Stock</th>
              <th className="px-5 py-3 text-right">Min Alert Level</th>
              <th className="px-5 py-3 text-right">Suggested Reorder</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  All inventory items are currently above safety thresholds. Good job!
                </td>
              </tr>
            ) : (
              items.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>{prod.name}</div>
                    <div className="font-mono text-[11px] text-slate-400">{prod.sku}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{prod.category_name}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                    {prod.total_stock} <span className="font-normal text-slate-500 text-[11px]">{prod.uom}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-500">{prod.min_stock_alert}</td>
                  <td className="px-5 py-3.5 text-right text-brand-700 font-semibold">
                    +{prod.reorder_quantity} {prod.uom}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Badge status={prod.stock_status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onTriggerReceipt?.(prod)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium rounded-lg text-xs transition-colors border border-brand-200"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Create Receipt</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
