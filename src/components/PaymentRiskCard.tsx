import React from 'react';
import { PaymentDetails } from '../types';
import { CreditCard, Phone, Link2, AlertTriangle } from 'lucide-react';

interface PaymentRiskCardProps {
  payment: PaymentDetails;
}

export const PaymentRiskCard: React.FC<PaymentRiskCardProps> = ({ payment }) => {
  if (!payment || !payment.detected) {
    return null;
  }

  const isSmallTrap = payment.is_verification_small_amount;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block">
            Financial Extraction
          </span>
          <h3 className="text-base font-bold text-[#0B1F33]">
            Extracted Payment Coordinates
          </h3>
        </div>

        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
            payment.risk_level === 'CRITICAL' || payment.risk_level === 'HIGH'
              ? 'text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]'
              : 'text-[#B45309] bg-[#FFFBEB] border-[#FCD34D]'
          }`}
        >
          {payment.risk_level} Risk Level
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {payment.amount && (
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Demanded Amount</span>
            <span className="text-base font-bold text-[#0B1F33] font-mono">
              {payment.amount}
            </span>
            {isSmallTrap && (
              <span className="text-[11px] font-medium text-[#B91C1C] block mt-0.5">
                Nominal verification fee pattern
              </span>
            )}
          </div>
        )}

        {payment.reason && (
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Stated Pretext</span>
            <span className="text-xs font-medium text-slate-800">
              {payment.reason}
            </span>
          </div>
        )}

        {payment.method && (
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Payment Method</span>
            <span className="text-xs font-medium text-slate-800">
              {payment.method}
            </span>
          </div>
        )}

        {payment.upi_id && (
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-slate-500 block">Target VPA</span>
            <span className="text-xs font-mono font-semibold text-[#0B1F33] truncate block">
              {payment.upi_id}
            </span>
          </div>
        )}

        {payment.phone_number && (
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Callback / Sender Phone</span>
            <span className="text-xs font-mono font-semibold text-slate-800 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              {payment.phone_number}
            </span>
          </div>
        )}

        {payment.url && (
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-slate-500 block">Detected Link</span>
            <span className="text-xs font-mono text-slate-700 truncate flex items-center gap-1">
              <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
              {payment.url}
            </span>
          </div>
        )}
      </div>

      {payment.explanation && (
        <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900 block mb-0.5">
            Contextual Assessment:
          </span>
          {payment.explanation}
        </div>
      )}
    </div>
  );
};
