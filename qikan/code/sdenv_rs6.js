/**
 * sdenv_rs6.js — 瑞数6 Cookie 生成 + 请求
 * 基于 sdenv (jsdomFromUrl 自动处理 412 挑战)
 *
 * 用法:
 *   node sdenv_rs6.js              → 输出 cookies
 *   node sdenv_rs6.js --request    → 输出页面 HTML
 *   node sdenv_rs6.js --save       → 保存到 ../data/
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { jsdomFromUrl } = require('sdenv');
const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  host: 'qikan.cqvip.com',
  entryPath: '/Qikan/Journal/JournalGuid?from=index',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function initSdenv() {
  const url = `https://${CONFIG.host}${CONFIG.entryPath}`;
  console.error('[sdenv] 加载 %s ...', url);

  const dom = await jsdomFromUrl(url, {
    userAgent: CONFIG.userAgent,
    consoleConfig: { error: () => {} },
  });

  // 等待 RS JS 执行完毕
  await new Promise((resolve) => {
    dom.window.addEventListener('sdenv:exit', () => {
      console.error('[sdenv] sdenv:exit 事件触发');
      resolve();
    });
    setTimeout(() => {
      console.error('[sdenv] 超时 (12s)');
      resolve();
    }, 12000);
  });

  const cookies = dom.cookieJar.getCookieStringSync(`https://${CONFIG.host}`);
  console.error('[sdenv] 生成 cookies (%d chars): %s...', cookies.length, cookies.substring(0, 80));

  return { dom, cookies };
}

function httpGet(cookies, path) {
  return new Promise((resolve, reject) => {
    https.request({
      hostname: CONFIG.host,
      port: 443,
      path,
      method: 'GET',
      headers: {
        'User-Agent': CONFIG.userAgent,
        'Host': CONFIG.host,
        'Cookie': cookies,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Referer': `https://${CONFIG.host}/`,
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
      },
      rejectUnauthorized: false,
      timeout: 30000,
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf-8'),
        });
      });
    }).on('error', reject).end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const doRequest = args.includes('--request') || args.includes('--save');
  const doSave = args.includes('--save');

  // Step 1: sdenv 加载 → 生成 Cookie
  const { dom, cookies } = await initSdenv();

  if (!cookies || cookies.length < 20) {
    console.error('[FAIL] 未生成有效 Cookie');
    console.log('ERROR: no cookies');
    process.exit(1);
  }

  // Output cookies
  console.log(cookies);

  // Step 2: 带 Cookie 请求目标
  if (doRequest) {
    console.error('[sdenv] 带 Cookie 请求目标页面...');
    const result = await httpGet(cookies, CONFIG.entryPath);

    console.error('[sdenv] 请求结果: status=%d, body=%d 字节', result.status, result.body.length);

    if (result.status === 200 && result.body.length > 500) {
      console.error('[sdenv] 真实页面获取成功!');

      if (doSave) {
        const outDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'journal_guid.html'), result.body);
        console.error('[sdenv] 已保存到 data/journal_guid.html');
      }

      // Print first 500 chars
      console.error('\n--- 页面预览 (前500字符) ---');
      console.error(result.body.substring(0, 500));
    } else {
      console.error('[sdenv] 请求未获取到有效数据');
    }
  }

  // Cleanup
  try { dom.window.close(); } catch (e) {}
}

main().catch((e) => {
  console.error('[FATAL]', e.message);
  process.exit(1);
});
