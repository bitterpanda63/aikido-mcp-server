import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface Team {
  id: string;
  name: string;
  [key: string]: unknown;
}

// === API Client ===

export class ListTeamsClient extends BaseAikidoClient {
  async execute(): Promise<Team[]> {
    return this.request<Team[]>({
      method: 'GET',
      url: '/teams',
    });
  }
}

// === MCP Tool Definition ===

export const listTeamsTool: Tool = {
  name: 'list_teams',
  description: 'List all teams in your Aikido account',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// === MCP Tool Handler ===

export async function handleListTeams(
  args: Record<string, unknown> | undefined,
  client: ListTeamsClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const teams = await client.execute();
  return {
    content: [{ type: 'text', text: JSON.stringify(teams, null, 2) }],
  };
}
