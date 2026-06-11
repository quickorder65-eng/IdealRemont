function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var name          = String(e.parameter.name          || '').trim();
    var phone         = String(e.parameter.phone         || '').replace(/[^\d]/g, '').trim();
    var objectType    = String(e.parameter.objectType    || '').trim();
    var area          = String(e.parameter.area          || '').trim();
    var repairType    = String(e.parameter.repairType    || '').trim();
    var designProject = String(e.parameter.designProject || '').trim();
    var startTime     = String(e.parameter.startTime     || '').trim();
    var source        = String(e.parameter.source        || 'quiz').trim();

    if (!phone) return ContentService.createTextOutput('error: phone is required');

    var nextRow = sheet.getLastRow() + 1;
    sheet.getRange('C:C').setNumberFormat('@');
    sheet.getRange(nextRow, 1, 1, 9).setValues([[
      new Date(), name, phone, objectType, area, repairType, designProject, startTime, source
    ]]);

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

function doGet() {
  return ContentService.createTextOutput('CRM script is working');
}
