const chalk = require('chalk'),
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path')
  ;

function Init(base, args) {
  // Ensure init is run in an empty directory.
  if (fs.readdirSync(process.cwd()).length) {
    console.error('Directory not empty; please re-run in an empty directory.');
    return process.exit(1);
  }

  // Create skeleton baresoil-server.conf.json with just the current provider list.
  const outputFile = 'baresoil-server.conf.json';
  try {
    fs.writeFileSync(outputFile, JSON.stringify({
      provider: base.getProviderList().slice(1).join(','),
    }, null, 2), 'utf-8');
    console.info(`Created ${outputFile}`);
  } catch (e) {
    console.error(
        `Cannot write configuration file "${outputFile}": ${e.message}`);
    return process.exit(1);
  }
}

module.exports = Init;
