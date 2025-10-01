import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface UpdateIPBlocklistInput {
    ip_addresses: string[];
}

// === API Client ===

export class UpdateIPBlocklistClient extends BaseAikidoClient {
  async execute(appId: string, data: UpdateIPBlocklistInput): Promise<void> {
    return this.request<void>({
      method: 'PUT',
      url: `/firewall/apps/${appId}/ip-blocklist`,
      data,
    });
  }
}

// === MCP Tool Definition ===

export const updateIPBlocklistTool: Tool = {
  name: 'update_ip_blocklist',
  description: 'Update the IP blocklist for a Zen app (replaces existing blocklist)',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app',
      },
      ip_addresses: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of IP addresses to block',
      },
    },
    required: ['app_id', 'ip_addresses'],
  },
};

// === MCP Tool Handler ===

export async function handleUpdateIPBlocklist(
  args: Record<string, unknown> | undefined,
  client: UpdateIPBlocklistClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  const ip_addresses = args?.ip_addresses as string[];
  if (!appId) throw new Error('app_id is required');
  if (!ip_addresses) throw new Error('ip_addresses is required');

  await client.execute(appId, { ip_addresses });
  return {
    content: [{ type: 'text', text: 'IP blocklist updated successfully' }],
  };
}
