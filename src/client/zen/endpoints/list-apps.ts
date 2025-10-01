import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface ZenApp {
  id: string;
  name: string;
  [key: string]: unknown;
}

// === API Client ===

export class ListAppsClient extends BaseAikidoClient {
  async execute(): Promise<ZenApp[]> {
    return this.request<ZenApp[]>({
      method: 'GET',
      url: '/firewall/apps',
    });
  }
}

// === MCP Tool Definition ===

export const listAppsTool: Tool = {
  name: 'list_zen_apps',
  description: 'List all Zen firewall applications in your Aikido account',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// === MCP Tool Handler ===

export async function handleListApps(
  args: Record<string, unknown> | undefined,
  client: ListAppsClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const apps = await client.execute();
  return {
    content: [{ type: 'text', text: JSON.stringify(apps, null, 2) }],
  };
}
