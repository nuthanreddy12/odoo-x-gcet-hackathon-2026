import React from 'react';
import { Modal } from '../common/Modal';
import { Receipt, Delivery } from '../../types';
import { Printer, Boxes } from 'lucide-react';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Receipt | Delivery | null;
  type: 'receipt' | 'delivery';
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  type
}) => {
  if (!document) return null;

  const isReceipt = type === 'receipt';
  const receipt = isReceipt ? (document as Receipt) : null;
  const delivery = !isReceipt ? (document as Delivery) : null;

  const docNumber = isReceipt ? receipt!.receipt_number : delivery!.delivery_number;
  const partnerLabel = isReceipt ? 'Supplier / Vendor' : 'Customer';
  const partnerName = isReceipt ? receipt!.supplier_name : delivery!.customer_name;
  const docTitle = isReceipt ? 'GOODS RECEIPT NOTE (GRN)' : 'DELIVERY ORDER & PACKING SLIP';

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Print Document — ${docNumber}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs text-slate-800">
        {/* Printable Paper Area */}
        <div id="printable-voucher" className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-900 text-white rounded-lg">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">StockSense IMS</h1>
                <p className="text-[11px] text-slate-500">Warehouse & Inventory Management Operations</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-bold text-slate-900">{docTitle}</h2>
              <p className="font-mono text-xs font-bold text-brand-600">{docNumber}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Status: <span className="font-bold text-slate-700">{document.status}</span></p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100 mb-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{partnerLabel}</span>
              <strong className="text-slate-900 text-sm">{partnerName}</strong>
              {!isReceipt && delivery?.shipping_address && (
                <p className="text-[11px] text-slate-500 mt-0.5">{delivery.shipping_address}</p>
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Date</span>
              <span className="text-slate-800 font-medium">{formatDate(document.scheduled_date)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Responsible User</span>
              <span className="text-slate-800 font-medium">{document.responsible_user_name || 'Warehouse Staff'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Created Date</span>
              <span className="text-slate-600">{formatDate(document.created_at)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Validation Date</span>
              <span className="text-slate-600">{formatDate(document.validated_at)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Notes / Reference</span>
              <span className="text-slate-600">{document.notes || 'None'}</span>
            </div>
          </div>

          {/* Lines Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse border border-slate-200 text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 border border-slate-200">#</th>
                  <th className="py-2.5 px-3 border border-slate-200">Product / Item Description</th>
                  <th className="py-2.5 px-3 border border-slate-200">SKU</th>
                  <th className="py-2.5 px-3 border border-slate-200">Storage / Pick Location</th>
                  <th className="py-2.5 px-3 border border-slate-200 text-right">Quantity</th>
                  {isReceipt && (
                    <th className="py-2.5 px-3 border border-slate-200 text-right">Unit Cost</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {document.items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 border border-slate-200 text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium text-slate-900">{item.product_name}</td>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-slate-500">{item.product_sku}</td>
                    <td className="py-2 px-3 border border-slate-200 text-slate-600">{item.location_name || 'Designated Location'}</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-bold text-slate-900">{item.quantity}</td>
                    {isReceipt && (
                      <td className="py-2 px-3 border border-slate-200 text-right text-slate-600">₹{Number(item.unit_cost || 0).toFixed(2)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-300">
                <tr>
                  <td colSpan={4} className="py-2 px-3 text-right uppercase text-[10px]">Total Quantity:</td>
                  <td className="py-2 px-3 text-right text-sm">
                    {document.items.reduce((sum: number, it: any) => sum + Number(it.quantity || 0), 0)}
                  </td>
                  {isReceipt && <td className="py-2 px-3 border border-slate-200"></td>}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
            <div>
              <p className="font-semibold text-slate-700 mb-8">Prepared & Handled By:</p>
              <div className="border-t border-dashed border-slate-400 pt-1 text-[11px] text-slate-500">
                Name & Signature / Date
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-8">Verified & Received By:</p>
              <div className="border-t border-dashed border-slate-400 pt-1 text-[11px] text-slate-500">
                Name & Signature / Date
              </div>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
