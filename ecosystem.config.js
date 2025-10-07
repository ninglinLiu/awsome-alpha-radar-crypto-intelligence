/**
 * PM2 Ecosystem Configuration
 * 用于管理所有 Alpha Radar 进程
 * 
 * 使用方式:
 *   pm2 start ecosystem.config.js
 *   pm2 stop all
 *   pm2 restart all
 *   pm2 logs
 */

module.exports = {
  apps: [
    {
      name: 'alpha-api',
      script: 'backend/api/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      max_memory_restart: '1G',
      autorestart: true,
      watch: false
    },
    {
      name: 'alpha-scheduler',
      script: 'backend/scheduler/cron_jobs.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: 'logs/scheduler-error.log',
      out_file: 'logs/scheduler-out.log',
      max_memory_restart: '512M',
      autorestart: true,
      watch: false
    },
    {
      name: 'alpha-telegram',
      script: 'backend/telegram/bot.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: 'logs/telegram-error.log',
      out_file: 'logs/telegram-out.log',
      max_memory_restart: '256M',
      autorestart: true,
      watch: false
    },
    {
      name: 'alpha-frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: 'logs/frontend-error.log',
      out_file: 'logs/frontend-out.log',
      max_memory_restart: '512M',
      autorestart: true,
      watch: false
    }
  ]
}


