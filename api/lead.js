module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const p = new URLSearchParams({ ...req.body });
  await fetch(process.env.APPS_SCRIPT_URL + '?' + p.toString()).catch(() => {});
  return res.status(200).json({ status: 'ok' });
};
