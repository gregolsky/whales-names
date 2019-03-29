const util = require('util');
const docker = require('./docker');

class DockerContainerHostNamesSynchronizer {

    constructor (docker, hostNamesOperator) {
        this._docker = docker;
        this._hostNamesOperator = hostNamesOperator;
    }

    async synchronize() {
        const entries = await this._getHostEntries();
        await this._hostNamesOperator.updateAsync(entries);
    }

    async _getHostEntries() {
        const containerEntries = await this._docker.listContainersAsync();

        const containersPromises = containerEntries.map(async c => {
            const container = docker.getContainer(c.Id);
            container.inspectAsync = util.promisify(container.inspect);
            return await container.inspectAsync();
        });

        const containers = await Promise.all(containersPromises);

        const hostEntries = containers.reduce((result, c) => {
            const names = docker.getContainerNames(c);
            names.sort();
            const ips = docker.getContainerIps(c);

            // TODO add only reachable IPs
            const perIpEntries = ips.map(ip => ({
                ip, names
            }));
            result.push(...perIpEntries);

            return result;
        }, []);

        return hostEntries;
    }
}

module.exports = DockerContainerHostNamesSynchronizer;