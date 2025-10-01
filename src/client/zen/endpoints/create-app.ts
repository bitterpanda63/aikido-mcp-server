import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';
import type { ZenApp } from './list-apps.js';
import type { Environment } from './shared-types.js';

// === Types ===

export interface CreateAppInput {
  name: string;
  environment: Environment;
  repo_id?: string;
}

// === API Client ===

export class CreateAppClient extends BaseAikidoClient {
  async execute(data: CreateAppInput): Promise<ZenApp> {
    return this.request<ZenApp>({
      method: 'POST',
      url: '/firewall/apps',
      data,
    });
  }
}

// === MCP Tool Definition ===

export const createAppTool: Tool = {
  name: 'create_zen_app',
  description: 'Create a new Zen firewall application',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the new Zen app',
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
    required: ['name', 'environment'],
  },
};

// === MCP Tool Handler ===

export async function handleCreateApp(
  args: Record<string, unknown> | undefined,
  client: CreateAppClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const name = args?.name as string;
  const environment = args?.environment as Environment;
  const repo_id = args?.repo_id as string | undefined;

  if (!name) throw new Error('name is required');
  if (!environment) throw new Error('environment is required');

  const app = await client.execute({ name, environment, repo_id });
  return {
    content: [{ type: 'text', text: JSON.stringify(app, null, 2) }],
  };
}
