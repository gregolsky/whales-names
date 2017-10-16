const nodeVersion = parseInt((/v([0-9]+)./.exec(process.version))[1]);
if (nodeVersion < 8) {
    require('util.promisify/shim')();
}

const docker = require('./docker');
const HostNamesFileOperator = require('./hosts');
const DockerContainerHostNamesSynchronizer = require('./sync');

(async function main(...args) {
    args = args.slice(2);
    console.log(`Synchronizing docker container hostnames in hosts file.`);
    await syncDockerHosts(args[0]);
})();

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
