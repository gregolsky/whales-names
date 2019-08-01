const os = require('os');
const fs = require('fs');
const util = require('util');

fs.fileExistsAsync = function (path) {
    return new Promise (resolve => fs.exists(path, resolve));
};

fs.readFileAsync = util.promisify(fs.readFile.bind(fs));
fs.writeFileAsync = util.promisify(fs.writeFile.bind(fs));

function formatHostsEntries(hostsEntries) {
    return hostsEntries
        .filter(x => {
            return x.names && x.names.length && x.ip;
        })
        .map(formatHostsEntry)
        .join(os.EOL);
}

function formatHostsEntry(hostsEntry) {
    const namesString = hostsEntry.names.join(' ');
    return `${hostsEntry.ip}\t${namesString}`;
}

const UPDATE_REGION_START = '# whales-names begin' + os.EOL;
const UPDATE_REGION_END = '# whales-names end' + os.EOL;

function getDefaultHostNamesFile() {
    if (os.type() === 'Linux' || os.type() === 'Darwin') {
        return '/etc/hosts';
    } else if (os.type() === 'Windows_NT') {
        return 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    } else {
        throw new Error('Platform not supported.');
    }
}

const DOCKER_HOSTS_SECTION_REGEX = /# whales-names begin([\s\S]*)# whales-names end/;

class HostNamesFileOperator {

    constructor (hostsFile) {
        this._hostsFile = hostsFile || getDefaultHostNamesFile();
    }

    async updateAsync(hostNameEntries) {
        const hostsFileExists = await fs.fileExistsAsync(this._hostsFile);
        if (!hostsFileExists) {
            throw new Error(`Hosts file ${this._hostsFile} does not exist.`);
        }

        const dockerHostsSectionContent = formatHostsEntries(hostNameEntries) + os.EOL;
        const dockerHostsSection = `${UPDATE_REGION_START}${dockerHostsSectionContent}${UPDATE_REGION_END}`;

        //TODO use fs streams or readline
        let hostsFileContent = await fs.readFileAsync(this._hostsFile, 'utf8');
        if (DOCKER_HOSTS_SECTION_REGEX.test(hostsFileContent)) {
            hostsFileContent = hostsFileContent.replace(DOCKER_HOSTS_SECTION_REGEX, dockerHostsSection);
        } else {
            hostsFileContent = `${hostsFileContent}${os.EOL}${dockerHostsSection}`;
        }

        // TODO don't write if nothing changed
        await fs.writeFileAsync(this._hostsFile, hostsFileContent, 'utf8');
    }
}

module.exports = HostNamesFileOperator;
