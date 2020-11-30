function run(options) {
    const runtime = process.versions['electron'] ? 'electron' : 'node';
    const abi = process.versions.modules;
    const platform = process.platform;
    const arch = process.arch;
    var nativeModules = require('./release/*');
}

if (process.env.NODE_ENV !== 'test') {
  run();
}

module.exports = run;