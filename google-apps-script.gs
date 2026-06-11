function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');

    const data = JSON.parse(e.postData.contents);

    const name          = data.name          || '';
    const phone         = data.phone         || '';
    const objectType    = data.objectType    || '';
    const area          = data.area          || '';
    const repairType    = data.repairType    || '';
    const designProject = data.designProject || '';
    const startTime     = data.startTime     || '';
    const source        = data.source        || '';

    if (!phone) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Phone is required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(),
      name,
      phone,
      objectType,
      area,
      repairType,
      designProject,
      startTime,
      source
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
