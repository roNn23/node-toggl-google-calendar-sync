const config = require("./config");
const axios = require("axios");

const loadTrackedTimes = () => {
  const { userAgent, workspaceId, since, apiKey } = config.toggl;
  const togglEndpoint = "https://toggl.com/reports/api/v2/details";
  const togglParams = `user_agent=${userAgent}&workspace_id=${workspaceId}&since=${since}`;
  const axiosUrl = togglEndpoint + "?" + togglParams;

  const axiosOptions = {
    auth: {
      username: apiKey,
      password: "api_token"
    }
  };

  return axios.get(axiosUrl, axiosOptions);
};

exports.loadTrackedTimes = loadTrackedTimes;
