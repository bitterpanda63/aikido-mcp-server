# Aikido MCP Server (Unofficial)

**Unofficial** MCP server for integrating with Aikido Security API, providing access to Zen firewall apps and Teams management.

## Installation

```bash
git clone https://github.com/bitterpanda63/aikido-mcp-server.git
cd aikido-mcp-server
```

```bash
npm install
npm run build
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Aikido Client ID & Token:
```bash
AIKIDO_CLIENT_SECRET=
AIKIDO_CLIENT_ID=
```

Get your credentials from the [Aikido Settings](https://app.aikido.dev/settings/api)

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
