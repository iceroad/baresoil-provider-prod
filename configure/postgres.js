const _ = require('lodash'),
  chalk = require('chalk'),
  crypto = require('crypto'),
  inquirer = require('inquirer')
  ;


function getPostgresMetastore(base, args, diskConfig) {
  return (cb) => {
    const config = _.get(diskConfig, 'server.MetaStore.postgres', {});

    console.log(`
Postgres MetaStore
──────────────────
Requires root access to a Postgres 9.5 or higher server. The setup procedure
will create an unprivileged user role called 'baresoil'.`);

    const questions = [
      {
        type: 'input',
        name: 'host',
        message: 'Postgres server hostname:',
        filter: inStr => _.toString(inStr).trim(),
        default: config.host || 'localhost',
      },
      {
        type: 'password',
        name: 'rootPassword',
        message: 'Password for the server\'s "postgres" role:',
        default: config.rootPassword,
        filter: inStr => _.toString(inStr).trim(),
        validate: (inStr) => {
          const inLen = inStr.length;
          if (inLen < 5 || inLen > 32) {
            return 'Must be between 5 and 32 characters.';
          }
          return true;
        },
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password to use for the new "baresoil" role:',
        default: config.password || crypto.randomBytes(16).toString('hex'),
        filter: inStr => _.toString(inStr).trim(),
        validate: (inStr) => {
          const inLen = inStr.length;
          if (inLen < 5 || inLen > 32) {
            return 'Must be between 5 and 32 characters.';
          }
          return true;
        },
      },
    ];

    function checkAnswers(answers) {
      const pgSection = {
        server: {
          MetaStore: {
            postgres: answers,
          },
        },
      };
      return cb(null, pgSection);
    }

    return inquirer.prompt(questions).then(checkAnswers);
  };
}

module.exports = getPostgresMetastore;
