import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { Category, Warehouse } from '../../types';

interface FilterBarProps {
  categories: Category[];
  warehouses: Warehouse[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedWarehouse: string;
  onWarehouseChange: (wh: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  warehouses,
  selectedCategory,
  onCategoryChange,
  selectedWarehouse,
  onWarehouseChange,
  selectedStatus,
  onStatusChange,
  onReset
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filters:</span>
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* Warehouse */}
        <select
          value={selectedWarehouse}
          onChange={(e) => onWarehouseChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Warehouses & Locations</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.name}>{w.name} ({w.code})</option>
          ))}
        </select>

        {/* Stock Status */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Inventory Statuses</option>
          <option value="IN_STOCK">In Stock (Healthy)</option>
          <option value="LOW_STOCK">Low Stock (Alert)</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors font-medium"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};
