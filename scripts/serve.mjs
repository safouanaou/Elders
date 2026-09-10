import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.argv[2] === 'dist' ? 'dist' : '.');
const portArg = process.argv.indexOf('--port');
const port = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || 5173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'};
http.createServer(async (req,res) => {
 try {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  const data = await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream'}).end(data);
 } catch { res.writeHead(404).end('Not found'); }
}).listen(port,'0.0.0.0',()=>console.log(`Elders is ready at http://localhost:${port}`));
