import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { OAuth2Client } from './oauth-client.js';

export interface AikidoClientConfig {
  oauth2Client: OAuth2Client;
  baseURL?: string;
}

/**
 * Base Aikido API Client
 * Handles authentication and common request logic
 */
export class BaseAikidoClient {
  protected client: AxiosInstance;
  protected oauth2Client: OAuth2Client;

  constructor(config: AikidoClientConfig) {
    this.oauth2Client = config.oauth2Client;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://app.aikido.dev/api/public/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Make a request to the Aikido API
   */
  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    // Get fresh access token
    const accessToken = await this.oauth2Client.getAccessToken();

    // Add authorization header to request
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    const response = await this.client.request<T>(requestConfig);
    return response.data;
  }
}
