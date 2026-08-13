import React, { useState } from 'react';
import { Database, Copy, Check } from 'lucide-react';
import { Entities as EntitiesType } from '../../types/analysis';

export default function Entities({ entities }: { entities: EntitiesType }) {
    if (!entities) return null;

    const [copiedItem, setCopiedItem] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(text);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    const renderEntityGroup = (title: string, items: string[]) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="mb-4 last:mb-0">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h4>
                <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="group relative flex items-center bg-slate-950 border border-slate-800 rounded-md overflow-hidden hover:border-indigo-500/50 transition-colors">
                            <div className="px-3 py-1.5 text-sm font-mono text-slate-300">
                                {item}
                            </div>
                            <button
                                onClick={() => handleCopy(item)}
                                className="px-2 py-1.5 bg-slate-900 border-l border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title="Copy to clipboard"
                            >
                                {copiedItem === item ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                Entities
            </h3>
            
            <div className="space-y-2">
                {renderEntityGroup('Actors', entities.actors)}
                {renderEntityGroup('IP Addresses', [...(entities.source_ips || []), ...(entities.destination_ips || [])].filter((v, i, a) => a.indexOf(v) === i))}
                {renderEntityGroup('Hostnames', entities.hostnames)}
                {renderEntityGroup('Agents', entities.agents)}
                {renderEntityGroup('Accounts', entities.accounts)}
                {renderEntityGroup('Scopes', entities.scopes)}
                {renderEntityGroup('Rule IDs', entities.rule_ids)}
            </div>
        </div>
    );
}
