import React, { useState } from 'react';
import { Play, Trash2, FileText, AlertCircle } from 'lucide-react';

interface LogInputProps {
    onParse: (logs: string) => void;
    isLoading: boolean;
    error: string | null;
}

const EXAMPLE_LOG = `predecoder.hostname
13.214.82.155

predecoder.timestamp
Aug 12 09:32:25

agent.ip
159.223.44.242

agent.name
eksad-log-collector-01

agent.id
087

agent.labels.tenant
tenant-eksad

manager.name
siem-wazuh

data.account_name
PT. Tiga Daya Digital Indonesia

rule.firedtimes
9

rule.level
10

rule.description
SentinelOne: Deep Visibility or STAR custom rule alert.

decoder.name
sentinelone

full_log
Aug 12 09:32:25 13.214.82.155 - CEF:0|SentinelOne|Mgmt|10100|primaryDescription=Syslog channel enabled for notification rule Delete rule (customrules.delete_rule) by m.afandi@eksad.com userEmail=m.afandi@eksad.com ruleId=customrules.delete_rule ruleName=Delete rule channel=syslog enabled=true categoryId=detection-center categoryName=Detection Center subcategoryId=custom-rules subcategoryName=Custom Rules accountId=2173707882752909757 accountName=PT. Tiga Daya Digital Indonesia scopeId=2544219320505374626 scopeName=Nemo Site

input.type
log

@timestamp
2026-08-12T09:32:26.364Z`;

export default function LogInput({ onParse, isLoading, error }: LogInputProps) {
    const [logs, setLogs] = useState('');

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-medium text-slate-200">Input Raw Logs</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLogs(EXAMPLE_LOG)}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
                        disabled={isLoading}
                    >
                        Example Log
                    </button>
                    <button
                        onClick={() => setLogs('')}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700 flex items-center gap-1"
                        disabled={isLoading}
                    >
                        <Trash2 className="w-4 h-4" /> Clear
                    </button>
                    <button
                        onClick={() => onParse(logs)}
                        disabled={isLoading || !logs.trim()}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors flex items-center gap-1 shadow-md shadow-indigo-500/20"
                    >
                        {isLoading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Play className="w-4 h-4" />
                        )}
                        Parse Logs
                    </button>
                </div>
            </div>
            
            <div className="p-4 relative">
                <textarea
                    value={logs}
                    onChange={(e) => setLogs(e.target.value)}
                    placeholder="Paste Wazuh or SentinelOne raw logs here..."
                    className="w-full h-64 bg-slate-950 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-y placeholder:text-slate-600"
                    spellCheck={false}
                />
            </div>

            {error && (
                <div className="px-4 pb-4">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">{error}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
