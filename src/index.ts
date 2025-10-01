#!/usr/bin/env node
import 'dotenv/config';
import { AikidoMCPServer } from './server.js';
import { OAuth2Client } from './client/oauth-client.js';

/**
 * Entry point for Aikido MCP Server
 */
async function main() {
  const clientId = process.env.AIKIDO_CLIENT_ID;
  const clientSecret = process.env.AIKIDO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Error: AIKIDO_CLIENT_ID and AIKIDO_CLIENT_SECRET environment variables are required');
    console.error('Please set them in your .env file or environment');
    console.error('Get your OAuth2 credentials from https://app.aikido.dev/settings/api');
    process.exit(1);
  }

  // Initialize OAuth2 client
  const oauth2Client = new OAuth2Client({
    clientId,
    clientSecret,
    tokenUrl: process.env.AIKIDO_OAUTH_TOKEN_URL,
  });

  const server = new AikidoMCPServer(oauth2Client);
  await server.start();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
