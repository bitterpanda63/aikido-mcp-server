import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AikidoClientConfig } from '../base-client.js';

// Import all endpoint modules
import * as listApps from './endpoints/list-apps.js';
import * as getApp from './endpoints/get-app.js';
import * as createApp from './endpoints/create-app.js';
import * as updateApp from './endpoints/update-app.js';
import * as deleteApp from './endpoints/delete-app.js';
import * as rotateAppToken from './endpoints/rotate-app-token.js';
import * as getBotLists from './endpoints/get-bot-lists.js';
import * as updateBotLists from './endpoints/update-bot-lists.js';
import * as getIPLists from './endpoints/get-ip-lists.js';
import * as updateIPLists from './endpoints/update-ip-lists.js';
import * as updateIPBlocklist from './endpoints/update-ip-blocklist.js';
import * as getCountries from './endpoints/get-countries.js';
import * as updateCountries from './endpoints/update-countries.js';
import * as updateUser from './endpoints/update-user.js';
import * as updateBlocking from './endpoints/update-blocking.js';

// Export all types
export * from './endpoints/list-apps.js';
export * from './endpoints/create-app.js';
export * from './endpoints/update-app.js';
export * from './endpoints/rotate-app-token.js';
export * from './endpoints/get-bot-lists.js';
export * from './endpoints/update-bot-lists.js';
export * from './endpoints/get-ip-lists.js';
export * from './endpoints/update-ip-lists.js';
export * from './endpoints/update-ip-blocklist.js';
export * from './endpoints/get-countries.js';
export * from './endpoints/update-countries.js';
export * from './endpoints/update-user.js';
export * from './endpoints/update-blocking.js';

/**
 * Aggregate all Zen MCP tools
 */
export const zenTools: Tool[] = [
  listApps.listAppsTool,
  getApp.getAppTool,
  createApp.createAppTool,
  updateApp.updateAppTool,
  deleteApp.deleteAppTool,
  rotateAppToken.rotateAppTokenTool,
  getBotLists.getBotListsTool,
  updateBotLists.updateBotListsTool,
  getIPLists.getIPListsTool,
  updateIPLists.updateIPListsTool,
  updateIPBlocklist.updateIPBlocklistTool,
  getCountries.getCountriesTool,
  updateCountries.updateCountriesTool,
  updateUser.updateUserTool,
  updateBlocking.updateBlockingTool,
];

/**
 * Zen endpoint clients registry
 */
export class ZenClients {
  listApps: listApps.ListAppsClient;
  getApp: getApp.GetAppClient;
  createApp: createApp.CreateAppClient;
  updateApp: updateApp.UpdateAppClient;
  deleteApp: deleteApp.DeleteAppClient;
  rotateAppToken: rotateAppToken.RotateAppTokenClient;
  getBotLists: getBotLists.GetBotListsClient;
  updateBotLists: updateBotLists.UpdateBotListsClient;
  getIPLists: getIPLists.GetIPListsClient;
  updateIPLists: updateIPLists.UpdateIPListsClient;
  updateIPBlocklist: updateIPBlocklist.UpdateIPBlocklistClient;
  getCountries: getCountries.GetCountriesClient;
  updateCountries: updateCountries.UpdateCountriesClient;
  updateUser: updateUser.UpdateUserClient;
  updateBlocking: updateBlocking.UpdateBlockingClient;

  constructor(config: AikidoClientConfig) {
    this.listApps = new listApps.ListAppsClient(config);
    this.getApp = new getApp.GetAppClient(config);
    this.createApp = new createApp.CreateAppClient(config);
    this.updateApp = new updateApp.UpdateAppClient(config);
    this.deleteApp = new deleteApp.DeleteAppClient(config);
    this.rotateAppToken = new rotateAppToken.RotateAppTokenClient(config);
    this.getBotLists = new getBotLists.GetBotListsClient(config);
    this.updateBotLists = new updateBotLists.UpdateBotListsClient(config);
    this.getIPLists = new getIPLists.GetIPListsClient(config);
    this.updateIPLists = new updateIPLists.UpdateIPListsClient(config);
    this.updateIPBlocklist = new updateIPBlocklist.UpdateIPBlocklistClient(config);
    this.getCountries = new getCountries.GetCountriesClient(config);
    this.updateCountries = new updateCountries.UpdateCountriesClient(config);
    this.updateUser = new updateUser.UpdateUserClient(config);
    this.updateBlocking = new updateBlocking.UpdateBlockingClient(config);
  }
}

/**
 * Zen MCP tool handler - routes to appropriate endpoint handler
 */
export async function handleZenTool(
  toolName: string,
  args: Record<string, unknown> | undefined,
  clients: ZenClients
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (toolName) {
    case 'list_zen_apps':
      return listApps.handleListApps(args, clients.listApps);
    case 'get_zen_app':
      return getApp.handleGetApp(args, clients.getApp);
    case 'create_zen_app':
      return createApp.handleCreateApp(args, clients.createApp);
    case 'update_zen_app':
      return updateApp.handleUpdateApp(args, clients.updateApp);
    case 'delete_zen_app':
      return deleteApp.handleDeleteApp(args, clients.deleteApp);
    case 'rotate_app_token':
      return rotateAppToken.handleRotateAppToken(args, clients.rotateAppToken);
    case 'get_bot_lists':
      return getBotLists.handleGetBotLists(args, clients.getBotLists);
    case 'update_bot_lists':
      return updateBotLists.handleUpdateBotLists(args, clients.updateBotLists);
    case 'get_ip_lists':
      return getIPLists.handleGetIPLists(args, clients.getIPLists);
    case 'update_ip_lists':
      return updateIPLists.handleUpdateIPLists(args, clients.updateIPLists);
    case 'update_ip_blocklist':
      return updateIPBlocklist.handleUpdateIPBlocklist(args, clients.updateIPBlocklist);
    case 'get_countries':
      return getCountries.handleGetCountries(args, clients.getCountries);
    case 'update_countries':
      return updateCountries.handleUpdateCountries(args, clients.updateCountries);
    case 'update_user':
      return updateUser.handleUpdateUser(args, clients.updateUser);
    case 'update_blocking':
      return updateBlocking.handleUpdateBlocking(args, clients.updateBlocking);
    default:
      throw new Error(`Unknown Zen tool: ${toolName}`);
  }
}
