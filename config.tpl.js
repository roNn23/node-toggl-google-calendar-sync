var config = {};

config.calendar = {
  timeZone: "Europe/Berlin", // Your timezone
  id: "12345@group.calendar.google.com" // The ID of the google calendar (Go to the settings of the calendar and scroll down, the will be the ID)
};

config.toggl = {
  workspaceId: 123, // It's the ID of your workspace at Toggle. Just go to the timer (https://toggl.com/app/timer), click reports and copy the ID from the URL.
  userAgent: "mail@example.com", // This should be your mail address
  apiKey: "123456", // Find your API key in your Toggl profile: https://toggl.com/app/profile
  since: "2020-01-01" //YYYY-MM-DD
};

module.exports = config;
