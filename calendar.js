const config = require("./config");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const delay = require("delay");
const prettyMilliseconds = require('pretty-ms');

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = "token.json";

const login = loggedInCallback => {
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    authorize(JSON.parse(content), loggedInCallback);
  });

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
};

async function createEvent(auth, event) {
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.insert(
    {
      auth: auth,
      calendarId: config.calendar.id,
      resource: event
    },
    function(err) {
      if (err && err.response.data.error.code === 409) {
        updateEvent(auth, event);
        return;
      }

      if (err) {
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        return;
      }

      console.log("Event created: %s", event.summary);
    }
  );
}

async function updateEvent(auth, event) {
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.update(
    {
      auth: auth,
      calendarId: config.calendar.id,
      eventId: event.id,
      resource: event
    },
    function(err) {
      if (err) {
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        return;
      }
      console.log("Event updated: %s", event.summary);
    }
  );
}

const addEvents = async events => {
  login(async auth => {
    console.log(`Ok! Will create/update ${events.length} events! This will need ${prettyMilliseconds(events.length*250, 'ms')}`);
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      await delay(250);
      await createEvent(auth, event);
    }
  });
};

exports.login = login;
exports.createEvent = createEvent;
exports.addEvents = addEvents;
