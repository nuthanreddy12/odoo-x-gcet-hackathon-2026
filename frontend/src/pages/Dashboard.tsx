import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardSummary, Category, Warehouse, Product } from '../types';
import { StatCard } from '../components/common/StatCard';
import { StockLevelChart } from '../components/dashboard/StockLevelChart';
import { MovementSummary } from '../components/dashboard/MovementSummary';
import { LowStockTable } from '../components/dashboard/LowStockTable';
import { FilterBar } from '../components/dashboard/FilterBar';
import { NavTab } from '../components/common/Sidebar';
import {
  Boxes, AlertTriangle, XCircle, Truck, Send, ArrowLeftRight,
  Plus, ArrowUpRight
} from 'lucide-react';

interface DashboardProps {
  onNavigateTab: (tab: NavTab) => void;
  onQuickReceipt?: (product: Product) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab, onQuickReceipt }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumData, cats, whs] = await Promise.all([
        api.getDashboardSummary(),
        api.getCategories(),
        api.getWarehouses()
      ]);
      setSummary(sumData);
      setCategories(cats);
      setWarehouses(whs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedWarehouse('');
    setSelectedStatus('');
  };

  if (loading || !summary) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading real-time stock metrics...</p>
        </div>
      </div>
    );
  }

  // Filter low stock items based on selection
  let filteredLowStock = summary.low_stock_items;
  if (selectedCategory) {
    filteredLowStock = filteredLowStock.filter((i: Product) => i.category_name === selectedCategory);
  }
  if (selectedStatus) {
    filteredLowStock = filteredLowStock.filter((i: Product) => i.stock_status === selectedStatus);
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Executive Stock Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated inventory registry, double-entry ledger & active document pipeline
          </p>
        </div>

        {/* Quick Operations Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('receipts')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>New Receipt</span>
          </button>
          <button
            onClick={() => onNavigateTab('deliveries')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Order</span>
          </button>
          <button
            onClick={() => onNavigateTab('transfers')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg shadow-sm transition-all"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
            <span>Transfer Stock</span>
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        warehouses={warehouses}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedWarehouse={selectedWarehouse}
        onWarehouseChange={setSelectedWarehouse}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onReset={handleResetFilters}
      />

      {/* 6 Required Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total In Stock"
          value={summary.kpis.total_units_in_stock}
          subtitle={`${summary.kpis.total_products} unique SKUs`}
          icon={Boxes}
          color="emerald"
          badgeText="Active Units"
          badgeType="success"
          onClick={() => onNavigateTab('products')}
        />
        <StatCard
          title="Low-Stock Alert"
          value={summary.kpis.low_stock_count}
          subtitle="Below safety buffer"
          icon={AlertTriangle}
          color="amber"
          badgeText="Restock Soon"
          badgeType="warning"
          onClick={() => onNavigateTab('products')}
        />
        <StatCard
          title="Out of Stock"
          value={summary.kpis.out_of_stock_count}
          subtitle="Zero units on hand"
          icon={XCircle}
          color="rose"
          badgeText={summary.kpis.out_of_stock_count > 0 ? "Critical" : "All Clear"}
          badgeType={summary.kpis.out_of_stock_count > 0 ? "alert" : "neutral"}
          onClick={() => onNavigateTab('products')}
        />
        <StatCard
          title="Pending Receipts"
          value={summary.kpis.pending_receipts}
          subtitle="Draft inbound shipments"
          icon={Truck}
          color="blue"
          badgeText="Inbound"
          badgeType="neutral"
          onClick={() => onNavigateTab('receipts')}
        />
        <StatCard
          title="Pending Deliveries"
          value={summary.kpis.pending_deliveries}
          subtitle="Orders in pick & pack"
          icon={Send}
          color="indigo"
          badgeText="Outbound"
          badgeType="neutral"
          onClick={() => onNavigateTab('deliveries')}
        />
        <StatCard
          title="Scheduled Transfers"
          value={summary.kpis.scheduled_transfers}
          subtitle="Inter-facility routing"
          icon={ArrowLeftRight}
          color="slate"
          badgeText="Internal"
          badgeType="neutral"
          onClick={() => onNavigateTab('transfers')}
        />
      </div>

      {/* Analytical Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockLevelChart data={summary.category_distribution} />
        <MovementSummary />
      </div>

      {/* Low Stock Attention & Quick Restock Table */}
      <LowStockTable
        items={filteredLowStock}
        onTriggerReceipt={(prod: Product) => {
          onQuickReceipt?.(prod);
          onNavigateTab('receipts');
        }}
      />
    </div>
  );
};
