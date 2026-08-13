import React from 'react';
import { Clock } from 'lucide-react';
import { TimelineEvent } from '../../types/analysis';

export default function Timeline({ timeline }: { timeline: TimelineEvent[] }) {
    if (!timeline || timeline.length === 0) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Event Timeline
            </h3>
            
            <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-800">
                {timeline.map((item, index) => (
                    <div key={index} className="relative">
                        <div className="absolute -left-[30px] mt-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 z-10" />
                        
                        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <span className="text-sm font-mono text-indigo-400">{item.timestamp}</span>
                                <span className="text-xs font-medium px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                                    {item.importance}
                                </span>
                            </div>
                            <h4 className="text-base font-medium text-slate-200 mb-1">{item.event}</h4>
                            <p className="text-sm text-slate-400 mb-3">{item.description}</p>
                            
                            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                {item.actor && (
                                    <span className="flex items-center gap-1">
                                        <span className="text-slate-600">Actor:</span> {item.actor}
                                    </span>
                                )}
                                {item.source && (
                                    <span className="flex items-center gap-1">
                                        <span className="text-slate-600">Source:</span> {item.source}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
