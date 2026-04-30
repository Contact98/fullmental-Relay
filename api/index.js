// api/index.js
import { Readable } from 'node:stream'; // این خط را اضافه کنید

export default async function handler(req, res) {
  try {
    const target = process.env.TARGET_DOMAIN; // مثال: metal.duckdns.org:2096
    const url = `https://${target}${req.url}`;
    const headers = { ...req.headers };
    delete headers['host'];

    const proxyRes = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
      duplex: 'half',
      redirect: 'manual'
    });

    res.writeHead(proxyRes.status, proxyRes.headers);

    if (proxyRes.body) {
      // تبدیل ReadableStream وب به Stream قابل pipe در Node.js
      Readable.fromWeb(proxyRes.body).pipe(res);
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
