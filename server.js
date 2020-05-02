const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const exceptionHandler = require("./utils/exceptionHandler");
const path = require("path");
const favicon = require("express-favicon");
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}
const availableCities = require("./cities.json");
const api_key = process.env.API_KEY;
app.use(favicon(__dirname + "/client/build/favicon.ico"));
class CustomError extends Error {
  constructor(message, statusCode = 0) {
    super(message);
    if (statusCode) this.statusCode = statusCode;
  }
}
const PORT = process.env.PORT || 5000;
const { check } = require("express-validator");
const errorChecker = require("./utils/errorCheckingMiddleware");
const compression = require("compression");
const helmet = require("helmet");

app.use(cors());

app.use(compression());
app.use(helmet());

app.use(express.json({ extended: false }));

const findCity = async (req, res) => {
  const { city } = req.body;
  const cityExists = availableCities.find((el) => el.id == city);
  if (!cityExists) throw new CustomError("City unavailable", 400);
  let url = baseUrl + `id=${city}&appid=${api_key}`;
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

// Global error handling through middleware
app.use((err, req, res, next) => {
  res
    .status(err.statusCode ? err.statusCode : 500)
    .json({ errors: Array.isArray(err.message) ? err.message : [err.message] });
});

app.listen(PORT, () => console.log(`API is listening on port ${PORT}`));
