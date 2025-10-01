import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';
import type { ZenApp } from './list-apps.js';

// === API Client ===

export class GetAppClient extends BaseAikidoClient {
  async execute(appId: string): Promise<ZenApp> {
    return this.request<ZenApp>({
      method: 'GET',
      url: `/firewall/apps/${appId}`,
    });
  }
}

// === MCP Tool Definition ===

export const getAppTool: Tool = {
  name: 'get_zen_app',
  description: 'Get details of a specific Zen firewall application by ID',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app to retrieve',
      },
    },
    required: ['app_id'],
  },
};

// === MCP Tool Handler ===

export async function handleGetApp(
  args: Record<string, unknown> | undefined,
  client: GetAppClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  if (!appId) throw new Error('app_id is required');

  const app = await client.execute(appId);
  return {
    content: [{ type: 'text', text: JSON.stringify(app, null, 2) }],
  };
}
