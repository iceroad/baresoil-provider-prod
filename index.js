module.exports = {
  name: 'prod',
  paths: {
    root: __dirname,
    cli: 'cli',
  },
  plugins: [
    require('baresoil-plugin-postgres-metastore'),
    require('baresoil-plugin-docker-sandbox'),
  ],
};
