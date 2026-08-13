<?php

namespace App\Services;

class LogParserService
{
    /**
     * Parse raw text containing one or more Wazuh/SentinelOne logs.
     *
     * @param string $rawLogs
     * @return array
     */
    public function parse(string $rawLogs): array
    {
        $events = [];
        $currentEvent = [];
        $currentKey = null;
        $currentValue = [];

        // Normalize line endings
        $rawLogs = str_replace("\r\n", "\n", $rawLogs);
        $lines = explode("\n", $rawLogs);

        foreach ($lines as $line) {
            $trimmedLine = trim($line);

            if ($trimmedLine === '') {
                // Empty line might mean end of value if we have a key
                if ($currentKey !== null && !empty($currentValue)) {
                    $val = implode("\n", $currentValue);
                    // Check if starting a new event
                    if (array_key_exists($currentKey, $currentEvent)) {
                        $events[] = $this->normalizeEvent($currentEvent);
                        $currentEvent = [];
                    }
                    $currentEvent[$currentKey] = $val;
                    $currentKey = null;
                    $currentValue = [];
                }
                continue;
            }

            if ($currentKey === null) {
                // If this line looks like a key (e.g., no spaces, or known format)
                // We assume it's a key.
                $currentKey = $trimmedLine;
            } else {
                // It's a value or part of a value
                $currentValue[] = $trimmedLine;
            }
        }

        // Handle the last pending key/value
        if ($currentKey !== null && !empty($currentValue)) {
            $val = implode("\n", $currentValue);
            if (array_key_exists($currentKey, $currentEvent)) {
                $events[] = $this->normalizeEvent($currentEvent);
                $currentEvent = [];
            }
            $currentEvent[$currentKey] = $val;
        }

        // Push the last event
        if (!empty($currentEvent)) {
            $events[] = $this->normalizeEvent($currentEvent);
        }

        return $events;
    }

    /**
     * Normalize a parsed event array into a structured object.
     */
    private function normalizeEvent(array $event): array
    {
        $normalized = [
            'timestamp' => $event['@timestamp'] ?? $event['timestamp'] ?? $event['predecoder.timestamp'] ?? null,
            'source_ip' => $event['agent.ip'] ?? null,
            'agent_ip' => $event['agent.ip'] ?? null,
            'agent_name' => $event['agent.name'] ?? null,
            'tenant' => $event['agent.labels.tenant'] ?? null,
            'account_name' => $event['data.account_name'] ?? null,
            'scope_name' => null,
            'rule_id' => $event['rule.id'] ?? null,
            'rule_level' => isset($event['rule.level']) ? (int) $event['rule.level'] : null,
            'rule_description' => $event['rule.description'] ?? null,
            'decoder' => $event['decoder.name'] ?? null,
            'event_type' => null,
            'actor' => null,
            'action' => null,
            'target' => null,
            'raw_log' => $event['full_log'] ?? null,
        ];

    
        if (!empty($normalized['raw_log']) && str_contains($normalized['raw_log'], 'CEF:')) {
            $cefFields = $this->parseCef($normalized['raw_log']);
            
            
            $normalized['account_name'] = $normalized['account_name'] ?? $cefFields['accountName'] ?? null;
            $normalized['scope_name'] = $cefFields['scopeName'] ?? $cefFields['siteName'] ?? null;
            $normalized['event_type'] = $cefFields['categoryName'] ?? $cefFields['classification'] ?? null;
            $normalized['action'] = $cefFields['ruleName'] ?? $cefFields['alertName'] ?? $cefFields['primaryDescription'] ?? $cefFields['description'] ?? null;
            $normalized['actor'] = $cefFields['userEmail'] ?? $cefFields['assetLastLoggedInUser'] ?? null;
            $normalized['target'] = $normalized['target'] ?? $cefFields['filePath'] ?? $cefFields['fileProcessName'] ?? null;
            
           
            $normalized['cef_extensions'] = $cefFields;
        }

        return $normalized;
    }

    /**
     * Simple CEF extension parser
     */
    private function parseCef(string $fullLog): array
    {
        $extensions = [];
        
        $cefPos = strpos($fullLog, 'CEF:');
        if ($cefPos !== false) {
            $cefPayload = substr($fullLog, $cefPos);
            
           
            preg_match_all('/([a-zA-Z0-9_\.]+)=(.*?)(?=\s+[a-zA-Z0-9_\.]+=|$)/u', $cefPayload, $matches, PREG_SET_ORDER);
            
            foreach ($matches as $match) {
                $key = trim($match[1]);
                $value = trim($match[2]);
                $extensions[$key] = $value;
            }
        }
        
        return $extensions;
    }
}
