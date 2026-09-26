import React from 'react';
import { Truck, Send, ArrowLeftRight, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { OperationSummary } from '../../types';
import { NavTab } from '../common/Sidebar';

interface OperationsOverviewProps {
  summaries: OperationSummary[];
  onNavigateTab: (tab: NavTab) => void;
}

export const OperationsOverview: React.FC<OperationsOverviewProps> = ({ summaries, onNavigateTab }) => {
  const receiptSummary = summaries.find(s => s.operation_type === 'Receipts') || {
    operation_type: 'Receipts',
    total_count: 0,
    to_process: 0,
    late_count: 0,
    waiting_count: 0
  };

  const deliverySummary = summaries.find(s => s.operation_type === 'Deliveries') || {
    operation_type: 'Deliveries',
    total_count: 0,
    to_process: 0,
    late_count: 0,
    waiting_count: 0
  };

  const transferSummary = summaries.find(s => s.operation_type === 'Internal Transfers') || {
    operation_type: 'Internal Transfers',
    total_count: 0,
    to_process: 0,
    late_count: 0,
    waiting_count: 0
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Operations Pipeline Summary</h3>
          <p className="text-xs text-slate-500">Live operational workflow stages & bottleneck tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receipts Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Receipts</h4>
                <p className="text-[11px] text-slate-500">Incoming Shipments</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('receipts')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{receiptSummary.to_process}</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">To Receive</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
            {receiptSummary.late_count > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">
                <Clock className="w-3 h-3" />
                <span>{receiptSummary.late_count} Late</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                <span>0 Late</span>
              </span>
            )}
            <span className="text-slate-400 text-[11px] ml-auto">
              Total: <strong className="text-slate-700">{receiptSummary.total_count}</strong>
            </span>
          </div>
        </div>

        {/* Deliveries Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delivery Orders</h4>
                <p className="text-[11px] text-slate-500">Customer Outbound</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('deliveries')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{deliverySummary.to_process}</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">To Deliver</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
            {deliverySummary.waiting_count > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold text-[11px] border border-amber-200">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>{deliverySummary.waiting_count} Waiting Stock</span>
              </span>
            )}
            {deliverySummary.late_count > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">
                <Clock className="w-3 h-3" />
                <span>{deliverySummary.late_count} Late</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                <span>0 Late</span>
              </span>
            )}
            <span className="text-slate-400 text-[11px] ml-auto">
              Total: <strong className="text-slate-700">{deliverySummary.total_count}</strong>
            </span>
          </div>
        </div>

        {/* Transfers Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Internal Transfers</h4>
                <p className="text-[11px] text-slate-500">Location Relocations</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('transfers')}
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{transferSummary.to_process}</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">To Process</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
            {transferSummary.late_count > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">
                <Clock className="w-3 h-3" />
                <span>{transferSummary.late_count} Late</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                <span>0 Late</span>
              </span>
            )}
            <span className="text-slate-400 text-[11px] ml-auto">
              Total: <strong className="text-slate-700">{transferSummary.total_count}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
