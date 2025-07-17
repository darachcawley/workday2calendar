function importCSVToCalendar() {
  const calendarId = '<YOUR GOOGLE CALENDAR ID HERE>'; // Replace with your calendar ID
  const fileName = 'WorkdayWorkerPTO.csv'; // File name in your Google Drive
  const calendar = CalendarApp.getCalendarById(calendarId);
  
  const files = DriveApp.getFilesByName(fileName);
  if (!files.hasNext()) {
    Logger.log('CSV file not found.');
    return;
  }

  const file = files.next();
  const csv = Utilities.parseCsv(file.getBlob().getDataAsString());

  const header = csv[0];
  const idIndex = header.indexOf('Worker');
  const startIndex = header.indexOf('Time Off Date');

  if (idIndex === -1 || startIndex === -1) {
    Logger.log('Required columns not found in CSV.');
    return;
  }

  for (let i = 1; i < csv.length; i++) {
    const row = csv[i];
    const title = row[idIndex];
    const rawStart = row[startIndex] ? row[startIndex].trim() : '';
    const rawDate = row[startIndex];
    const startDate = parseCustomDate(rawDate);
    const endDate = new Date(startDate);

    // Validate date
    if (isNaN(startDate.getTime())) {
      Logger.log(`Invalid date on row ${i + 1}: ${rawStart}`);
      continue; // Skip this row if date is invalid
    }

    // Set end date to one day after start
    endDate.setDate(endDate.getDate() + 1);

    // Check if an event with the same title and start time already exists
    const existingEvents = calendar.getEventsForDay(startDate);
    const alreadyExists = existingEvents.some(event =>
      event.getTitle() === title &&
      event.getStartTime().getTime() === startDate.getTime()
    );

    if (alreadyExists) {
      Logger.log(`Skipping duplicate: ${title} on ${startDate}`);
      continue; // Skip to next row
    }

    // Add the event to the Google Calendar
    calendar.createEvent(title, startDate, endDate);
    Logger.log('Created event for [' + title + '] starting on '+startDate+' ending on'+endDate);
  }

  Logger.log('Import complete.');
}
function parseCustomDate(dateStr) {
  const parts = dateStr.trim().split(/[\/\-]/); // handles both / and -
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-based
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}
