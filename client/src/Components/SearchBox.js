import React, { Component } from "react";
import availableCities from "../cities.json";

export default class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      city: "",
      suggestions: [],
    };
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
    this.setState({
      suggestions:
        value === "" || value.match(/[^\s[a-zA-Z]]/gi)
          ? []
          : availableCities
              .filter(
                (el) =>
                  !this.props.existingCities.find(
                    (city) => parseInt(city) === el.id
                  )
              )
              .filter((el) => el.name.match(new RegExp(value, "ig"))),
    });
  };

  saveSelected = (city) => {
    document.getElementById("city-search").value = city;
    this.setState({ city: city, suggestions: [] });
  };

  searchCity = (e) => {
    e.preventDefault();
    document.getElementById("city-search").value = "";
    this.setState({ city: "" });
    this.props.searchCity(
      availableCities.find((el) => el.name === this.state.city)?.id || 0
    );
  };
  render() {
    return (
      <form onSubmit={this.searchCity} id="search-form">
        <div className="search-box dropdown">
          <input
            placeholder="Look for a city"
            name="city"
            type="text"
            id="city-search"
            className="search"
            onChange={this.handleChange}
            required
            minLength={2}
          />
          {this.state.suggestions.length > 0 && (
            <div className="dropdown-content">
              {this.state.suggestions.slice(0, 7).map((el, index) => (
                <span
                  key={index}
                  onClick={() => {
                    this.saveSelected(el.name);
                  }}
                >
                  {el.name}, {el.country}
                </span>
              ))}
            </div>
          )}
          <button type="submit" className="search">
            Add
          </button>
        </div>
      </form>
    );
  }
}
