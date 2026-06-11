/**
 * Vercel API — сохранение заявки в Google Sheets
 *
 * Переменные окружения (Vercel → Settings → Environment Variables):
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — полный JSON сервисного аккаунта (одной строкой)
 *   GOOGLE_SHEET_ID              — ID таблицы из URL: .../spreadsheets/d/ВОТ_ЭТО/edit
 *
 * Как получить сервисный аккаунт:
 *   1. console.cloud.google.com → IAM → Сервисные аккаунты → Создать
 *   2. Создать ключ (JSON) → скачать
 *   3. Открыть Google Sheets → Настройки доступа → добавить email сервис. аккаунта как Редактора
 */

const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, object, area, type, design, timing, source } = req.body;

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Создаём заголовки если лист пустой
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Заявки!A1',
    }).catch(() => null);

    if (!existing || !existing.data.values) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Заявки!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['Дата и время','Имя','Телефон','Тип объекта','Площадь','Вид ремонта','Дизайн-проект','Сроки начала','Источник']]
        },
      });
    }

    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Заявки!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          now,
          name   || '—',
          phone  || '—',
          object || '—',
          area   || '—',
          type   || '—',
          design || '—',
          timing || '—',
          source || 'Квиз · Сайт',
        ]]
      },
    });

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('CRM error:', err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
