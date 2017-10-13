const { EOL } = require('os');

module.exports = {
    formatHostsEntries,
    formatHostsEntry
};

function formatHostsEntries(hostsEntries) {
    return hostsEntries.map(formatHostsEntry).join(EOL);
}

function formatHostsEntry(hostsEntry) {
    const namesString = hostsEntry.names.join(' ');
    return `${hostsEntry.ip}\t${namesString}`;
}