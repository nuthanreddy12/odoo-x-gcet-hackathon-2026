import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StockLedgerEntry } from '../types';
import { Badge } from '../components/common/Badge';
import { Search, Filter, ShieldCheck, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const StockLedger: React.FC = () => {
  const [entries, setEntries] = useState<StockLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getLedger();
      setEntries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      (e.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (e.product_sku?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (e.reference_doc_number?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (e.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesAction = !selectedAction || e.action_type === selectedAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stock Movement Ledger</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Double-Entry Audit</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically complete transaction history. Every receipt, delivery, transfer, and adjustment is recorded.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU, product name, document #, or audit notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All Action Types</option>
            <option value="RECEIPT">Receipt (Inbound +)</option>
            <option value="DELIVERY">Delivery (Outbound -)</option>
            <option value="TRANSFER_IN">Transfer In (+)</option>
            <option value="TRANSFER_OUT">Transfer Out (-)</option>
            <option value="ADJUSTMENT">Stock Adjustment (&Delta;)</option>
            <option value="INITIAL">Initial Balance Allocation</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Action Type</th>
                <th className="px-5 py-3">Product / SKU</th>
                <th className="px-5 py-3">Warehouse / Location</th>
                <th className="px-5 py-3 text-right">Quantity Change</th>
                <th className="px-5 py-3 text-right">Balance After</th>
                <th className="px-5 py-3">Reference Document</th>
                <th className="px-5 py-3">Auditor / User</th>
                <th className="px-5 py-3">Notes & Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-slate-400">Loading immutable ledger...</td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-slate-400">No movement entries match your criteria.</td>
                </tr>
              ) : (
                filteredEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge status={e.action_type} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{e.product_name}</div>
                      <div className="font-mono text-[11px] text-slate-400">{e.product_sku}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <div>{e.location_name || 'Assigned Zone'}</div>
                      {e.warehouse_name && <div className="text-[10px] text-slate-400">{e.warehouse_name}</div>}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          e.change_qty > 0
                            ? 'text-emerald-600'
                            : e.change_qty < 0
                            ? 'text-purple-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {e.change_qty > 0 ? (
                          <>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            +{e.change_qty}
                          </>
                        ) : e.change_qty < 0 ? (
                          <>
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            {e.change_qty}
                          </>
                        ) : (
                          '0'
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 font-mono">
                      {e.balance_after}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {e.reference_doc_number || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 truncate max-w-[120px]">
                      {e.user_email || 'System'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                      {e.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
