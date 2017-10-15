const docker = require('./docker');
const HostNamesFileOperator = require('./hosts');
const DockerContainerHostNamesSynchronizer = require('./sync');

process.on('unhandledRejection', (...args) => {
    console.error(args);
});

async function syncDockerHosts(hostsFile, checkInterval = 5000) {
    const hostNamesOperator = new HostNamesFileOperator(hostsFile); 
    const dockerNamesSynchronizer = new DockerContainerHostNamesSynchronizer(docker, hostNamesOperator);
    const intervalId = setInterval(async () => {
        try {
            await dockerNamesSynchronizer.synchronize();
        } catch (err) {
            console.error(err);
        }
    }, checkInterval);
    
}

module.exports = syncDockerHosts;