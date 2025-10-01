import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { AikidoClientConfig } from './client/base-client.js';
import { OAuth2Client } from './client/oauth-client.js';
import { ZenClients, zenTools, handleZenTool } from './client/zen/index.js';
import { TeamsClients, teamsTools, handleTeamsTool } from './client/teams/index.js';

/**
 * MCP Server for Aikido Security API
 */
export class AikidoMCPServer {
  private server: Server;
  private zenClients: ZenClients;
  private teamsClients: TeamsClients;

  constructor(oauth2Client: OAuth2Client) {
    const config: AikidoClientConfig = { oauth2Client };

    this.zenClients = new ZenClients(config);
    this.teamsClients = new TeamsClients(config);

    this.server = new Server(
      {
        name: 'aikido-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Get all available tools by aggregating from modules
   */
  private getTools(): Tool[] {
    return [
      ...zenTools,
      ...teamsTools,
    ];
  }

  /**
   * Setup MCP request handlers
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    // Handle tool calls by routing to appropriate module
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        // Check if it's a Zen tool
        if (zenTools.some(tool => tool.name === name)) {
          return await handleZenTool(name, args, this.zenClients);
        }

        // Check if it's a Teams tool
        if (teamsTools.some(tool => tool.name === name)) {
          return await handleTeamsTool(name, args, this.teamsClients);
        }

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Aikido MCP Server running on stdio');
  }
}
