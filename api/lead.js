const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwvHonkiTW4q0CIQq-4TvNfHhMz6LpKdWymCUykqBfPLfpp8-eYh8BzZtH2y645HldU/exec';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const b = req.body || {};

  const payload = {
    name:          b.name          || '',
    phone:         b.phone         || '',
    objectType:    b.objectType    || '',
    area:          b.area          || '',
    repairType:    b.repairType    || '',
    designProject: b.designProject || '',
    startTime:     b.startTime     || '',
    source:        b.source        || 'quiz'
  };

  if (!payload.phone) {
    return res.status(400).json({ success: false, error: 'Phone is required' });
  }

  try {
    const r = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });
    const text = await r.text();
    console.log('Apps Script response:', text);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('CRM error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
