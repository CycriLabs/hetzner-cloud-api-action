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
      logger('Server created', JSON.stringify(await response.json()));
    }

    if (inputs.action === 'delete-server') {
      const serverId = core.getInput('server-id');
      logger(`Deleting server ${serverId} from Hetzner Cloud API...`);
      const response = await client.deleteServer(serverId);
      logger('Server deleted', JSON.stringify(await response.json()));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
