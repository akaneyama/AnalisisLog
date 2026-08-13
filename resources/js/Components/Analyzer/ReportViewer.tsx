import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Download, Copy, Check, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface ReportViewerProps {
    markdown: string;
}

export default function ReportViewer({ markdown }: ReportViewerProps) {
    const [copied, setCopied] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `incident_report_${new Date().getTime()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadPdf = () => {
        const element = document.getElementById('report-content');
        if (!element) return;
        
        setIsExportingPdf(true);
        const opt: any = {
            margin:       15,
            filename:     `incident_report_${new Date().getTime()}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().from(element).set(opt).save().then(() => {
            setIsExportingPdf(false);
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Formal Incident Report
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700 flex items-center gap-1"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} 
                        Copy
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700 flex items-center gap-1"
                    >
                        <Download className="w-4 h-4" /> Download .md
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isExportingPdf}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-md transition-colors flex items-center gap-1 shadow-md shadow-indigo-500/20"
                    >
                        {isExportingPdf ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Printer className="w-4 h-4" />
                        )} 
                        Save as PDF
                    </button>
                </div>
            </div>
            
            <div className="p-6 md:p-10 bg-slate-50 text-slate-900 overflow-x-auto" id="report-content">
                <div className="prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:text-slate-900 prose-a:text-indigo-600">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
