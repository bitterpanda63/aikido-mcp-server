import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface BotList {
  [key: string]: unknown;
}

// === API Client ===

export class GetBotListsClient extends BaseAikidoClient {
  async execute(appId: string): Promise<BotList> {
    return this.request<BotList>({
      method: 'GET',
      url: `/firewall/apps/${appId}/bot-lists`,
    });
  }
}

// === MCP Tool Definition ===

export const getBotListsTool: Tool = {
  name: 'get_bot_lists',
  description: 'Get the bot lists configuration for a Zen app',
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

export async function handleGetBotLists(
  args: Record<string, unknown> | undefined,
  client: GetBotListsClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  if (!appId) throw new Error('app_id is required');

  const botLists = await client.execute(appId);
  return {
    content: [{ type: 'text', text: JSON.stringify(botLists, null, 2) }],
  };
}
