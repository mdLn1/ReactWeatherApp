import React, { Component, Fragment } from "react";
import cloudy from "../assets/cloudy.jpg";
import rain from "../assets/rain.jpg";
import atmosphere from "../assets/atmosphere.jpg";
import clear from "../assets/clear.jpg";
import drizzle from "../assets/drizzle.jpg";
import snowy from "../assets/snowy.jpg";
import thunderstorm from "../assets/thunderstorm.jpg";
import axios from "axios";
import SearchBox from "../Components/SearchBox";
import LoadingCard from "../Components/LoadingCard";
import Loader from "../Components/Loader";
import getCookie from "../utils/getCookie";

const conditions = {
  2: thunderstorm,
  3: drizzle,
  5: rain,
  6: snowy,
  7: atmosphere,
  8: cloudy,
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    //3117735, 2648110, 1816670, 6094817, 5368361, 683506
    this.state = {
      cities: [2648110, 683506, 5368361, 1816670],
      response: [],
      loading: true,
      loadingSingle: false,
      errors: null,
      success: null,
    };
  }

  clearAlerts = (type) => {
    this.setState({ [type]: null });
  };

  findCity = async (city) => {
    if (this.state.cities.length >= 10) {
      this.setState({
        errors: ["You are allowed to add maximum 10 cities"],
        loadingSingle: false,
        success: null,
      });
      return;
    }
    this.setState({ errors: null, loadingSingle: true, success: null });
    try {
      const response = await axios.post(
        "/api/find-city",
        {
          city,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      this.props.sendRequest();
      this.setState((prevState) => ({
        ...prevState,
        cities: [city, ...prevState.cities],
        response: [response.data.response, ...prevState.response],
        loadingSingle: false,
        success: true,
      }));
      var d = new Date();
      d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000); // one year
      let existingCookie = getCookie("savedCities");
      if (existingCookie) {
        document.cookie = `savedCities=${
          existingCookie + "," + city
        };expires=${d.toUTCString()};path=/`;
      } else {
        document.cookie = `savedCities=${city};expires=${d.toUTCString()};path=/`;
      }
    } catch (error) {
      if (error.response?.data?.errors)
        this.setState({
          loadingSingle: false,
          errors: error.response.data.errors,
        });
      else {
        this.setState({
          loadingSingle: false,
          errors: ["Error while establishing connection"],
        });
      }
    }
  };

  removeCity = (city) => {
    let existingCookie = getCookie("savedCities");
    if (existingCookie.includes(city.toString())) {
      var d = new Date();
      d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000); // one year
      let index = existingCookie.indexOf(city.toString());
      if (existingCookie === city.toString()) {
        existingCookie = "";
      } else if (existingCookie.startsWith(city)) {
        existingCookie = existingCookie.replace(city + ",", "");
      }
      if (index > 1) {
        existingCookie = existingCookie.replace("," + city, "");
      }
      document.cookie = `savedCities=${existingCookie};expires=${d.toUTCString()};path=/`;
    }
    this.setState((prevState) => ({
      ...prevState,
      cities: prevState.cities.filter((el) => el !== city),
      response: prevState.response.filter((el) => el.id !== city),
    }));
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    let existingCookie = getCookie("savedCities");
    let { cities } = this.state;
    if (existingCookie) {
      cities = existingCookie.split(",");
    }
    // try {
    this._isMounted && axios
      .post(
        "/api/all-cities",
        {
          cities,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
       this._isMounted && this.setState({
          loading: false,
          response: response.data,
          cities: cities,
          errors: null
        });
        this._isMounted && this.props.sendRequest();
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          this._isMounted && this.setState({
            loading: false,
            errors: [error.response.data.errors],
            cities: cities,
          });
        } else {
          this._isMounted && this.setState({
            loading: false,
            errors: ["Error while establishing connection"],
            cities: cities,
          });
        }
      });
  }

  render() {
    const {
      response,
      cities,
      loading,
      loadingSingle,
      errors,
      success,
    } = this.state;

    return (
      <Fragment>
        {response.length === 0 && !loading && (
          <h1 style={{ paddingTop: "2rem" }}>
            So empty here... you should add a city
          </h1>
        )}
        {errors !== null &&
          errors.map((el, index) => {
            return (
              <span
                className={`alert danger ${
                  this.props.cookieConsentShow && "higher"
                }`}
                key={index}
              >
                <span
                  className="close pale"
                  onClick={() => this.clearAlerts("errors")}
                />
                {el}
              </span>
            );
          })}
        {success && (
          <span
            className={`alert success ${
              this.props.cookieConsentShow && "higher"
            }`}
          >
            <span
              className="close pale"
              onClick={() => this.clearAlerts("success")}
            />
            Success!
          </span>
        )}

        {loading ? (
          <Fragment>
            <Loader />
            <div className="cards">
              {cities.map((el, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <SearchBox searchCity={this.findCity} existingCities={cities} />
            {loadingSingle && <Loader />}
            <div className="cards">
              {loadingSingle && <LoadingCard />}
              {response.map((el, index) => (
                <div className="card" key={index}>
                  <span
                    className="close"
                    onClick={() => this.removeCity(el.id)}
                  />
                  <img
                    src={
                      el.weather[0].id === 800
                        ? clear
                        : conditions[parseInt(el.weather[0].id / 100)]
                    }
                    alt="Avatar"
                    style={{ width: "100%", maxHeight: "12em" }}
                  />
                  <div className="container">
                    <h4>
                      <b>
                        {el.name}, {el.sys.country}
                      </b>
                    </h4>
                    <p>Main: {el.weather[0].main}</p>
                    <p>Info: {el.weather[0].description}</p>
                    <p>{(el.main.temp - 273.15).toFixed(2)}&#176;C</p>
                    <p>
                      {el.weather[0].icon.includes("n") ? "Night" : "Day"} Time
                      Now
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
