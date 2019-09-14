const HostNamesFileOperator = require('../src/hosts');
const assert = require('assert');
const os = require('os');

describe('updates hosts files properly', function () {

    let resultFileContent = null;

    async function applyUpdate(srcContent, newHosts) {
        const operator = new HostNamesFileOperator();
        resultFileContent = await operator.updateHostsFileContent(srcContent, newHosts);
    }

    describe('with file already edited', function () {

        const OLD_HOSTS = [
            '127.0.0.1', '::1', '192.168.2.3', '172.120.8.1', '192.168.6.1'
        ];

        const SRC_FILE_CONTENT = `
127.0.0.1 localhost localhost.localdomain
::1 localhost
192.168.2.3 testmachine anothernameoftest

# whales-names begin
172.10.0.1 containerlove
# whales-names end

192.168.6.1 stuff
172.120.8.1 private
`.replace(/\n/g, os.EOL);

        describe('single update, with some docker hosts there', function () {
            const HOSTS = [
                { ip: '1.2.3.4', names: ['greg'] },
                { ip: '1.2.3.5', names: ['mikkel', 'jonas'] },
                { ip: '1.2.3.11', names: ['eleven'] }
            ];

            beforeEach(async function () {
                await applyUpdate(SRC_FILE_CONTENT, HOSTS);
            });

            it('old hosts are there', function () {
                for (let host in OLD_HOSTS) {
                    assert.notStrictEqual(-1, resultFileContent.indexOf(host));
                }
            });

            it('new hosts are there', function () {
                for (let host of HOSTS) {
                    assert.notStrictEqual(-1, resultFileContent.indexOf(`${host.ip}\t${host.names.join(' ')}`), resultFileContent);
                }
            });

            it('marker is there', function () {
                assert.notStrictEqual(-1, SRC_FILE_CONTENT.indexOf('whales-names begin'));
                assert.notStrictEqual(-1, SRC_FILE_CONTENT.indexOf('whales-names end'));
                assert.notStrictEqual(-1, resultFileContent.indexOf('whales-names begin'));
                assert.notStrictEqual(-1, resultFileContent.indexOf('whales-names end'));
            });

            it('lines count is new + markers + old', function () {
                const oldLineCount = SRC_FILE_CONTENT.split(os.EOL).length;
                const newLineCount = resultFileContent.split(os.EOL).length;
                assert.strictEqual(oldLineCount + HOSTS.length - 1, newLineCount, resultFileContent);
            });
        });

    });

    describe('with file never touched before', function () {

        const SRC_FILE_CONTENT = `
127.0.0.1 localhost localhost.localdomain
::1 localhost
192.168.2.3 testmachine anothernameoftest

192.168.6.1 stuff
`.replace(/\n/g, os.EOL);

        const DOCKER_HOST_CASES = [
            [
                { ip: '1.2.3.4', names: ['greg'] },
                { ip: '1.2.3.5', names: ['mikkel', 'jonas'] },
                { ip: '1.2.3.11', names: ['eleven'] }
            ],
            [] // no docker hosts at all
        ];

        for (var hostsCase of DOCKER_HOST_CASES) {

            describe(`single update, with ${hostsCase.length} docker hosts there`, function () {
                const HOSTS = hostsCase;

                beforeEach(async function () {
                    await applyUpdate(SRC_FILE_CONTENT, HOSTS);
                });

                it('old hosts are there', function () {
                    assert.strictEqual(0, resultFileContent.indexOf(SRC_FILE_CONTENT));
                });

                it('new hosts are there', function () {
                    for (let host of HOSTS) {
                        assert.notStrictEqual(-1, resultFileContent.indexOf(`${host.ip}\t${host.names.join(' ')}`), resultFileContent);
                    }
                });

                it('marker is there', function () {
                    assert.notStrictEqual(-1, resultFileContent.indexOf('whales-names begin'));
                    assert.notStrictEqual(-1, resultFileContent.indexOf('whales-names end'));
                });

                it('lines count is new + markers + old', function () {
                    const oldLineCount = SRC_FILE_CONTENT.split(os.EOL).length;
                    const newLineCount = resultFileContent.split(os.EOL).length;
                    assert.strictEqual(oldLineCount + 2 + HOSTS.length, newLineCount, resultFileContent);
                });

                it('multiple updates and lines count is still new + markers + old', async function () {
                    for (let i = 0; i < 30; i++) {
                        await applyUpdate(resultFileContent, HOSTS);
                    }

                    const oldLineCount = SRC_FILE_CONTENT.split(os.EOL).length;
                    const newLineCount = resultFileContent.split(os.EOL).length;
                    assert.strictEqual(oldLineCount + 2 + HOSTS.length, newLineCount, resultFileContent);
                });
            });
        }
    });
});