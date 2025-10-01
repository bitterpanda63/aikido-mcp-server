import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface RotateTokenResponse {
  token?: string;
  [key: string]: unknown;
}

// === API Client ===

export class RotateAppTokenClient extends BaseAikidoClient {
  async execute(appId: string): Promise<RotateTokenResponse> {
    return this.request<RotateTokenResponse>({
      method: 'POST',
      url: `/firewall/apps/${appId}/token`,
    });
  }
}

// === MCP Tool Definition ===

export const rotateAppTokenTool: Tool = {
  name: 'rotate_app_token',
  description: 'Rotate the token for a Zen app (creates new token and revokes current one)',
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

export async function handleRotateAppToken(
  args: Record<string, unknown> | undefined,
  client: RotateAppTokenClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  if (!appId) throw new Error('app_id is required');

  const result = await client.execute(appId);
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}
