const functions = require("firebase-functions");
const { google } = require("googleapis");
const keys = require("./keys.json");
const spreadsheetKey = require("./spreadsheetsKey.json");
const express = require("express");

// Global constants
const client = new google.auth.JWT(
  keys.client_email, //email
  null, //keyfile
  keys.private_key, //key
  ["https://www.googleapis.com/auth/spreadsheets"] // scopes
);

// Google API methods
client.authorize(function (err, tokens) {
  if (err) console.log(err);
  else gsheet(client);
});

// Fetch data from the Google Sheets
async function gsheet(cl) {
  const gsApi = google.sheets({ version: "v4", auth: cl });

  const opt = {
    spreadsheetId: spreadsheetKey.id,
    range: "B1:J25",
  };

  data = await gsApi.spreadsheets.values.get(opt);
}

// Initialize Express & set View-engine
const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

// Route: /
app.get("/", async (req, res) => {
  await res.render("det", { data: data.data.values });
});

// Export it to deploy on Firebase
exports.app = functions.https.onRequest(app);
