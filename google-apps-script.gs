function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Leads') || ss.getActiveSheet();

    const name          = String(data.name          || '').trim();
    const phone         = String(data.phone         || '').replace(/[^\d]/g, '').trim();
    const objectType    = String(data.objectType    || '').trim();
    const area          = String(data.area          || '').trim();
    const repairType    = String(data.repairType    || '').trim();
    const designProject = String(data.designProject || '').trim();
    const startTime     = String(data.startTime     || '').trim();
    const source        = String(data.source        || 'quiz').trim();

    if (!phone) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Phone is required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const row     = [new Date(), name, phone, objectType, area, repairType, designProject, startTime, source];
    const nextRow = sheet.getLastRow() + 1;

    sheet.getRange('C:C').setNumberFormat('@');
    sheet.getRange(nextRow, 3).setNumberFormat('@');
    sheet.getRange(nextRow, 1, 1, 9).setValues([row]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
