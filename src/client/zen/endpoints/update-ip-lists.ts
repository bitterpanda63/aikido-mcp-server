import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';
import type { IPList } from './get-ip-lists.js';

// === Types ===

export type IPListMode = 'monitor' | 'block';

export interface ThreatActorConfig {
  code: string;
  mode: IPListMode;
}

export interface TorConfig {
  mode: IPListMode;
}

export interface UpdateIPListsInput {
  known_threat_actors?: ThreatActorConfig[];
  tor?: TorConfig;
}

// === API Client ===

export class UpdateIPListsClient extends BaseAikidoClient {
  async execute(appId: string, data: UpdateIPListsInput): Promise<IPList> {
    return this.request<IPList>({
      method: 'PUT',
      url: `/firewall/apps/${appId}/ip-lists`,
      data,
    });
  }
}

// === MCP Tool Definition ===

export const updateIPListsTool: Tool = {
  name: 'update_ip_lists',
  description: 'Update the IP lists configuration for a Zen app (replaces existing config)',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app',
      },
      known_threat_actors: {
        type: 'array',
        description: 'Configuration for known threat actors',
        items: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Threat actor code',
            },
            mode: {
              type: 'string',
              enum: ['monitor', 'block'],
              description: 'Action to take for this threat actor',
            },
          },
          required: ['code', 'mode'],
        },
      },
      tor: {
        type: 'object',
        description: 'Configuration for Tor exit nodes',
        properties: {
          mode: {
            type: 'string',
            enum: ['monitor', 'block'],
            description: 'Action to take for Tor traffic',
          },
        },
        required: ['mode'],
      },
    },
    required: ['app_id'],
  },
};

// === MCP Tool Handler ===

export async function handleUpdateIPLists(
  args: Record<string, unknown> | undefined,
  client: UpdateIPListsClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  if (!appId) throw new Error('app_id is required');

  const known_threat_actors = args?.known_threat_actors as ThreatActorConfig[] | undefined;
  const tor = args?.tor as TorConfig | undefined;

  const updateData: UpdateIPListsInput = {};
  if (known_threat_actors) updateData.known_threat_actors = known_threat_actors;
  if (tor) updateData.tor = tor;

  const result = await client.execute(appId, updateData);
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}
