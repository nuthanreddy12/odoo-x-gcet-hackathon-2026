import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Delivery, Product, Warehouse } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Send, Plus, CheckCircle, PackageCheck, Truck, Trash2, Calendar, MapPin } from 'lucide-react';

export const Deliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // New Delivery Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ product_id: string; location_id: string; quantity: string }>>([
    { product_id: '', location_id: '', quantity: '1' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [delivs, prods, whs] = await Promise.all([
        api.getDeliveries(),
        api.getProducts(),
        api.getWarehouses()
      ]);
      setDeliveries(delivs);
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
    setItems([...items, { product_id: '', location_id: '', quantity: '1' }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createDelivery({
        customer_name: customerName,
        shipping_address: shippingAddress,
        notes,
        items: items.map(i => ({
          product_id: Number(i.product_id),
          location_id: Number(i.location_id),
          quantity: Number(i.quantity)
        }))
      });
      setIsModalOpen(false);
      setCustomerName('');
      setShippingAddress('');
      setNotes('');
      setItems([{ product_id: '', location_id: '', quantity: '1' }]);
      loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdvanceStatus = async (id: number, currentStatus: string) => {
    setProcessingId(id);
    try {
      if (currentStatus === 'DRAFT') {
        await api.updateDeliveryStatus(id, 'PICKING');
      } else if (currentStatus === 'PICKING') {
        await api.updateDeliveryStatus(id, 'PACKING');
      } else if (currentStatus === 'PACKING') {
        // Final dispatch step validates and deducts inventory
        await api.validateDelivery(id);
      }
      loadData();
    } finally {
      setProcessingId(null);
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Outbound Deliveries & Fulfillment</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage customer orders through Picking, Packing, and Final Dispatch to decrement inventory
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Delivery Order</span>
        </button>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            Loading deliveries...
          </div>
        ) : deliveries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No delivery orders recorded yet.
          </div>
        ) : (
          deliveries.map((del) => (
            <div key={del.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{del.delivery_number}</span>
                      <Badge status={del.status} />
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">
                      Customer: <span className="font-semibold text-slate-900">{del.customer_name}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(del.delivery_date).toLocaleDateString()}</span>
                  </div>

                  {del.status === 'DRAFT' && (
                    <button
                      onClick={() => handleAdvanceStatus(del.id, del.status)}
                      disabled={processingId === del.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg text-xs border border-amber-200 transition-all"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>Start Picking</span>
                    </button>
                  )}

                  {del.status === 'PICKING' && (
                    <button
                      onClick={() => handleAdvanceStatus(del.id, del.status)}
                      disabled={processingId === del.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold rounded-lg text-xs border border-blue-200 transition-all"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>Proceed to Packing</span>
                    </button>
                  )}

                  {del.status === 'PACKING' && (
                    <button
                      onClick={() => handleAdvanceStatus(del.id, del.status)}
                      disabled={processingId === del.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Validate & Dispatch</span>
                    </button>
                  )}

                  {del.status === 'VALIDATED' && (
                    <span className="text-[11px] text-purple-700 font-medium bg-purple-50 px-2 py-1 rounded border border-purple-200">
                      Dispatched & Inventory Decremented
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery items */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Item Name / SKU</th>
                      <th className="px-3 py-2">Pick Location</th>
                      <th className="px-3 py-2 text-right">Dispatch Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {del.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 font-medium text-slate-800">
                          {item.product_name} <span className="font-mono text-slate-400 text-[10px]">({item.product_sku})</span>
                        </td>
                        <td className="px-3 py-2 text-slate-600">{item.location_name || 'Designated Location'}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">-{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {del.shipping_address && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Destination: {del.shipping_address}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Delivery Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Outbound Delivery Order"
        subtitle="Reserve items for customer order and initiate fulfillment pipeline"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateDelivery} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer / Client Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Apex Global Industries"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shipping Destination Address</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="e.g. 500 Industrial Pkwy, Suite 10"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-semibold text-slate-700">Delivery Line Items *</label>
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
                  <div className="flex-1 min-w-[160px]">
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
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku}) — Available: {p.total_stock}
                        </option>
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
                      <option value="">Pick Location</option>
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
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-sm transition-all"
            >
              {submitting ? 'Creating...' : 'Create Draft Delivery'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
