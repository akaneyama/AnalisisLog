import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';
import { AnalysisSummary } from '../../types/analysis';

export default function SecuritySummary({ summary, parsedCount }: { summary: AnalysisSummary, parsedCount: number }) {
    
    const getSeverityColor = (severity: string) => {
        const s = severity.toLowerCase();
        if (s.includes('critical')) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        if (s.includes('high')) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        if (s.includes('medium')) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        if (s.includes('low')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        return 'text-slate-400 bg-slate-800 border-slate-700';
    };

    const getStatusIcon = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('incident')) return <ShieldAlert className="w-8 h-8 text-rose-500" />;
        if (s.includes('suspicious')) return <Activity className="w-8 h-8 text-orange-500" />;
        if (s.includes('benign') || s.includes('informational')) return <ShieldCheck className="w-8 h-8 text-emerald-500" />;
        return <Shield className="w-8 h-8 text-indigo-500" />;
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-lg">
                        {getStatusIcon(summary.incident_status)}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-100">{summary.title || 'Security Event Analysis'}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                {parsedCount} Events Parsed
                            </span>
                            <span className="text-slate-700">•</span>
                            <span className="text-sm text-slate-400">{summary.category}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getSeverityColor(summary.severity)}`}>
                        {summary.severity || 'Unknown'}
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/20 text-indigo-400 bg-indigo-500/10">
                        CONFIDENCE: {summary.confidence}%
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Executive Summary</h3>
                <p className="text-slate-300 leading-relaxed">
                    {summary.executive_summary}
                </p>
            </div>
        </div>
    );
}
