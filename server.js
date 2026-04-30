// server.js
import http from 'http';
import handler from './api/index.js';

// Railway خودش پورت رو توی متغیر محیطی PORT قرار میده
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // هر درخواست رو به هندلر اصلی پاس بده
  handler(req, res).catch(err => {
    console.error('Server error:', err);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end('Bad Gateway');
    }
  });
});

server.listen(PORT, () => {
  console.log(`XHTTP proxy running on port ${PORT}`);
});