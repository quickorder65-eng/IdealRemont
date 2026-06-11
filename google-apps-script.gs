function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Заявки') || ss.insertSheet('Заявки');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата','Имя','Телефон','Объект','Площадь','Вид ремонта','Дизайн','Сроки','Источник']);
  }

  sheet.appendRow([
    new Date().toLocaleString('ru'),
    data.name   || '',
    data.phone  || '',
    data.object || '',
    data.area   || '',
    data.type   || '',
    data.design || '',
    data.timing || '',
    data.source || 'Сайт'
  ]);

  return ContentService.createTextOutput('ok');
}
