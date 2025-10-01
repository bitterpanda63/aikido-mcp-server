import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === API Client ===

export class DeleteAppClient extends BaseAikidoClient {
  async execute(appId: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/firewall/apps/${appId}`,
    });
  }
}

// === MCP Tool Definition ===

export const deleteAppTool: Tool = {
  name: 'delete_zen_app',
  description: 'Delete a Zen firewall application',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app to delete',
      },
    },
    required: ['app_id'],
  },
};

// === MCP Tool Handler ===

export async function handleDeleteApp(
  args: Record<string, unknown> | undefined,
  client: DeleteAppClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  if (!appId) throw new Error('app_id is required');

  await client.execute(appId);
  return {
    content: [{ type: 'text', text: 'App deleted successfully' }],
  };
}
