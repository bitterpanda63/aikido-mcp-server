import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface IPList {
  [key: string]: unknown;
}

// === API Client ===

export class GetIPListsClient extends BaseAikidoClient {
  async execute(appId: string): Promise<IPList> {
    return this.request<IPList>({
      method: 'GET',
      url: `/firewall/apps/${appId}/ip-lists`,
    });
  }
}

// === MCP Tool Definition ===

export const getIPListsTool: Tool = {
  name: 'get_ip_lists',
  description: 'Get the IP lists configuration for a Zen app, including known threat actors and Tor settings',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app',
      },
    },
    required: ['app_id'],
  },
};

// === MCP Tool Handler ===

export async function handleGetIPLists(
  args: Record<string, unknown> | undefined,
  client: GetIPListsClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  if (!appId) throw new Error('app_id is required');

  const ipLists = await client.execute(appId);
  return {
    content: [{ type: 'text', text: JSON.stringify(ipLists, null, 2) }],
  };
}
