import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Receipt, Product, Warehouse } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Truck, Plus, CheckCircle2, Calendar, FileText, Trash2 } from 'lucide-react';

interface ReceiptsProps {
  initialProductToReceive?: Product | null;
}

export const Receipts: React.FC<ReceiptsProps> = ({ initialProductToReceive }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<number | null>(null);

  // New Receipt Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ product_id: string; location_id: string; quantity: string; unit_cost: string }>>([
    { product_id: '', location_id: '', quantity: '50', unit_cost: '0' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recs, prods, whs] = await Promise.all([
        api.getReceipts(),
        api.getProducts(),
        api.getWarehouses()
      ]);
      setReceipts(recs);
      setProducts(prods);
      setWarehouses(whs);

      // If opened with preselected product from low stock table
      if (initialProductToReceive) {
        setIsModalOpen(true);
        setItems([{
          product_id: String(initialProductToReceive.id),
          location_id: String(whs[0]?.locations[0]?.id || ''),
          quantity: String(initialProductToReceive.reorder_quantity || 50),
          unit_cost: String(initialProductToReceive.unit_price || 0)
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItemRow = () => {
    setItems([...items, { product_id: '', location_id: '', quantity: '10', unit_cost: '0' }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createReceipt({
        supplier_name: supplierName,
        notes,
        items: items.map(i => ({
          product_id: Number(i.product_id),
          location_id: Number(i.location_id),
          quantity: Number(i.quantity),
          unit_cost: Number(i.unit_cost)
        }))
      });
      setIsModalOpen(false);
      setSupplierName('');
      setNotes('');
      setItems([{ product_id: '', location_id: '', quantity: '50', unit_cost: '0' }]);
      loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateReceipt = async (id: number) => {
    setValidatingId(id);
    try {
      await api.validateReceipt(id);
      loadData();
    } finally {
      setValidatingId(null);
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inbound Receipts (Procurement)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log shipments from suppliers. Validating a receipt automatically increases stock and updates the ledger.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Inbound Receipt</span>
        </button>
      </div>

      {/* Receipts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            Loading receipts...
          </div>
        ) : receipts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No receipts recorded yet. Click "New Inbound Receipt" to create one.
          </div>
        ) : (
          receipts.map((rec) => (
            <div key={rec.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-50 text-brand-700 rounded-lg">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{rec.receipt_number}</span>
                      <Badge status={rec.status} />
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">
                      Supplier: <span className="font-semibold text-slate-900">{rec.supplier_name}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(rec.receipt_date).toLocaleDateString()}</span>
                  </div>

                  {rec.status === 'DRAFT' && (
                    <button
                      onClick={() => handleValidateReceipt(rec.id)}
                      disabled={validatingId === rec.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{validatingId === rec.id ? 'Updating Stock...' : 'Validate & Increase Stock'}</span>
                    </button>
                  )}
                  {rec.status === 'VALIDATED' && (
                    <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      Stock Credited & Ledger Logged
                    </span>
                  )}
                </div>
              </div>

              {/* Items in Receipt */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Item / SKU</th>
                      <th className="px-3 py-2">Target Storage Location</th>
                      <th className="px-3 py-2 text-right">Received Quantity</th>
                      <th className="px-3 py-2 text-right">Unit Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rec.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 font-medium text-slate-800">
                          {item.product_name} <span className="font-mono text-slate-400 text-[10px]">({item.product_sku})</span>
                        </td>
                        <td className="px-3 py-2 text-slate-600">{item.location_name || 'Designated Location'}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">+{item.quantity}</td>
                        <td className="px-3 py-2 text-right text-slate-500">${Number(item.unit_cost).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rec.notes && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="font-semibold text-slate-600">Notes:</span> {rec.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Receipt Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Inbound Receipt"
        subtitle="Specify vendor and items to be received into warehouse locations"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateReceipt} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supplier Name *</label>
              <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g. Acme Industrial Corp"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Receipt Notes / Tracking #</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. PO-84920 / High priority restock"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-semibold text-slate-700">Receipt Line Items *</label>
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
                <div key={idx} className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-1 min-w-[150px]">
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

                  <div className="flex-1 min-w-[160px]">
                    <select
                      required
                      value={row.location_id}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].location_id = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="">Destination Location</option>
                      {allLocations.map(l => (
                        <option key={l.id} value={l.id}>{l.warehouse_name} - {l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
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

                  <div className="w-24">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Cost"
                      value={row.unit_cost}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].unit_cost = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-right focus:ring-1 focus:ring-brand-500"
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
              {submitting ? 'Creating...' : 'Create Draft Receipt'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
