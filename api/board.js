// GET  /api/board                          -> { dist: [{code, best}], fast: [{code, sec}] }
// POST /api/board  { token, kind, value }  kind 'dist' (meters, higher is better) or 'fast' (seconds, lower is better)
// Each player keeps only their best entry. The game also refuses to post distances its gear couldn't reach.
const L = require('./_lib');

function pairs(flat) { const out = []; for (let i = 0; i < (flat || []).length; i += 2) out.push([flat[i], Number(flat[i + 1])]); return out; }

module.exports = L.route(async (req, res) => {
  if (req.method === 'GET') {
    const n = L.LIMITS.boardSize - 1;
    const [dist, fast] = await L.pipeline([['ZRANGE', 'board:dist', 0, n, 'REV', 'WITHSCORES'], ['ZRANGE', 'board:fast', 0, n, 'WITHSCORES']]);
    return L.send(res, 200, { dist: pairs(dist).map(([code, best]) => ({ code, best })), fast: pairs(fast).map(([code, sec]) => ({ code, sec })) });
  }
  if (req.method !== 'POST') return L.send(res, 405, { error: 'Use GET or POST.' });
  const b = await L.readBody(req);
  const code = await L.sessionCode(b.token);
  if (!code) return L.send(res, 401, { error: 'Log in to post scores.' });
  const v = Math.round(Number(b.value));
  if (b.kind === 'dist') {
    if (!(v > 0 && v <= L.LIMITS.maxDistance)) return L.send(res, 400, { error: 'That distance isn\'t possible.' });
    await L.redis('ZADD', 'board:dist', 'GT', v, code);   // GT: only replaces a lower best
  } else if (b.kind === 'fast') {
    if (!(v >= L.LIMITS.minFastestSec)) return L.send(res, 400, { error: 'That time isn\'t possible.' });
    await L.redis('ZADD', 'board:fast', 'LT', v, code);   // LT: only replaces a slower time
  } else return L.send(res, 400, { error: 'Unknown score kind.' });
  L.send(res, 200, { ok: true });
});
