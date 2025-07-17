# workday2calendar
Update a Team Google Calendar with PTO from Workday

**Source**
The CSV file is source file. This is exported manually from Workday. It needs to be saved to your My Drive in Google Drive, so it is accessible.

**Importer**
This is the google script that runs through each row of the CSV, checks if it exists and if not, adds it to a calendar of your choice (you just need access to it). This must be run in your Google Apps Script within your org: https://script.google.com/
