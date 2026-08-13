import React from 'react';
import { Target, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ThreatAssessment as ThreatAssessmentType } from '../../types/analysis';

export default function ThreatAssessment({ assessment }: { assessment: ThreatAssessmentType }) {
    if (!assessment) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Threat Assessment
            </h3>

            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                    <div className={`p-3 rounded-lg border text-center ${assessment.is_security_incident ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                        <AlertTriangle className="w-6 h-6 mx-auto mb-2 opacity-80" />
                        <div className="text-xs font-semibold uppercase">Incident</div>
                        <div className="text-sm font-bold mt-1">{assessment.is_security_incident ? 'YES' : 'NO'}</div>
                    </div>
                    
                    <div className={`p-3 rounded-lg border text-center ${assessment.is_potentially_malicious ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                        <Target className="w-6 h-6 mx-auto mb-2 opacity-80" />
                        <div className="text-xs font-semibold uppercase">Malicious</div>
                        <div className="text-sm font-bold mt-1">{assessment.is_potentially_malicious ? 'YES' : 'NO'}</div>
                    </div>

                    <div className={`p-3 rounded-lg border text-center ${assessment.is_likely_benign ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                        <ShieldCheck className="w-6 h-6 mx-auto mb-2 opacity-80" />
                        <div className="text-xs font-semibold uppercase">Benign</div>
                        <div className="text-sm font-bold mt-1">{assessment.is_likely_benign ? 'YES' : 'NO'}</div>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Reasoning</h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                        {assessment.reasoning || 'No reasoning provided.'}
                    </p>
                </div>

                {assessment.evidence && assessment.evidence.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Evidence</h4>
                        <ul className="space-y-2">
                            {assessment.evidence.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
