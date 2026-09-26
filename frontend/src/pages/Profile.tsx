import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/common/Sidebar';
import {
  User as UserIcon,
  Mail,
  Shield,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Calendar,
  KeyRound,
  LogOut,
  ArrowLeft,
  Lock,
  Layers,
  Check,
  X
} from 'lucide-react';

interface ProfileProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigateTab }) => {
  const { user, isManager, isStaff, logout } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active user session detected.
      </div>
    );
  }

  const roleDisplayName = isManager
    ? 'Inventory Manager'
    : isStaff
    ? 'Warehouse Staff'
    : user.role === 'admin'
    ? 'Administrator'
    : 'Warehouse Staff';

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recent Member';

  // Permission Matrix for display
  const permissions = [
    {
      feature: 'Catalog Administration (Create & Edit SKUs)',
      allowed: isManager,
      description: 'Add new items, modify pricing, reorder rules'
    },
    {
      feature: 'Warehouse & Storage Locations (Create & Edit)',
      allowed: isManager,
      description: 'Configure facilities, storage bins, and zones'
    },
    {
      feature: 'Inbound Receipts (Receive & Mark Ready)',
      allowed: true,
      description: 'Process incoming vendor shipments and dock deliveries'
    },
    {
      feature: 'Outbound Deliveries (Pick, Pack & Ship)',
      allowed: true,
      description: 'Fulfill customer orders and warehouse dispatches'
    },
    {
      feature: 'Stock Cycle Count Adjustments',
      allowed: true,
      description: 'Record verified inventory counts and discrepancy adjustments'
    },
    {
      feature: 'Immutable Movement Ledger (Audit Trail)',
      allowed: true,
      description: 'Inspect full historical inventory transaction ledger'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb / Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTab?.('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-slate-900/10 border-2 border-white ring-4 ring-slate-100">
              {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                user.is_active ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
              title={user.is_active ? 'Account Active' : 'Account Inactive'}
            >
              <Check className="w-3 h-3 text-white stroke-[3]" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {user.full_name || 'StockSense User'}
                </h1>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    isManager
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{roleDisplayName}</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    user.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-2xl pt-1">
              {isManager
                ? 'Full administrative control over warehouse topology, catalog SKUs, inventory adjustments, and operational workflows.'
                : 'Operational warehouse permissions for processing inbound receipts, outbound dispatches, inventory counting, and internal movements.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserIcon className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900">Account Details</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Full Name</span>
              <span className="font-semibold text-slate-900">{user.full_name || 'Not provided'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Email Address</span>
              <span className="font-mono text-slate-800">{user.email}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">System User ID</span>
              <span className="font-mono font-semibold text-slate-700">#USR-{String(user.id).padStart(4, '0')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Assigned Role</span>
              <span className="font-semibold text-slate-900">{roleDisplayName}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Account Status</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{user.is_active ? 'Active & Verified' : 'Suspended'}</span>
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Member Since</span>
              <span className="text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{memberSince}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900">Security & Authentication</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Auth Method</span>
              <span className="font-semibold text-slate-800">Secure Backend JWT (HS256)</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Password Encryption</span>
              <span className="font-mono text-slate-700">PBKDF2-HMAC-SHA256 (Salted)</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Session Status</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Active Bearer Token</span>
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Token Storage</span>
              <span className="font-mono text-slate-600">stocksense_token (localStorage)</span>
            </div>

            <div className="pt-2">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Current Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Privileges Matrix */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Entitlements</h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
            {roleDisplayName.toUpperCase()}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {permissions.map((perm, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-800">{perm.feature}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{perm.description}</p>
              </div>
              <div>
                {perm.allowed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3" />
                    <span>Authorized</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Manager Only</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
