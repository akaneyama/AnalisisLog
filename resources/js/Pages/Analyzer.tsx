import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AnalysisResponse, NormalizedEvent, AIAnalysis } from '@/types/analysis';
import LogInput from '@/Components/Analyzer/LogInput';
import SecuritySummary from '@/Components/Analyzer/SecuritySummary';
import Timeline from '@/Components/Analyzer/Timeline';
import ThreatAssessment from '@/Components/Analyzer/ThreatAssessment';
import Indicators from '@/Components/Analyzer/Indicators';
import Investigation from '@/Components/Analyzer/Investigation';
import Entities from '@/Components/Analyzer/Entities';
import EventDetails from '@/Components/Analyzer/EventDetails';
import JsonViewer from '@/Components/Analyzer/JsonViewer';
import ReportViewer from '@/Components/Analyzer/ReportViewer';
import { Sparkles, FileText } from 'lucide-react';

export default function Analyzer() {
    const [isParsing, setIsParsing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [parsedData, setParsedData] = useState<NormalizedEvent[] | null>(null);
    const [parsedCount, setParsedCount] = useState<number>(0);
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
    const [incidentReport, setIncidentReport] = useState<string | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'parsed_events' | 'dashboard' | 'json' | 'report'>('parsed_events');

    const handleParse = async (logs: string) => {
        if (!logs.trim()) {
            setError('Please provide logs to analyze.');
            return;
        }

        setIsParsing(true);
        setError(null);
        setParsedData(null);
        setAiAnalysis(null);

        try {
            const response = await axios.post('/api/parse', { logs });
            setParsedData(response.data.parsed_data);
            setParsedCount(response.data.parsed_events_count);
            setActiveTab('parsed_events');
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || 'An unknown error occurred during parsing.';
            const details = err.response?.data?.details;
            setError(details ? `${msg} (${details})` : msg);
        } finally {
            setIsParsing(false);
        }
    };

    const handleExplain = async () => {
        if (!parsedData || parsedData.length === 0) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const response = await axios.post('/api/explain', { events: parsedData });
            setAiAnalysis(response.data.analysis);
            setActiveTab('dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || 'An unknown error occurred during AI analysis.';
            const details = err.response?.data?.details;
            setError(details ? `${msg} (${details})` : msg);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!aiAnalysis) return;

        setIsGeneratingReport(true);
        setError(null);

        try {
            const response = await axios.post('/api/report', { analysis: aiAnalysis });
            setIncidentReport(response.data.report);
            setActiveTab('report');
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || 'An unknown error occurred during report generation.';
            const details = err.response?.data?.details;
            setError(details ? `${msg} (${details})` : msg);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <>
            <Head title="Log" />
            <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
                <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
                    <div className="w-full px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">

                            <h1 className="text-xl font-semibold text-white bg-clip-text text-transparent">
                                Log Analyzer
                            </h1>
                        </div>

                    </div>
                </header>

                <main className="w-full px-4 sm:px-6 lg:px-12 py-8 space-y-6">
                    <LogInput onParse={handleParse} isLoading={isParsing} error={error} />

                    {/* Step 1: Parsed Data Results */}
                    {parsedData && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">

                            {/* Ask AI Header */}
                            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-500/10">
                                <div>
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                        Log Parsing Complete
                                    </h2>
                                    <p className="text-sm text-indigo-200/70 mt-1">
                                        Successfully extracted {parsedCount} event(s). Click explain to correlate events and assess threats with AI.
                                    </p>
                                </div>
                                <button
                                    onClick={handleExplain}
                                    disabled={isAnalyzing}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-indigo-500/20 whitespace-nowrap"
                                >
                                    {isAnalyzing ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {isAnalyzing ? 'Analyzing with AI...' : 'Ask AI to Explain'}
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg w-fit border border-slate-800">
                                <button
                                    onClick={() => setActiveTab('parsed_events')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'parsed_events'
                                        ? 'bg-slate-800 text-indigo-400 shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                        }`}
                                >
                                    Parsed Events
                                </button>
                                {aiAnalysis && (
                                    <button
                                        onClick={() => setActiveTab('dashboard')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard'
                                            ? 'bg-slate-800 text-indigo-400 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                            }`}
                                    >
                                        AI Dashboard
                                    </button>
                                )}
                                {incidentReport && (
                                    <button
                                        onClick={() => setActiveTab('report')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'report'
                                            ? 'bg-slate-800 text-indigo-400 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                            }`}
                                    >
                                        Incident Report
                                    </button>
                                )}
                                <button
                                    onClick={() => setActiveTab('json')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'json'
                                        ? 'bg-slate-800 text-indigo-400 shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                        }`}
                                >
                                    Raw JSON
                                </button>
                            </div>

                            {/* Tab Contents */}
                            {activeTab === 'parsed_events' && (
                                <EventDetails events={parsedData} />
                            )}

                            {activeTab === 'dashboard' && aiAnalysis && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleGenerateReport}
                                            disabled={isGeneratingReport}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-indigo-500/20"
                                        >
                                            {isGeneratingReport ? (
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <FileText className="w-4 h-4" />
                                            )}
                                            {isGeneratingReport ? 'Generating Report...' : 'Generate Incident Report'}
                                        </button>
                                    </div>
                                    <SecuritySummary summary={aiAnalysis.summary} parsedCount={parsedCount} />

                                    <Indicators indicators={aiAnalysis.indicators} />

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <ThreatAssessment assessment={aiAnalysis.threat_assessment} />
                                        <Timeline timeline={aiAnalysis.timeline} />
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <Investigation investigation={aiAnalysis.investigation} />
                                        <Entities entities={aiAnalysis.entities} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'report' && incidentReport && (
                                <ReportViewer markdown={incidentReport} />
                            )}

                            {activeTab === 'json' && (
                                <div className="space-y-6">
                                    <JsonViewer data={parsedData} title="Normalized Events JSON" />
                                    {aiAnalysis && (
                                        <JsonViewer data={aiAnalysis} title="Groq AI Analysis JSON" />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
