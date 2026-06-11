const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwjHIKLgick8gwYOdzBoF-Y1FQfd-hmSSN-SegXBlf28Qnec5Zt7xuF5eAzTgRy-1pC/exec';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(req.body)
    });
  } catch (e) {
    console.error(e.message);
  }

  return res.status(200).json({ status: 'ok' });
};
