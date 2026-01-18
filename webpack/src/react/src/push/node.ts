// scheduler.js
const cron = require('node-cron');
const { runDailyPush } = require('./pushService');

// 每天 09:00 推送
cron.schedule('0 9 * * *', async () => {
    try {
        await runDailyPush();
        console.log('[cron] daily push done');
    } catch (e) {
        console.error('[cron] failed', e);
    }
});