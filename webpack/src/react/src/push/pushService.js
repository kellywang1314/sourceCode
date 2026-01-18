// pushService.js
const axios = require('axios');
const FormData = require('form-data');
const puppeteer = require('puppeteer');

async function fetchDashboardData() {
  // 这里拉取你的看板数据或拼接查询参数（示例）
  const res = await axios.get(process.env.DASHBOARD_API, { params: { date: new Date().toISOString().slice(0, 10) } });
  return res.data;
}

async function screenshotDashboard(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const buf = await page.screenshot({ type: 'png', fullPage: true });
  await browser.close();
  return buf;
}

// 飞书：获取 tenant_access_token
async function getFeishuToken() {
  const res = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: process.env.FEISHU_APP_ID,
    app_secret: process.env.FEISHU_APP_SECRET,
  });
  return res.data.tenant_access_token;
}

// 飞书：上传图片得到 image_key
async function feishuUploadImage(token, imageBuf) {
  const form = new FormData();
  form.append('image_type', 'message');
  form.append('image', imageBuf, { filename: 'dashboard.png' });
  const res = await axios.post('https://open.feishu.cn/open-apis/im/v1/images', form, {
    headers: { Authorization: `Bearer ${token}`, ...form.getHeaders() },
  });
  return res.data.data.image_key;
}

// 飞书：按 open_id 发送图片消息
async function feishuSendImage(token, openId, imageKey) {
  await axios.post('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id', {
    receive_id: openId,
    msg_type: 'image',
    content: JSON.stringify({ image_key: imageKey }),
  }, { headers: { Authorization: `Bearer ${token}` } });
}

// 钉钉：群机器人签名并发送 markdown
const crypto = require('crypto');
function signDingTalk(secret, timestamp) {
  const str = `${timestamp}\n${secret}`;
  const hmac = crypto.createHmac('sha256', secret).update(str).digest('base64');
  return hmac;
}
async function dingtalkRobotSend(webhook, secret, title, text) {
  const ts = Date.now();
  const sign = signDingTalk(secret, ts);
  const url = `${webhook}&timestamp=${ts}&sign=${encodeURIComponent(sign)}`;
  await axios.post(url, {
    msgtype: 'markdown',
    markdown: { title, text },
    at: { isAtAll: false },
  });
}

async function runDailyPush() {
  // 1) 数据或截图资源
  const data = await fetchDashboardData();
  const imageBuf = await screenshotDashboard(`${process.env.DASHBOARD_URL}?date=${new Date().toISOString().slice(0, 10)}`);

  // 2) 飞书批量推送
  const token = await getFeishuToken();
  const imageKey = await feishuUploadImage(token, imageBuf);
  const recipients = await loadRecipients(); // 从 DB 读取 { platform, openId/webhook, ... }
  const larkUsers = recipients.filter(r => r.platform === 'lark');
  for (const u of larkUsers) {
    await feishuSendImage(token, u.openId, imageKey);
  }

  // 3) 钉钉群机器人（纯文字/链接，或外链图片）
  const dingtalkGroups = recipients.filter(r => r.platform === 'dingtalk_robot');
  const md = `## 每日看板\n> 主要指标：${data.main}\n![看板](${process.env.IMAGE_CDN_URL}/dashboard.png)`;
  for (const g of dingtalkGroups) {
    await dingtalkRobotSend(g.webhook, g.secret, '每日看板', md);
  }
}

async function loadRecipients() {
  // 从数据库或配置中心读取；示例返回
  return [
    { platform: 'lark', openId: 'ou_xxx' },
    { platform: 'dingtalk_robot', webhook: process.env.DING_WEBHOOK, secret: process.env.DING_SECRET },
  ];
}

module.exports = { runDailyPush };