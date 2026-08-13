import React from 'react';
import { Lightbulb, CheckSquare, HelpCircle } from 'lucide-react';
import { Investigation as InvestigationType } from '../../types/analysis';

export default function Investigation({ investigation }: { investigation: InvestigationType }) {
    if (!investigation) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Investigation
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                    investigation.priority?.toLowerCase() === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    investigation.priority?.toLowerCase() === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                    {investigation.priority} PRIORITY
                </span>
            </div>

            <div className="space-y-6">
                {investigation.recommended_actions && investigation.recommended_actions.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                            Recommended Actions
                        </h4>
                        <ul className="space-y-2">
                            {investigation.recommended_actions.map((action, idx) => (
                                <li key={idx} className="flex items-start gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                    <span className="text-indigo-500 text-sm mt-0.5 font-bold">{idx + 1}.</span>
                                    <span className="text-sm text-slate-300">{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {investigation.questions_to_verify && investigation.questions_to_verify.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
                            <HelpCircle className="w-4 h-4 text-amber-400" />
                            Questions to Verify
                        </h4>
                        <ul className="space-y-2">
                            {investigation.questions_to_verify.map((q, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-400 bg-slate-800/30 p-2.5 rounded-lg">
                                    <span className="text-slate-500 shrink-0 mt-0.5">•</span>
                                    <span>{q}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
