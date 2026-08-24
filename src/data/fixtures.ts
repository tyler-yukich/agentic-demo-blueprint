import generated from './generated.json';
import type { DemoAccount, WorkflowSummary } from './types';

export const accounts = generated.accounts as DemoAccount[];
export const atRiskAccounts = accounts.filter((account) => account.outageExposure === 'Elevated');
export const eligibleAccounts = atRiskAccounts.filter((account) => account.resilienceCreditEligible);

export const workflowSummary: WorkflowSummary = {
  population: accounts.length,
  atRisk: atRiskAccounts.length,
  eligible: eligibleAccounts.length,
  drafts: eligibleAccounts.length
};

export const businessAccount = eligibleAccounts.find((account) => account.segment === 'Business')!;
export const householdAccount = eligibleAccounts.find((account) => account.segment === 'Household')!;

export const dateFromToday = (days: number): string => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};
