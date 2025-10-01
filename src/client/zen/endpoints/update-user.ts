import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface UpdateUserInput {
  block?: boolean;
  [key: string]: unknown;
}

// === API Client ===

export class UpdateUserClient extends BaseAikidoClient {
  async execute(appId: string, userId: string, data: UpdateUserInput): Promise<void> {
    return this.request<void>({
      method: 'PUT',
      url: `/firewall/${appId}/users/${userId}`,
      data,
    });
  }
}

// === MCP Tool Definition ===

export const updateUserTool: Tool = {
  name: 'update_user',
  description: 'Update blocking status of a user in a Zen app',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app',
      },
      user_id: {
        type: 'string',
        description: 'The ID of the user',
      },
      block: {
        type: 'boolean',
        description: 'Whether to block or unblock the user',
      },
    },
    required: ['app_id', 'user_id', 'block'],
  },
};

// === MCP Tool Handler ===

export async function handleUpdateUser(
  args: Record<string, unknown> | undefined,
  client: UpdateUserClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  const userId = args?.user_id as string;
  if (!appId) throw new Error('app_id is required');
  if (!userId) throw new Error('user_id is required');

  const { app_id, user_id, ...updateData } = args || {};
  await client.execute(appId, userId, updateData);
  return {
    content: [{ type: 'text', text: 'User updated successfully' }],
  };
}
