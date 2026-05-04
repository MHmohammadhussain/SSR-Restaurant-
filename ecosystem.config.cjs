module.exports = {
  apps: [
    {
      name: 'ssr-restaurant',
      cwd: __dirname,
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};