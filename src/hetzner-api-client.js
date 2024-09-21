/**
 * Hetzner Cloud API Client configuration.
 */
const config = {
  url: 'https://api.hetzner.cloud/v1',
};

export class HetznerCloudApiClient {
  /**
   * Create a new Hetzner Cloud API client.
   *
   * @param {string} token - Hetzner Cloud API token.
   */
  constructor(token) {
    this.token = token;
  }

  /**
   * Send a request to the Hetzner Cloud API.
   *
   * @param {string} method - HTTP method.
   * @param {string} path - API path.
   * @param requestData {{ body?: object, headers?: object }} - Request data.
   * @returns {Promise<Response>}
   */
  #request(method, path, requestData = { headers: {} }) {
    return fetch(`${config.url}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...requestData.headers,
      },
      body: requestData.body ? JSON.stringify(requestData.body) : null,
    });
  }

  /**
   * Get all servers.
   *
   * @returns {Promise} - Promise representing the request.
   */
  getServers() {
    return this.#request('GET', '/servers');
  }

  /**
   * Create a new server.
   *
   * @param {Object} server - Server configuration.
   * @returns {Promise} - Promise representing the request.
   */
  createServer(server) {
    return this.#request('POST', '/servers', {
      body: server,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Delete a server.
   *
   * @param {string} serverId - Server ID.
   * @returns {Promise} - Promise representing the request.
   */
  deleteServer(serverId) {
    return this.#request('DELETE', `/servers/${serverId}`);
  }

  /**
   * Shut down a server gracefully.
   *
   * @param {string} serverId - Server ID.
   * @returns {Promise} - Promise representing the request.
   */
  shutdownServer(serverId) {
    return this.#request('POST', `/servers/${serverId}/actions/shutdown`);
  }

  /**
   * Power on a server.
   *
   * @param {string} serverId - Server ID.
   * @returns {Promise} - Promise representing the request.
   */
  powerOnServer(serverId) {
    return this.#request('POST', `/servers/${serverId}/actions/poweron`);
  }
}
