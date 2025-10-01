import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';
import type { ZenApp } from './list-apps.js';
import type { Environment } from './shared-types.js';

// === Types ===

export interface UpdateAppInput {
  name: string;
  environment: Environment;
  repo_id?: string;
}

// === API Client ===

export class UpdateAppClient extends BaseAikidoClient {
  async execute(appId: string, data: UpdateAppInput): Promise<ZenApp> {
    return this.request<ZenApp>({
      method: 'PUT',
      url: `/firewall/apps/${appId}`,
      data,
    });
  }
}

// === MCP Tool Definition ===

export const updateAppTool: Tool = {
  name: 'update_zen_app',
  description: 'Update an existing Zen firewall application',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app to update',
      },
      name: {
        type: 'string',
        description: 'The name for the app',
      },
      environment: {
        type: 'string',
        enum: ['production', 'staging', 'development'],
        description: 'The environment for the app',
      },
      repo_id: {
        type: 'string',
        description: 'Optional repository ID to associate with the app',
      },
    },
    required: ['app_id', 'name', 'environment'],
  },
};

// === MCP Tool Handler ===

export async function handleUpdateApp(
  args: Record<string, unknown> | undefined,
  client: UpdateAppClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  const name = args?.name as string;
  const environment = args?.environment as Environment;
  const repo_id = args?.repo_id as string | undefined;

  if (!appId) throw new Error('app_id is required');
  if (!name) throw new Error('name is required');
  if (!environment) throw new Error('environment is required');

  const app = await client.execute(appId, { name, environment, repo_id });
  return {
    content: [{ type: 'text', text: JSON.stringify(app, null, 2) }],
  };
}
