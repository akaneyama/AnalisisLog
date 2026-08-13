import React, { useState } from 'react';
import { List, ChevronDown, ChevronUp, ShieldAlert, User, Network, FileJson } from 'lucide-react';
import { NormalizedEvent } from '../../types/analysis';

export default function EventDetails({ events }: { events: NormalizedEvent[] }) {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    if (!events || events.length === 0) return null;

    const toggleExpand = (idx: number) => {
        setExpandedIdx(expandedIdx === idx ? null : idx);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <List className="w-5 h-5 text-indigo-400" />
                    Parsed Event Details
                </h3>
                <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full font-medium">
                    {events.length} Events Detected
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Timestamp</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Action & Description</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Actor / Account</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Agent / Network</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Rule</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {events.map((evt, idx) => (
                            <React.Fragment key={idx}>
                                <tr 
                                    onClick={() => toggleExpand(idx)}
                                    className={`transition-colors cursor-pointer ${expandedIdx === idx ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-indigo-300 text-xs align-top">
                                        <div className="flex items-center gap-2">
                                            {expandedIdx === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                            {evt.timestamp || 'Not available'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 font-medium max-w-xs align-top">
                                        <div>{evt.action || evt.rule_description || 'Unknown Action'}</div>
                                        {evt.cef_extensions?.primaryDescription && (
                                            <div className="text-xs text-slate-400 mt-1 font-normal line-clamp-2" title={evt.cef_extensions.primaryDescription}>
                                                {evt.cef_extensions.primaryDescription}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 align-top">
                                        <div className="flex items-center gap-1"><User className="w-3 h-3 text-slate-500"/> {evt.actor || evt.account_name || 'N/A'}</div>
                                        {evt.target && <div className="text-xs text-slate-500 mt-1">Target: {evt.target}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 align-top">
                                        <div className="font-medium text-slate-300">{evt.agent_name || evt.scope_name || 'N/A'}</div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-mono">
                                            <Network className="w-3 h-3 text-slate-500"/> {evt.source_ip || evt.agent_ip || 'No IP'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 align-top">
                                        <div className="flex items-center gap-1 font-medium text-slate-300">
                                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                                            ID: {evt.rule_id || 'N/A'}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Level: <span className="text-amber-400 font-bold">{evt.rule_level || '-'}</span> 
                                            {evt.decoder && ` • ${evt.decoder}`}
                                        </div>
                                    </td>
                                </tr>
                                
                                {/* Expandable Row */}
                                {expandedIdx === idx && (
                                    <tr className="bg-slate-900/80 border-b-2 border-slate-800">
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                
                                                {/* Meta Info */}
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Extended Information</h4>
                                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                                        <div>
                                                            <span className="text-slate-500 block mb-1">Tenant</span>
                                                            <span className="text-slate-300 bg-slate-800 px-2 py-1 rounded">{evt.tenant || 'N/A'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 block mb-1">Event Type</span>
                                                            <span className="text-slate-300 bg-slate-800 px-2 py-1 rounded">{evt.event_type || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {evt.cef_extensions && Object.keys(evt.cef_extensions).length > 0 && (
                                                        <div className="mt-4">
                                                            <span className="text-slate-500 block mb-2 text-xs">CEF Extensions</span>
                                                            <div className="bg-slate-950 p-3 rounded-md border border-slate-800 max-h-40 overflow-y-auto">
                                                                <ul className="space-y-1">
                                                                    {Object.entries(evt.cef_extensions).map(([k, v]) => (
                                                                        <li key={k} className="text-xs flex gap-2">
                                                                            <span className="text-indigo-400 font-mono w-1/3 truncate" title={k}>{k}:</span>
                                                                            <span className="text-slate-300 font-mono flex-1 break-all">{v as string}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Raw Log Info */}
                                                <div>
                                                    <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider flex items-center gap-2 mb-4">
                                                        <FileJson className="w-4 h-4" /> Original Raw Log
                                                    </h4>
                                                    <div className="bg-slate-950 border border-slate-800 rounded-md p-3 max-h-64 overflow-y-auto">
                                                        <pre className="text-[10px] text-slate-400 font-mono whitespace-pre-wrap break-words">
                                                            {evt.raw_log || 'Raw log unavailable'}
                                                        </pre>
                                                    </div>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
