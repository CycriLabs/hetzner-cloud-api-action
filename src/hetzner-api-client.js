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

  #request(method, path, body, headers = {}) {
    return fetch(`${config.url}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  /**
   * Get all servers.
   *
   * @returns {Promise} - Promise representing the request.
   */
  getServers() {
    return this.#request('GET', '/servers', null);
  }

  /**
   * Create a new server.
   *
   * @param {Object} server - Server configuration.
   * @returns {Promise} - Promise representing the request.
   */
  createServer(server) {
    return this.#request('POST', '/servers', server, {
      'Content-Type': 'application/json',
    });
  }
}
