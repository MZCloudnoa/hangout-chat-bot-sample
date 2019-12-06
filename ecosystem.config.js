module.exports = {
  apps: [{
    name: 'hangout-bot',
    script: 'src/index.js',
    instances: 1,
    autorestart: true,
    watch: ['src', 'yarn.lock'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
    },
  }],
};
