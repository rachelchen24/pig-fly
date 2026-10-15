// Shared helpers for the Vercel functions (files starting with _ are not routes).
// Storage: Upstash Redis, added from the Vercel dashboard (Storage → Upstash for Redis).
// Talks to it over its REST API with plain fetch, so there is nothing to npm install.
const crypto = require('crypto');

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const LIMITS = {
  failedTries: 10,              // wrong PINs / recovery codes allowed per code...
  lockSeconds: 15 * 60,         // ...within this window, then that code is locked for the rest of it
  sessionDays: 180,             // "stay logged in" lasts this long
  boardSize: 20,                // rows returned per leaderboard
  maxDistance: 1e6,             // meters; anything above is rejected outright
  minFastestSec: 60,            // nobody beats all 10 levels in under a minute
  maxSaveBytes: 200 * 1024,     // one player's save (a real one is a few KB)
};

// ---------- redis ----------
function configured() { return !!(REDIS_URL && REDIS_TOKEN); }
async function redis(...cmd) {
  const r = await fetch(REDIS_URL, { method: 'POST', headers: { Authorization: 'Bearer ' + REDIS_TOKEN }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error('redis: ' + j.error);
  return j.result;
}
async function pipeline(cmds) {
  const r = await fetch(REDIS_URL + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + REDIS_TOKEN }, body: JSON.stringify(cmds) });
  const j = await r.json();
  return j.map(x => { if (x.error) throw new Error('redis: ' + x.error); return x.result; });
}

// ---------- rules (same as the game's) ----------
const BLOCKED_CODES = ['FUCK', 'SHIT', 'CUNT', 'DICK', 'COCK', 'PISS', 'TITS', 'SLUT', 'WHOR', 'HOES', 'NAZI', 'RAPE', 'PORN', 'DAMN', 'BICH', 'BTCH', 'FCUK', 'PUSY', 'ANAL', 'ANUS', 'JIZZ', 'TWAT', 'KNOB', 'DYKE', 'SPIC', 'KIKE', 'GOOK', 'CHNK', 'HOMO', 'POOP', 'CRAP'];
const BLOCKED_PARTS = ['FAG', 'NIG', 'KKK', 'CUM', 'SEX', 'ASS', 'FUK', 'FCK', 'SHT', 'WTF', 'STFU'];
function normalizeCode(c) { return String(c || '').trim().toUpperCase(); }
function codeProblem(code) {
  if (!/^[A-Z0-9]{4}$/.test(code)) return 'Your code must be exactly 4 letters or digits.';
  if ((code.match(/[A-Z]/g) || []).length < 2) return 'Your code needs at least 2 letters (so "1234" won\'t work, but "AB12" will).';
  const unleet = code.replace(/0/g, 'O').replace(/1/g, 'I').replace(/3/g, 'E').replace(/4/g, 'A').replace(/5/g, 'S').replace(/7/g, 'T').replace(/8/g, 'B');
  if (BLOCKED_CODES.includes(code) || BLOCKED_CODES.includes(unleet) || BLOCKED_PARTS.some(p => code.includes(p) || unleet.includes(p))) return 'That code isn\'t allowed. Please pick another.';
  return null;
}
function pinProblem(pin) { return /^(\d{4}|\d{6})$/.test(String(pin || '')) ? null : 'Your PIN must be 4 or 6 digits.'; }

// ---------- scrambling ----------
function randHex(bytes) { return crypto.randomBytes(bytes).toString('hex'); }
function hashSecret(secret, salt) {
  return new Promise((ok, fail) => crypto.pbkdf2(String(secret), salt, 150000, 32, 'sha256', (e, k) => e ? fail(e) : ok(k.toString('hex'))));
}
function sha256(s) { return crypto.createHash('sha256').update(String(s)).digest('hex'); }
function sameHex(a, b) { return typeof a === 'string' && typeof b === 'string' && a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)); }
function makeRecoveryCode() { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const s = [...crypto.randomBytes(8)].map(b => A[b % A.length]).join(''); return s.slice(0, 4) + '-' + s.slice(4); }
function cleanRecovery(r) { return String(r || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }

// ---------- accounts ----------
const acctKey = (code) => 'acct:' + code;
async function getAccount(code) { const v = await redis('GET', acctKey(code)); return v ? JSON.parse(v) : null; }
async function putAccount(code, acct) { await redis('SET', acctKey(code), JSON.stringify(acct)); }

// Sessions: the browser keeps a random token; the server only stores its hash.
async function newSession(code) {
  const token = randHex(32), h = sha256(token), ttl = LIMITS.sessionDays * 86400;
  await pipeline([['SET', 'sess:' + h, code, 'EX', ttl], ['SADD', 'sessions:' + code, h], ['EXPIRE', 'sessions:' + code, ttl]]);
  return token;
}
async function sessionCode(token) { return token ? redis('GET', 'sess:' + sha256(token)) : null; }
async function endAllSessions(code) {
  const hs = (await redis('SMEMBERS', 'sessions:' + code)) || [];
  await pipeline([...hs.map(h => ['DEL', 'sess:' + h]), ['DEL', 'sessions:' + code]]);
}
// Wrong-guess limit per code, so a 4-digit PIN can't simply be tried 10,000 times.
async function locked(code) { return Number(await redis('GET', 'fails:' + code) || 0) >= LIMITS.failedTries; }
async function noteFail(code) {
  const n = await redis('INCR', 'fails:' + code);
  if (n === 1) await redis('EXPIRE', 'fails:' + code, LIMITS.lockSeconds); // the window starts at the first wrong try
  return n;
}
async function clearFails(code) { await redis('DEL', 'fails:' + code); }

// ---------- http ----------
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  const chunks = []; for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch (e) { return {}; }
}
function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}
// Wraps a handler: storage-not-set-up and unexpected errors become clean JSON errors.
function route(fn) {
  return async (req, res) => {
    if (!configured()) return send(res, 503, { error: 'The save server isn\'t set up yet (no database connected).' });
    try { await fn(req, res); }
    catch (e) { console.error(e); send(res, 500, { error: 'Something went wrong on the save server. Try again in a moment.' }); }
  };
}

module.exports = {
  LIMITS, configured, redis, pipeline, sha256, normalizeCode, codeProblem, pinProblem, randHex, hashSecret, sameHex, makeRecoveryCode, cleanRecovery,
  getAccount, putAccount, acctKey, newSession, sessionCode, endAllSessions, locked, noteFail, clearFails, readBody, send, route,
};
