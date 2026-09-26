import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { InternalTransfer, Product, Warehouse } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ArrowLeftRight, Plus, CheckCircle2, ShieldCheck, Trash2, Calendar } from 'lucide-react';

export const Transfers: React.FC = () => {
  const [transfers, setTransfers] = useState<InternalTransfer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);

  // New Transfer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceLocId, setSourceLocId] = useState('');
  const [destLocId, setDestLocId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ product_id: string; quantity: string }>>([
    { product_id: '', quantity: '5' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [trfs, prods, whs] = await Promise.all([
        api.getTransfers(),
        api.getProducts(),
        api.getWarehouses()
      ]);
      setTransfers(trfs);
      setProducts(prods);
      setWarehouses(whs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItemRow = () => {
    setItems([...items, { product_id: '', quantity: '1' }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceLocId === destLocId) {
      alert('Source and destination locations cannot be the same!');
      return;
    }
    setSubmitting(true);
    try {
      await api.createTransfer({
        source_location_id: Number(sourceLocId),
        dest_location_id: Number(destLocId),
        notes,
        items: items.map(i => ({
          product_id: Number(i.product_id),
          quantity: Number(i.quantity)
        }))
      });
      setIsModalOpen(false);
      setSourceLocId('');
      setDestLocId('');
      setNotes('');
      setItems([{ product_id: '', quantity: '5' }]);
      loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteTransfer = async (id: number) => {
    setCompletingId(id);
    try {
      await api.completeTransfer(id);
      loadData();
    } finally {
      setCompletingId(null);
    }
  };

  const allLocations = warehouses.flatMap(w =>
    w.locations.map(l => ({ ...l, warehouse_name: w.name }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Internal Stock Transfers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Relocate stock across bins, racks, and branch facilities while guaranteeing company stock conservation.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Internal Transfer</span>
        </button>
      </div>

      {/* Conservation Invariant Banner */}
      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <span className="font-bold">Inventory Integrity Protected:</span> Stock transfers automatically maintain accurate total inventory.
        </div>
      </div>

      {/* Transfers List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            Loading transfers...
          </div>
        ) : transfers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No internal transfers recorded. Click "Schedule Internal Transfer" to initiate one.
          </div>
        ) : (
          transfers.map((trf) => (
            <div key={trf.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{trf.transfer_number}</span>
                      <Badge status={trf.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <span className="font-medium text-slate-800">{trf.source_location_name || `Location #${trf.source_location_id}`}</span>
                      <span className="text-slate-400">&rarr;</span>
                      <span className="font-medium text-slate-800">{trf.dest_location_name || `Location #${trf.dest_location_id}`}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(trf.scheduled_date).toLocaleDateString()}</span>
                  </div>

                  {trf.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleCompleteTransfer(trf.id)}
                      disabled={completingId === trf.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{completingId === trf.id ? 'Transferring...' : 'Execute & Complete'}</span>
                    </button>
                  )}

                  {trf.status === 'COMPLETED' && (
                    <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      Successfully Relocated & Audited
                    </span>
                  )}
                </div>
              </div>

              {/* Items in Transfer */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Item Name / SKU</th>
                      <th className="px-3 py-2 text-right">Transferred Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trf.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 font-medium text-slate-800">
                          {item.product_name} <span className="font-mono text-slate-400 text-[10px]">({item.product_sku})</span>
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">{item.quantity} Units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {trf.notes && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="font-semibold text-slate-600">Notes:</span> {trf.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Transfer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Internal Stock Transfer"
        subtitle="Transfer physical inventory between warehouse locations"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Source Location (From) *</label>
              <select
                required
                value={sourceLocId}
                onChange={(e) => setSourceLocId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Select Origin Location</option>
                {allLocations.map((l) => (
                  <option key={l.id} value={l.id}>{l.warehouse_name} &rarr; {l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Location (To) *</label>
              <select
                required
                value={destLocId}
                onChange={(e) => setDestLocId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Select Destination Location</option>
                {allLocations.map((l) => (
                  <option key={l.id} value={l.id} disabled={String(l.id) === sourceLocId}>
                    {l.warehouse_name} &rarr; {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-semibold text-slate-700">Products to Relocate *</label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Line</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <select
                      required
                      value={row.product_id}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].product_id = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="">Select Product SKU</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      value={row.quantity}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].quantity = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-right font-bold focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Transfer Purpose / Reason</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Balancing stock for seasonal peak"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold shadow-sm transition-all"
            >
              {submitting ? 'Scheduling...' : 'Create Scheduled Transfer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
