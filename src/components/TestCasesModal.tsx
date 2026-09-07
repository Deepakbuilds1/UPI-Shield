import React, { useState } from 'react';
import { X, Search, SearchX, RotateCcw } from 'lucide-react';
import { TEST_CASES } from '../data/demoMessages';
import { DemoTestCase, RiskLevel } from '../types';

interface TestCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTestCase: (testCase: DemoTestCase) => void;
}

export const TestCasesModal: React.FC<TestCasesModalProps> = ({
  isOpen,
  onClose,
  onSelectTestCase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]';
      case 'HIGH':
        return 'text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]';
      case 'MEDIUM':
        return 'text-[#B45309] bg-[#FFFBEB] border-[#FCD34D]';
      case 'LOW':
        return 'text-slate-700 bg-slate-100 border-slate-200';
      case 'SAFE':
      default:
        return 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]';
    }
  };

  const filteredCases = TEST_CASES.filter((tc) => {
    const matchesQuery =
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.expectedRisk.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      selectedRiskFilter === 'ALL' || tc.expectedRisk === selectedRiskFilter;

    return matchesQuery && matchesRisk;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRiskFilter('ALL');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-xl p-6 space-y-4 max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0B1F33]">
              10 Benchmark Test Cases
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate detection performance against common Indian payment scam vectors
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close test cases modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by typology, keyword (e.g. electricity, courier, lottery), or text..."
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B1F33]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'SAFE'].map((risk) => (
              <button
                key={risk}
                type="button"
                onClick={() => setSelectedRiskFilter(risk)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedRiskFilter === risk
                    ? 'bg-[#0B1F33] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {risk === 'ALL' ? 'All Typologies' : risk}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable list or Empty State */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 min-h-[220px]">
          {filteredCases.length > 0 ? (
            filteredCases.map((tc) => (
              <div
                key={tc.id}
                className="p-3 rounded-lg border border-slate-200 bg-[#F8FAFC] hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-xs font-bold text-[#0B1F33]">
                      {tc.title}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {tc.tag}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRiskBadge(
                        tc.expectedRisk
                      )}`}
                    >
                      Expected: {tc.expectedRisk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 font-mono">
                    "{tc.text}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTestCase(tc);
                    onClose();
                  }}
                  className="h-8 px-3 rounded-lg text-xs font-semibold text-white bg-[#0B1F33] hover:bg-slate-800 transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
                >
                  <span>Load Sample</span>
                </button>
              </div>
            ))
          ) : (
            /* No Search Results Empty State */
            <div className="py-10 text-center space-y-3 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                <SearchX className="w-5 h-5" />
              </div>
              <div className="space-y-1 max-w-xs">
                <span className="text-xs font-bold text-slate-800 block">
                  No Matching Test Cases Found
                </span>
                <p className="text-[11px] text-slate-500">
                  No scam scenarios match your current filter query "{searchQuery}".
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0B1F33] bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredCases.length} of {TEST_CASES.length} test vectors</span>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
