# React Weather Web Application

## React.js, Node.js and Express framework tech stack

### Check the app [here](https://cities-weather-app.herokuapp.com/)

This application uses socket.io to update all the clients regarding how many city weather queries are left.

A maximum of 1000 API weather calls are allowed on a daily basis in the free subscription to  [open weather api](https://openweathermap.org/). **The value is not reliable because the app is run for free by Heroku hence it might be restarted and the counter will restart**

**If you want to run this application on your computer you need to make sure you got an api key from [open weather api](https://openweathermap.org/)**

You can set up different ports to run your application, for example port **8080**.

1. You need to edit `client/package.json` and change the value of the `proxy` to your choice, for example `http://localhost:8080`

2. You need to edit `endpoint` inside state in `client/src/App.js` to your choice, for example `http://localhost:8080`

3. You need to add the value for the environment variable `API_KEY` for the server with an api key value from [open weather api](https://openweathermap.org/)

4. Make sure that `endpoint`, `proxy` and `PORT` (server environment variable) variables are using the same destination.

Once the setup is done you need to run from the repository root `npm install` and `npm run build` then you simply to `npm start` and the application will run on the configured port.

## Image Gallery

### Desktop

![Desktop screenshot](https://github.com/mdLn1/ReactWeatherApp/blob/master/assets/desktop.png "web app desktop view")

### Tablet

![Tablet screenshot](https://raw.githubusercontent.com/mdLn1/ReactWeatherApp/blob/master/assets/tablet.png "web app tablet view")

### Mobile

![Mobile screenshot](https://raw.githubusercontent.com/mdLn1/ReactWeatherApp/blob/master/assets/mobile.png "web app mobile view")
