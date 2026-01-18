const cron = require('node-cron');
const axios = require('axios');
const { runDailyPush } = require('./pushService');

// 已发送去重集合：按 “日期:配置ID:时间” 做当日去重
const sentKeySet = new Set();

function nowKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
function nowHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

async function fetchPushConfigs() {
  const url = process.env.PUSH_CONFIG_URL;
  if (!url) return [];
  try {
    const res = await axios.get(url);
    // 兼容服务返回数组或 { data: [] }
    return Array.isArray(res.data) ? res.data : (res.data?.data || []);
  } catch (e) {
    console.error('[push] fetch config error:', e.message);
    return [];
  }
}

async function tick() {
  const today = nowKey();
  const now = nowHHMM();
  const configs = await fetchPushConfigs();
  for (const cfg of configs) {
    if (!cfg?.enabled) continue;
    const time = cfg?.time; // 期望格式：'HH:mm'
    const id = String(cfg?.id || cfg?.receive_id || Math.random());
    const key = `${today}:${id}:${time}`;
    if (time === now && !sentKeySet.has(key)) {
      try {
        // demo：在该时间点直接触发推送
        await runDailyPush();
        sentKeySet.add(key);
        console.log('[push] sent:', key);
      } catch (e) {
        console.error('[push] send failed:', id, e.message);
      }
    }
  }
}

// 每分钟轮询一次配置接口，命中时间点则直接推送
cron.schedule('*/1 * * * *', tick);