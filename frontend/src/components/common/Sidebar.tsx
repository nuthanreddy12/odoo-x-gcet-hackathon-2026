import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Boxes, Package, Truck, Send, ArrowLeftRight,
  SlidersHorizontal, BookOpen, Warehouse, AlertTriangle, ShieldCheck
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'stock'
  | 'products'
  | 'receipts'
  | 'deliveries'
  | 'transfers'
  | 'adjustments'
  | 'ledger'
  | 'warehouses'
  | 'profile';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lowStockCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, lowStockCount = 0 }) => {
  const { user, isManager } = useAuth();

  const allNavItems: { id: NavTab; label: string; icon: any; badge?: number; badgeColor?: string; managerOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'stock', label: 'Stock View', icon: Boxes },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'receipts', label: 'Receipts (Inbound)', icon: Truck },
    { id: 'deliveries', label: 'Deliveries (Outbound)', icon: Send },
    { id: 'transfers', label: 'Internal Transfers', icon: ArrowLeftRight },
    { id: 'adjustments', label: 'Stock Adjustments', icon: SlidersHorizontal },
    { id: 'ledger', label: 'Stock Movement Ledger', icon: BookOpen },
    { id: 'warehouses', label: 'Warehouses & Zones', icon: Warehouse, managerOnly: true },
  ];

  // RBAC: Hide management-only tabs (Warehouses & Zones) from Warehouse Staff
  const visibleNavItems = allNavItems.filter(item => !item.managerOnly || isManager);

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-5">
        {/* User Role Banner */}
        <div
          onClick={() => onTabChange('profile')}
          className="px-3 py-2 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors group"
          title="Click to view My Profile"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isManager ? 'bg-indigo-400' : 'bg-cyan-400'}`}></span>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white transition-colors">
              {isManager ? 'Inventory Manager' : 'Warehouse Staff'}
            </span>
          </div>
          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-700">
            {isManager ? 'Full Access' : 'Operational'}
          </span>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            {isManager ? 'Operations & Inventory' : 'Warehouse Operations'}
          </p>
          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>


        {/* Real-time Inventory Guard Box */}
        {lowStockCount > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold">Inventory Alert</span>
            </div>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              {lowStockCount} items require reordering attention.
            </p>
            <button
              onClick={() => onTabChange('products')}
              className="mt-2 text-[11px] font-semibold text-amber-400 hover:underline"
            >
              Review Reorder Rules &rarr;
            </button>
          </div>
        )}
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Ledger Synchronized
          </span>
          <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">v1.0</span>
        </div>
      </div>
    </aside>
  );
};
