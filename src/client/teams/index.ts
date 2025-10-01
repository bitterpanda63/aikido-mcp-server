import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AikidoClientConfig } from '../base-client.js';

// Import all endpoint modules
import * as listTeams from './endpoints/list-teams.js';

// Export all types
export * from './endpoints/list-teams.js';

/**
 * Aggregate all Teams MCP tools
 */
export const teamsTools: Tool[] = [
  listTeams.listTeamsTool,
];

/**
 * Teams endpoint clients registry
 */
export class TeamsClients {
  listTeams: listTeams.ListTeamsClient;

  constructor(config: AikidoClientConfig) {
    this.listTeams = new listTeams.ListTeamsClient(config);
  }
}

/**
 * Teams MCP tool handler - routes to appropriate endpoint handler
 */
export async function handleTeamsTool(
  toolName: string,
  args: Record<string, unknown> | undefined,
  clients: TeamsClients
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (toolName) {
    case 'list_teams':
      return listTeams.handleListTeams(args, clients.listTeams);
    default:
      throw new Error(`Unknown Teams tool: ${toolName}`);
  }
}
