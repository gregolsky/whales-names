const Docker = require('dockerode');
const util = require('util');

const docker = new Docker();

docker.listContainersAsync = util.promisify(docker.listContainers.bind(docker));

docker.getContainerNames = function (container) {
    const networks = getContainerNetworks(container);
    if (!networks)
        return [];

    const aliases = Object.keys(networks).reduce((result, networkKey) => {
        const net = networks[networkKey];
        
        if (net.Aliases && net.Aliases.length) {
            result.push(...net.Aliases);
        }

        return result;
    }, []);

    const namesSet = new Set([ container.Name.replace(/\//, ''), ...aliases ]);
    return [ ...namesSet ];
};

docker.getContainerIps = function (container) {
    const networks = getContainerNetworks(container);
    if (!networks || !Object.keys(networks).length)
        return [];

    return Object.keys(networks)
        .reduce((result, networkKey) => {
            const net = networks[networkKey];
            result.push(net.IPAddress);
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

