module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch(process.env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(req.body)
    });
    const text = await r.text();
    console.log('Apps Script:', text);
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('CRM error:', err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
