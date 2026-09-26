import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Warehouse, Location } from '../types';
import { Warehouse as WarehouseIcon, MapPin, Layers, CheckCircle } from 'lucide-react';

export const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWarehouses().then((data: Warehouse[]) => {
      setWarehouses(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Warehouses & Storage Topologies</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical distribution sites, staging docks, bins, and aisle racks
          </p>
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            Loading warehouses...
          </div>
        ) : (
          warehouses.map((wh) => (
            <div key={wh.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                    <WarehouseIcon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{wh.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono font-semibold text-slate-700">{wh.code}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {wh.address}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  Active Hub
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configured Storage Locations & Zones ({wh.locations.length})</span>
                </h4>
                <div className="space-y-2">
                  {wh.locations.map((loc: Location) => (
                    <div
                      key={loc.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{loc.name}</p>
                        <p className="font-mono text-[10px] text-slate-400">{loc.code}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Operational
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
