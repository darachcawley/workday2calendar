# workday2calendar
Update a Team Google Calendar with PTO from Workday

**Source**
The CSV file is source file which is the format of the manually exported list of worker PTO, which a manager can access.

**Importer**
Run as a google script within your org, this runs through each row, checks if it exists and if not, adds it to a calendar of your choice (you just need access to it).
