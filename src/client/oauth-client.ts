import axios from 'axios';

export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  tokenUrl?: string;
}

export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

/**
 * OAuth2 Token Manager
 * Handles OAuth2 Client Credentials flow for Aikido API
 */
export class OAuth2Client {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config: OAuth2Config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.tokenUrl = config.tokenUrl || 'https://app.aikido.dev/api/oauth/token';
  }

  /**
   * Get a valid access token (fetches new one if expired)
   */
  async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    // Fetch new token
    await this.fetchAccessToken();
    return this.accessToken!;
  }

  /**
   * Fetch a new access token using Client Credentials flow
   */
  private async fetchAccessToken(): Promise<void> {
    try {
      const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post<OAuth2TokenResponse>(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
        }).toString(),
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `OAuth2 token fetch failed: ${error.response?.status} ${error.response?.statusText || error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Force refresh the access token
   */
  async refreshToken(): Promise<void> {
    this.accessToken = null;
    this.tokenExpiry = null;
    await this.fetchAccessToken();
  }
}
