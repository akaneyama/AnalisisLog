import React, { useState } from 'react';
import { FileJson, Copy, Check, Download } from 'lucide-react';

export default function JsonViewer({ data, title }: { data: any, title: string }) {
    const [copied, setCopied] = useState(false);
    const jsonString = JSON.stringify(data, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <FileJson className="w-5 h-5 text-indigo-400" />
                    {title}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700 flex items-center gap-1"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} 
                        Copy JSON
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700 flex items-center gap-1"
                    >
                        <Download className="w-4 h-4" /> Download JSON
                    </button>
                </div>
            </div>
            
            <div className="p-4 bg-slate-950 overflow-x-auto">
                <pre className="text-xs text-indigo-300 font-mono leading-relaxed">
                    {jsonString}
                </pre>
            </div>
        </div>
    );
}
