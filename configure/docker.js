const _ = require('lodash'),
  chalk = require('chalk'),
  crypto = require('crypto'),
  inquirer = require('inquirer')
  ;


function getDockerSandbox(base, args, diskConfig) {
  return (cb) => {
    const config = _.get(diskConfig, 'server.SandboxManager', {});

    console.log(`
Docker Sandbox
──────────────
Configure the default base container to use for sandboxes. This container will
be pulled from Docker Hub.`);

    const questions = [
      {
        type: 'input',
        name: 'defaultContainer',
        message: 'Default Docker container:',
        filter: inStr => _.toString(inStr).trim(),
        default: config.defaultContainer || 'iceroad/baresoil-sandbox',
      },
    ];

    function checkAnswers(answers) {
      return cb(null, {
        server: {
          SandboxManager: answers,
        },
      });
    }

    return inquirer.prompt(questions).then(checkAnswers);
  };
}

module.exports = getDockerSandbox;
