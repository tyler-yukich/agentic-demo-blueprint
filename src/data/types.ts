export type Segment = 'Business' | 'Household';

export interface DemoAccount {
  id: string;
  name: string;
  segment: Segment;
  city: string;
  region: string;
  contactName: string;
  email: string;
  installedProduct: string;
  monitoringPlan: string;
  lastPlanActiveDaysAgo: number;
  outageExposure: 'Elevated' | 'Moderate' | 'Low';
  resilienceCreditEligible: boolean;
  annualValue: number;
}

export interface WorkflowSummary {
  population: number;
  atRisk: number;
  eligible: number;
  drafts: number;
}

export type ToolId = 'outlook' | 'calendar' | 'sharepoint';
export type ToolState = Record<ToolId, boolean>;

export interface AgentMessage {
  role: 'user' | 'assistant';
  body: string;
}
