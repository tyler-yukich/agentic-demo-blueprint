import { describe, expect, it } from 'vitest';
import { beaconReply, defaultTools } from './agent';
import type { ToolId, ToolState } from '../data/types';

const ids: ToolId[] = ['outlook', 'calendar', 'sharepoint'];
const permutations = Array.from({ length: 2 ** ids.length }, (_, mask) =>
  ids.reduce((state, id, index) => ({ ...state, [id]: Boolean(mask & (1 << index)) }), {} as ToolState)
);

describe('Beacon deterministic routing', () => {
  it('routes the account preparation intent', () => {
    expect(beaconReply('Help me prepare for this account', defaultTools)).toContain('fastest path');
  });

  it('routes the outage segment intent', () => {
    expect(beaconReply('Explain the outage segment', defaultTools)).toContain('elevated-risk accounts');
  });

  it('does not claim a calendar action occurred', () => {
    expect(beaconReply('Schedule a meeting', defaultTools)).toContain('no calendar event was created');
  });

  it.each(permutations)('responds coherently for tool state %#', (tools) => {
    const response = beaconReply('Help me prepare for this account', tools);
    expect(response.length).toBeGreaterThan(120);
    if (!Object.values(tools).some(Boolean)) expect(response).toContain('No personal-assistant tools are enabled');
  });
});
