const _ = require('lodash'),
  async = require('async'),
  chalk = require('chalk'),
  fs = require('fs'),
  json = JSON.stringify,
  spawnSync = require('child_process').spawnSync
  ;


function Configure(base, args) {
  const diskConfig = base.getDiskConfig().config;

  console.log(`
  ${chalk.yellow.bold('Baresoil "prod" Provider')}

  You will need:

     * a ${chalk.yellow('Postgres 9.5')} or higher database installed with root access.
     * ${chalk.yellow('Docker Engine')}, version 17-ce or higher.
`);

  const state = {};

  const sections = [
    require('./postgres')(base, args, diskConfig, state),
    require('./docker')(base, args, diskConfig, state),
  ];
  return async.series(sections, (err, results) => {
    if (err) {
      console.error(err.message);
      return process.exit(1);
    }
    const result = _.merge({}, diskConfig, ...results);
    const diskConfigPath = base.getDiskConfig().configPath;
    fs.writeFileSync(diskConfigPath, json(result, null, 2), 'utf-8');
    console.log(`Updated ${chalk.bold.green(diskConfigPath)}`);

    // Run "docker pull <default container name>"
    const cmdLine = `docker pull ${result.server.SandboxManager.defaultContainer}`;
    console.log(`Running "${cmdLine}"...`);
    const rv = spawnSync(cmdLine, {
      shell: true,
      stdio: 'inherit',
    });
    if (rv.status !== 0) {
      console.error(`Cannot run "${cmdLine}"`);
      return process.exit(1);
    }

    // Run "setup-postgres".
    return base.getCliCommand('setup-postgres').impl.call(this, base, args);
  });
}


module.exports = Configure;
