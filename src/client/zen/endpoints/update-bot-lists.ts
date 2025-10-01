import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';
import type { BotList } from './get-bot-lists.js';

// === Types ===

export type BotListMode = 'monitor' | 'block';

export interface BotConfig {
  code: string;
  mode: BotListMode;
}

export type UpdateBotListsInput = BotConfig[];

// === API Client ===

export class UpdateBotListsClient extends BaseAikidoClient {
  async execute(appId: string, data: UpdateBotListsInput): Promise<BotList> {
    return this.request<BotList>({
      method: 'PUT',
      url: `/firewall/apps/${appId}/bot-lists`,
      data,
    });
  }
}

// === MCP Tool Definition ===

export const updateBotListsTool: Tool = {
  name: 'update_bot_lists',
  description: 'Update the bot lists configuration for a Zen app (replaces existing config)',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app',
      },
      bots: {
        type: 'array',
        description: 'Array of bot configurations',
        items: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Bot code',
            },
            mode: {
              type: 'string',
              enum: ['monitor', 'block'],
              description: 'Action to take for this bot',
            },
          },
          required: ['code', 'mode'],
        },
      },
    },
    required: ['app_id', 'bots'],
  },
};

// === MCP Tool Handler ===

export async function handleUpdateBotLists(
  args: Record<string, unknown> | undefined,
  client: UpdateBotListsClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  const bots = args?.bots as BotConfig[];

  if (!appId) throw new Error('app_id is required');
  if (!bots) throw new Error('bots is required');

  const result = await client.execute(appId, bots);
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}
