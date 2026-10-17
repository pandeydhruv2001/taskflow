// Dependency-free development server for TaskFlow. Run: node serve.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
const root = process.cwd(), types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml" };
createServer(async (request, response) => { const pathname = new URL(request.url, "http://localhost").pathname; const safe = normalize(pathname === "/" ? "/index.html" : pathname).replace(/^([.][.][\\/])+/, ""); try { const file = await readFile(join(root, safe)); response.writeHead(200, { "Content-Type": types[extname(safe)] || "application/octet-stream", "Cache-Control": "no-store" }); response.end(file); } catch { response.writeHead(404); response.end("Not found"); } }).listen(4173, () => console.log("TaskFlow running at http://localhost:4173"));
