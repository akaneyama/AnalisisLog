export interface NormalizedEvent {
  timestamp: string | null;
  source_ip: string | null;
  agent_ip: string | null;
  agent_name: string | null;
  tenant: string | null;
  account_name: string | null;
  scope_name: string | null;
  rule_id: string | null;
  rule_level: number | null;
  rule_description: string | null;
  decoder: string | null;
  event_type: string | null;
  actor: string | null;
  action: string | null;
  target: string | null;
  raw_log: string | null;
  cef_extensions?: Record<string, string>;
}

export interface AnalysisSummary {
  title: string;
  executive_summary: string;
  incident_status: string;
  confidence: number;
  severity: string;
  category: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  actor: string;
  source: string;
  description: string;
  importance: string;
}

export interface Entities {
  actors: string[];
  source_ips: string[];
  destination_ips: string[];
  hostnames: string[];
  agents: string[];
  accounts: string[];
  scopes: string[];
  rule_ids: string[];
}

export interface Action {
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  description: string;
}

export interface ThreatAssessment {
  is_security_incident: boolean;
  is_potentially_malicious: boolean;
  is_likely_benign: boolean;
  reasoning: string;
  evidence: string[];
}

export interface Indicator {
  type: string;
  value: string;
  risk: string;
  reason: string;
}

export interface Correlation {
  related_events: string[];
  attack_chain: string[];
  observations: string[];
}

export interface Investigation {
  priority: string;
  recommended_actions: string[];
  questions_to_verify: string[];
}

export interface AIAnalysis {
  summary: AnalysisSummary;
  timeline: TimelineEvent[];
  entities: Entities;
  actions: Action[];
  threat_assessment: ThreatAssessment;
  indicators: Indicator[];
  correlation: Correlation;
  investigation: Investigation;
  analyst_notes: string[];
}

export interface AnalysisResponse {
  status: string;
  parsed_events_count: number;
  parsed_data: NormalizedEvent[];
  analysis: AIAnalysis;
  error?: string;
  details?: string;
}
