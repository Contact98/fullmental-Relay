// api/index.js
export default async function handler(req, res) {
  try {
    // آدرس سرور اصلی V2Ray رو از متغیر محیطی میخونه
    const target = process.env.TARGET_DOMAIN; // مثال: 45.67.89.123:443 یا my.server.com:8443
    const url = `https://${target}${req.url}`;

    // کپی هدرها و حذف Host اصلی
    const headers = { ...req.headers };
    delete headers['host'];

    // ارسال درخواست به سرور اصلی با قابلیت استریم
    const proxyRes = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
      duplex: 'half', // ← این خط برای Node.js ضروریه (نه Vercel)
      redirect: 'manual'
    });

    // برگردوندن پاسخ به کلاینت
    res.writeHead(proxyRes.status, proxyRes.headers);
    if (proxyRes.body) {
      proxyRes.body.pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error('Proxy error:', err);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end('Bad Gateway');
    }
  }
}