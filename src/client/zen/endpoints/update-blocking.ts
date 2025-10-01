import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface UpdateBlockingInput {
  block: boolean;
  disable_minimum_wait_check?: boolean;
}

// === API Client ===

export class UpdateBlockingClient extends BaseAikidoClient {
  async execute(appId: string, data: UpdateBlockingInput): Promise<void> {
    return this.request<void>({
      method: 'PUT',
      url: `/firewall/apps/${appId}/blocking`,
      data,
    });
  }
}

// === MCP Tool Definition ===

export const updateBlockingTool: Tool = {
  name: 'update_blocking',
  description: 'Enable or disable blocking mode for a Zen app',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app',
      },
      block: {
        type: 'boolean',
        description: 'Whether to enable or disable blocking',
      },
      disable_minimum_wait_check: {
        type: 'boolean',
        description: 'Skip the 3-day minimum wait period for production apps. This safety period helps prevent accidental blocking of legitimate customer traffic. During this time, you can monitor traffic patterns and verify that only unwanted traffic would be affected.',
      },
    },
    required: ['app_id', 'block'],
  },
};

// === MCP Tool Handler ===

export async function handleUpdateBlocking(
  args: Record<string, unknown> | undefined,
  client: UpdateBlockingClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  const block = args?.block as boolean;
  const disable_minimum_wait_check = args?.disable_minimum_wait_check as boolean | undefined;

  if (!appId) throw new Error('app_id is required');
  if (block === undefined) throw new Error('block is required');

  await client.execute(appId, { block, disable_minimum_wait_check });
  return {
    content: [{ type: 'text', text: `Blocking ${block ? 'enabled' : 'disabled'} successfully` }],
  };
}
