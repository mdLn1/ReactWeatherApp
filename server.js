const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const exceptionHandler = require("./utils/exceptionHandler");
const path = require("path");
const favicon = require("express-favicon");
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const availableCities = require("./cities.json");
const http = require("http");
const socketIO = require("socket.io");
var cron = require("node-cron");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// this must be setup to work with open weather api
const api_key = process.env.API_KEY;
app.use(favicon(__dirname + "/client/build/favicon.ico"));
class CustomError extends Error {
  constructor(message, statusCode = 0) {
    super(message);
    if (statusCode) this.statusCode = statusCode;
  }
}
const PORT = process.env.PORT || 8080;
const { check } = require("express-validator");
const errorChecker = require("./utils/errorCheckingMiddleware");
const compression = require("compression");
const helmet = require("helmet");

app.use(cors());
let calls = 999;
app.use(compression());
app.use(helmet());

app.use(express.json({ extended: false }));

cron.schedule("59 23 * * *", () => {
  calls = 999;
});

const findCity = async (req, res) => {
  const { city } = req.body;
  const cityExists = availableCities.find((el) => el.id == city);
  if (!cityExists) throw new CustomError("City unavailable", 400);
  let url = baseUrl + `id=${city}&appid=${api_key}`;
  if (calls < 1) {
    throw new CustomError("No more requests can be done today", 400);
  } else {
    --calls;
  }
  const response = await axios.get(url);
  res.status(200).json({ response: response.data });
};

const allCities = async (req, res) => {
  const { cities } = req.body;
  const allCitiesExists = cities.every((el) =>
    availableCities.some((city) => city.id === parseInt(el))
  );
  if (!allCitiesExists)
    throw new CustomError("One or more cities were not found", 400);
  let url = "https://api.openweathermap.org/data/2.5/group?id=";
  for (let i = 0; i < cities.length - 1; i++) {
    url += cities[i] + ",";
  }
  url += cities[cities.length - 1] + `&appid=${api_key}`;
  if (calls - cities.length < 1) {
    throw new CustomError("No more requests can be done today", 400);
  } else {
    calls -= cities.length;
  }
  const response = await axios.get(url);
  res.status(200).json(response.data.list);
};

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "/client/build")));

app.post(
  "/api/find-city",
  [
    check("city", "A city id must be provided").exists().trim().isInt(),
    errorChecker,
  ],
  exceptionHandler(findCity)
);

app.post(
  "/api/all-cities",
  [check("cities", "Cities must be an array").exists().isArray(), errorChecker],
  exceptionHandler(allCities)
);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

// Handling pages not found
app.use((req, res, next) => {
  res.status(404).json({ errors: "Page not found" });
});

app.use((err, req, res, next) => {
  res
    .status(err.statusCode ? err.statusCode : 500)
    .json({ errors: Array.isArray(err.message) ? err.message : [err.message] });
});

const server = http.createServer(app);

const io = socketIO(server);
io.sockets.on("connection", (socket) => {

  socket.on("weatherRequests", (el) => {
    io.sockets.emit("weatherRequests", calls);
  });
});

server.listen(PORT);
