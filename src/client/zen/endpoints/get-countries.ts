import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// === Types ===

export interface CountryConfig {
  [key: string]: unknown;
}

// === API Client ===

export class GetCountriesClient extends BaseAikidoClient {
  async execute(appId: string): Promise<CountryConfig> {
    return this.request<CountryConfig>({
      method: 'GET',
      url: `/firewall/apps/${appId}/countries`,
    });
  }
}

// === MCP Tool Definition ===

export const getCountriesTool: Tool = {
  name: 'get_countries',
  description: 'Get the country-based IP blocking configuration for a Zen app',
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

export async function handleGetCountries(
  args: Record<string, unknown> | undefined,
  client: GetCountriesClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const appId = args?.app_id as string;
  if (!appId) throw new Error('app_id is required');

  const countries = await client.execute(appId);
  return {
    content: [{ type: 'text', text: JSON.stringify(countries, null, 2) }],
  };
}
