<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\LogParserService;
use App\Services\GroqService;
use Illuminate\Http\JsonResponse;

class LogAnalyzerController extends Controller
{
    private LogParserService $parserService;
    private GroqService $groqService;

    public function __construct(LogParserService $parserService, GroqService $groqService)
    {
        $this->parserService = $parserService;
        $this->groqService = $groqService;
    }

    public function parse(Request $request): JsonResponse
    {
        $request->validate([
            'logs' => 'required|string|max:100000',
        ]);

        $rawLogs = $request->input('logs');

        try {
            $events = $this->parserService->parse($rawLogs);

            if (empty($events)) {
                return response()->json(['error' => 'No valid events found in the provided logs.'], 400);
            }

            return response()->json([
                'status' => 'success',
                'parsed_events_count' => count($events),
                'parsed_data' => $events,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Parsing failed.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function explain(Request $request): JsonResponse
    {
        $request->validate([
            'events' => 'required|array',
        ]);

        $events = $request->input('events');

        try {
            $aiResult = $this->groqService->analyze($events);

            return response()->json([
                'status' => 'success',
                'analysis' => $aiResult,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'AI Analysis failed.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function report(Request $request): JsonResponse
    {
        $request->validate([
            'analysis' => 'required|array',
        ]);

        $analysisData = $request->input('analysis');

        try {
            $markdownReport = $this->groqService->generateReport($analysisData);

            return response()->json([
                'status' => 'success',
                'report' => $markdownReport,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Report generation failed.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
