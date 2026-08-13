import React from 'react';
import { Search } from 'lucide-react';
import { Indicator } from '../../types/analysis';

export default function Indicators({ indicators }: { indicators: Indicator[] }) {
    if (!indicators || indicators.length === 0) return null;

    const getRiskColor = (risk: string) => {
        const r = risk?.toLowerCase() || '';
        if (r.includes('high') || r.includes('critical')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        if (r.includes('medium')) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        if (r.includes('low')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        return 'text-slate-400 bg-slate-800 border-slate-700';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-800">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-400" />
                    Indicators of Compromise (IoC) / Interest
                </h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Type</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Value</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Risk</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {indicators.map((ind, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                                    {ind.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-indigo-300">
                                    {ind.value}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getRiskColor(ind.risk)}`}>
                                        {ind.risk}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                    {ind.reason}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
