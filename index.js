const config = require('./config');
const toggleImporter = require("./togglImporter");
const calendar = require("./calendar");
const date = new Date();

console.log(`Starting @ ${date}`);

toggleImporter
  .loadTrackedTimes()
  .then(({ data }) => {
    const togglItems = data.data;

    const calendarEvents = togglItems.map(togglItem => {
        const summary = togglItem.description;
        const { id, client, project, start, end } = togglItem;
        const description = `ID: ${id}; Client: ${client}; Project: ${project};`;

        return {
            id: id,
            summary: summary,
            description: description,
            start: {
              dateTime: start,
              timeZone: config.calendar.timeZone
            },
            end: {
              dateTime: end,
              timeZone: config.calendar.timeZone
            }
          }
    });

    calendar.addEvents(calendarEvents);
  })
  .catch(err => {
      console.log('Error loading data from Toggl: %s', err);
  });