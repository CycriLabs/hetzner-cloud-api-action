import core from '@actions/core';
import { HetznerCloudApiClient } from './hetzner-api-client.js';

/**
 * Action for Hetzner cloud interaction.
 */
export async function run() {
  try {
    const inputs = {
      apiToken: core.getInput('api-token'),
      action: core.getInput('action'),
    };

    const logger = (message, debugMessage) => {
      core.info(message);

      if (debugMessage) {
        core.debug(debugMessage);
      }
    };

    const client = new HetznerCloudApiClient(inputs.apiToken);

    if (inputs.action === 'get-servers') {
      logger('Getting servers from Hetzner Cloud API...');
      const response = await client.getServers();
      logger('Servers fetched', JSON.stringify(await response.json()));
    }

    if (inputs.action === 'create-server') {
      const server = {
        image: core.getInput('server-image'),
        location: core.getInput('server-location'),
        name: core.getInput('server-name'),
        public_net: {
          enable_ipv6: false,
          ipv4: core.getInput('server-ipv4-id'),
        },
        server_type: core.getInput('server-type'),
        ssh_keys: core.getInput('ssh-key-names').split(','),
        start_after_create: core.getInput('server-start-after-create') === 'true',
      };

      logger('Creating server on Hetzner Cloud API...');
      const response = await client.createServer(server);
      const result = await response.json();
      logger('Server created', JSON.stringify(result));
      logger(`Server with ID '${result.server.id}' created.`);
      core.exportVariable('SERVER_ID', result.server.id);
    }

    if (inputs.action === 'poweron-server') {
      const serverId = core.getInput('server-id');
      logger(`Power on server ${serverId} via Hetzner Cloud API...`);
      const response = await client.powerOnServer(serverId);
      logger('Server started', JSON.stringify(await response.json()));
    }

    if (inputs.action === 'shutdown-server') {
      const serverId = core.getInput('server-id');
      logger(`Shut down server ${serverId} gracefully via Hetzner Cloud API...`);
      const response = await client.shutdownServer(serverId);
      logger('Server shut down', JSON.stringify(await response.json()));
    }

    if (inputs.action === 'delete-server') {
      const serverId = core.getInput('server-id');
      logger(`Deleting server ${serverId} via Hetzner Cloud API...`);
      const response = await client.deleteServer(serverId);
      logger('Server deleted', JSON.stringify(await response.json()));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
