# Aikido MCP Server

MCP server for integrating with Aikido Security API, providing access to Zen firewall apps and Teams management.

## Features

### Zen (Firewall) Tools
- **Apps Management**: `list_zen_apps`, `get_zen_app`, `create_zen_app`, `update_zen_app`, `delete_zen_app`, `rotate_app_token`
- **Bot Lists**: `get_bot_lists`, `update_bot_lists`
- **IP Lists**: `get_ip_lists`, `update_ip_lists`, `update_ip_blocklist`
- **Countries**: `get_countries`, `update_countries`
- **Users & Blocking**: `update_user`, `update_blocking`

### Teams Tools
- `list_teams` - List all teams in your account

## Installation

```bash
npm install
npm run build
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Aikido API token:
```bash
AIKIDO_API_TOKEN=your-api-token-here
```

Get your API token from [Aikido Settings](https://app.aikido.dev/settings/api)

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "aikido": {
      "command": "node",
      "args": ["/path/to/aikido-mcp-server/dist/index.js"],
      "env": {
        "AIKIDO_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Direct Usage

```bash
node dist/index.js
```

## Architecture

The server is structured for maximum extensibility and minimal duplication:

```
src/client/
├── base-client.ts          # Shared authentication & HTTP logic
├── zen/endpoints/          # One file per Zen endpoint
│   ├── list-apps.ts        # Types + Client + MCP Tool + Handler
│   ├── create-app.ts       # Types + Client + MCP Tool + Handler
│   └── ...                 # 15 total endpoint files
├── teams/endpoints/        # One file per Teams endpoint
│   └── list-teams.ts       # Types + Client + MCP Tool + Handler
└── server.ts               # Lightweight MCP server (routes only)
```

### Adding New Endpoints

To add a new endpoint, create one file in the appropriate `endpoints/` directory:

```typescript
// src/client/zen/endpoints/my-new-endpoint.ts
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseAikidoClient } from '../../base-client.js';

// 1. Types
export interface MyRequest { /* ... */ }
export interface MyResponse { /* ... */ }

// 2. API Client
export class MyEndpointClient extends BaseAikidoClient {
  async execute(data: MyRequest): Promise<MyResponse> {
    return this.request({ method: 'POST', url: '/my-endpoint', data });
  }
}

// 3. MCP Tool Definition
export const myEndpointTool: Tool = {
  name: 'my_endpoint',
  description: 'Description here',
  inputSchema: { /* ... */ },
};

// 4. MCP Handler
export async function handleMyEndpoint(args, client) {
  const result = await client.execute(args);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
}
```

Then add it to the module's `index.ts` - no changes needed to `server.ts`!

## API Reference

See [Aikido API Documentation](https://apidocs.aikido.dev) for more details on available endpoints.

## License

MIT
