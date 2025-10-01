import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';
import type { CountryConfig } from './get-countries.js';

// === Types ===

export type CountryMode = 'allow' | 'block';

export interface UpdateCountriesInput {
  list: string[];
  mode: CountryMode;
}

// === API Client ===

export class UpdateCountriesClient extends BaseAikidoClient {
  async execute(appId: string, data: UpdateCountriesInput): Promise<CountryConfig> {
    return this.request<CountryConfig>({
      method: 'PUT',
      url: `/firewall/apps/${appId}/countries`,
      data,
    });
  }
}

// === MCP Tool Definition ===

export const updateCountriesTool: Tool = {
  name: 'update_countries',
  description: 'Update the country-based IP blocking configuration for a Zen app (replaces existing config)',
  inputSchema: {
    type: 'object',
    properties: {
      app_id: {
        type: 'string',
        description: 'The ID of the Zen app',
      },
      list: {
        type: 'array',
        description: 'Array of 2-letter country codes (e.g., ["US", "GB", "FR"])',
        items: {
          type: 'string',
          pattern: '^[A-Z]{2}$',
        },
      },
      mode: {
        type: 'string',
        enum: ['allow', 'block'],
        description: 'Whether to allow or block the specified countries',
      },
    },
    required: ['app_id', 'list', 'mode'],
  },
};

// === MCP Tool Handler ===

export async function handleUpdateCountries(
  args: Record<string, unknown> | undefined,
  client: UpdateCountriesClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  const list = args?.list as string[];
  const mode = args?.mode as CountryMode;

  if (!appId) throw new Error('app_id is required');
  if (!list) throw new Error('list is required');
  if (!mode) throw new Error('mode is required');

  const result = await client.execute(appId, { list, mode });
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}
