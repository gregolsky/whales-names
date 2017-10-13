const process = require('process');
const fs = require('fs');
const util = require('util');
const hosts = require('./hosts');
const docker = require('./docker');

const hostsFile = process.argv[1];

const fileExistsAsync = util.promisify(fs.exists);

(async () => {

    const hostsFileExists = await fileExistsAsync(hostsFile);
    if (!hostsFileExists) {
        throw new Error(`Hosts file ${hostsFile} does not exist.`);
    }

    setInterval(syncDockerHostsToHostsFile, 1000);

    async function syncDockerHostsToHostsFile() {
        try {
            const containers = await docker.listContainersAsync();
            const hostsEntries = containers.reduce((result, c) => {
                const names = docker.getContainerNames(c);
                const ips = docker.getContainerIps(c);
                console.log(names);
                console.log(ips);
                // TODO add only reachable IPs
                result.push(ips.map(ip => ({ 
                    ip, names 
                })));

                return result;
            }, []);

            syncHostsFile(hostsEntries);
        } catch (err) {
            console.log(err);
        }

        function syncHostsFile(hostsEntries) {
            const hostsAppendix = hosts.formatHostsEntries(hostsEntries);
            console.log(hostsAppendix);
        }
    } 
})();