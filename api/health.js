// GET /api/health: the game calls this at startup to see whether accounts are available here.
const { configured, redis, send } = require('./_lib');

module.exports = async (req, res) => {
  if (!configured()) return send(res, 200, { ok: false, reason: 'no database connected' });
  try { await redis('PING'); send(res, 200, { ok: true }); }
  catch (e) { send(res, 200, { ok: false, reason: 'database unreachable' }); }
};
