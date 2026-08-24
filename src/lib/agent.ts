import type { ToolId, ToolState } from '../data/types';
import { businessAccount, dateFromToday, workflowSummary } from '../data/fixtures';

export const defaultTools: ToolState = {
  outlook: true,
  calendar: true,
  sharepoint: true
};

export const toolLabels: Record<ToolId, { name: string; description: string }> = {
  outlook: { name: 'Outlook', description: 'Recent fictional correspondence' },
  calendar: { name: 'Calendar', description: 'Fictional meetings and availability' },
  sharepoint: { name: 'SharePoint', description: 'Fictional policy and account files' }
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const has = (query: string, words: string[]) => words.some((word) => query.includes(word));

function contextLines(tools: ToolState): string[] {
  const lines: string[] = [];
  if (tools.outlook) lines.push('Outlook shows that Mina asked for a fleet-runtime comparison last Thursday.');
  if (tools.calendar) lines.push(`Calendar has a 30-minute account review open on ${dateFromToday(2)} at 2:30 PM.`);
  if (tools.sharepoint) lines.push('SharePoint confirms the Resilience Credit covers the first year of Fleet Resilience monitoring.');
  if (!lines.length) lines.push('No personal-assistant tools are enabled, so I am using only the staged Salesforce profile.');
  return lines;
}

export function beaconReply(input: string, tools: ToolState = defaultTools): string {
  const query = normalize(input);
  const context = contextLines(tools);

  if (has(query, ['prepare', 'brief', 'account'])) {
    return [
      `Here is the fastest path into ${businessAccount.name}.`,
      `They operate ${businessAccount.installedProduct} hardware, but their ${businessAccount.monitoringPlan.toLowerCase()} coverage leaves the field team exposed during the current outage-risk window.`,
      ...context,
      'Recommended opening: lead with operational continuity, then offer the approved monitoring credit rather than a generic discount.'
    ].join('\n\n');
  }

  if (has(query, ['outage', 'resilience', 'segment', 'campaign'])) {
    return [
      `I identified ${workflowSummary.atRisk} elevated-risk accounts from the ${workflowSummary.population}-account fictional population.`,
      `${workflowSummary.eligible} meet the staged Resilience Credit policy, so I prepared ${workflowSummary.drafts} tailored drafts for seller review.`,
      tools.sharepoint
        ? 'The eligibility explanation uses the staged policy document available through SharePoint.'
        : 'SharePoint is disabled, so I can show the staged eligibility result but not the policy-document context.'
    ].join('\n\n');
  }

  if (has(query, ['meeting', 'schedule', 'calendar'])) {
    return tools.calendar
      ? `I found an open 30-minute account-review window on ${dateFromToday(2)} at 2:30 PM. This is a simulation; no calendar event was created.`
      : 'Calendar is disabled. I can draft an agenda, but I cannot inspect even the fictional availability until that tool is enabled.';
  }

  if (has(query, ['email', 'reply', 'message', 'outlook'])) {
    return tools.outlook
      ? 'The staged Outlook context shows interest in runtime and fleet coverage. I would answer those points directly and avoid leading with price.'
      : 'Outlook is disabled. I can use the Salesforce profile, but I cannot include correspondence context in the recommendation.';
  }

  return [
    'I can prepare an account brief, explain the outage-resilience segment, or stage a meeting and outreach plan.',
    ...context
  ].join('\n\n');
}
