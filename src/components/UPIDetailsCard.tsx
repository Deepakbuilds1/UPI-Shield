import React from 'react';
import { UpiIntentDetails } from '../types';
import { QrCode, AlertCircle, Info } from 'lucide-react';

interface UPIDetailsCardProps {
  upi: UpiIntentDetails | null;
}

export const UPIDetailsCard: React.FC<UPIDetailsCardProps> = ({ upi }) => {
  if (!upi || (!upi.pa && !upi.pn && !upi.am)) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block">
            Payment Details
          </span>
          <h3 className="text-base font-bold text-[#0B1F33]">
            UPI Intent / QR Payload Inspector
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          NPCI URI Format
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">
            Payee (VPA)
          </span>
          <span className="text-xs font-mono font-semibold text-[#0B1F33] truncate block mt-0.5">
            {upi.pa || 'Not specified'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">
            Payee Name
          </span>
          <span className="text-xs font-semibold text-[#0B1F33] truncate block mt-0.5">
            {upi.pn || 'Unspecified'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">
            Amount & Currency
          </span>
          <span className="text-xs font-mono font-semibold text-[#0B1F33] block mt-0.5">
            {upi.am ? `₹${upi.am}` : 'User-defined'} {upi.cu || 'INR'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">
            Payment Destination
          </span>
          <span className="text-xs font-medium text-[#B45309] truncate block mt-0.5">
            Requires verification
          </span>
        </div>
      </div>

      {/* Professional Advisory */}
      <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-800 block">
            Destination could not be independently verified.
          </span>
          <p className="leading-relaxed">
            Always confirm that the receiver identity displayed on your UPI app (PhonePe, Google Pay, Paytm, BHIM) matches the intended party before authorizing any transaction with your MPIN.
          </p>
        </div>
      </div>
    </div>
  );
};
