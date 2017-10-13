const Docker = require('dockerode');
const util = require('util');

const docker = new Docker();

docker.listContainersAsync = util.promisify(docker.listContainers);

docker.getContainerNames = function (container) {
    const networks = getContainerNetworks(container);
    if (!networks)
        return [];

    const aliases = Object.keys(networks).reduce((result, networkKey) => {
        const net = networks[networkKey];
        result.push(net.Aliases);
        return result;
    }, []);
    
    console.log(container.Names, aliases);
    return [ ...container.Names, ...(aliases || []) ];
};

docker.getContainerIps = function (container) {
    const networks = getContainerNetworks(container);
    if (!networks)
        return [];

    return Object.keys(networks)
        .reduce((result, networkKey) => {
            const net = networks[networkKey];
            result.push(net.IpAddress);
            return result;
        }, []);
};

function getContainerNetworks(container) {
    if (!container.NetworkSettings 
        || !container.NetworkSettings.Networks
        || !Object.keys(container.NetworkSettings.Networks).length)
        return null;
    
    return container.NetworkSettings.Networks;
}

module.exports = docker;

