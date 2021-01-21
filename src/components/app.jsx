import React from "react";

import DailyPanel from "./dailyPanel";
import Forecast from "./forecast";
import Search from "./search";

import "../App.css";

/**
 * API veriables
 */
const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API;
const IPAPI_API = "https://ipapi.co/json";
const WEATHER_MAP_API = "https://api.openweathermap.org/data/2.5/";

export default class App extends React.Component {
  state = {
    city: "",
    currentWeather: {},
    sharableUrl: "",
    celcius: false,
    fiveDayForecast: new Array(5),
  };

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let cityParam = params.get("search");
    if (cityParam !== null) {
      console.log("  ", cityParam);
      this.setState({
        city: cityParam,
        shareableUrl: "",
      });
      this.getCurrentWeather(cityParam);
    } else {
      this.initCurrentWeather();
    }
  }

  /**
   * init API requests ::: returns currentWeather based on ip
   * https://openweathermap.org/current
   */
  // TODO: proper error handling
  initCurrentWeather = () => {
    fetch(IPAPI_API)
      .then((res) => {
        return res.json();
      })
      .then((apiData) => {
        fetch(
          `${WEATHER_MAP_API}weather?lat=${apiData.latitude}&lon=${apiData.longitude}&appid=${API_KEY}&units=imperial`
        )
          .then((res) => {
            return res.json();
          })
          .then((currentWeather) =>
            this.setState({
              city: currentWeather.name,
              currentWeather,
            })
          );
      });
  };

  /**
   * returns currentWeather based on user input
   * https://openweathermap.org/current
   * @param {string} city
   */
  getCurrentWeather = (city) => {
    fetch(
      `${WEATHER_MAP_API}weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=imperial`
    )
      .then((res) => {
        return res.json();
      })
      .then((currentWeather) =>
        this.setState({
          city: currentWeather.name,
          currentWeather,
          fiveDayForecast: new Array(5),
        })
      );
  };

  /**
   * API request ::: returns 5 day weatherData
   * https://openweathermap.org/forecast5
   */
  getFiveDayForecast = async () => {
    const response = await fetch(
      `${WEATHER_MAP_API}forecast?q=${encodeURIComponent(
        this.state.city
      )}&appid=${API_KEY}&units=imperial`
    );
    const weatherData = await response.json();
    // TODO: handle api 404 error
    if (weatherData.cod === "200") {
      this.updateWeather(weatherData);
    }
  };

  /**
   * returns an array.len=5 of indices for five-day forecast
   * eg: dt_txt = "2020-08-04 18:00:00" :::
   * console.log(dailyIndices) > 0:0  1:6  2:14  3:22  4:30
   * @param {object} data
   */
  selectDailyIndices = (data) => {
    let dailyIndices = [];
    dailyIndices.push(0);
    let index = 0;
    let tmp = data.list[index].dt_txt.slice(8, 10);
    for (let i = 0; i < 4; i++) {
      while (
        tmp === data.list[index].dt_txt.slice(8, 10) ||
        data.list[index].dt_txt.slice(11, 13) !== "15"
      ) {
        index++;
      }
      dailyIndices.push(index);
      tmp = data.list[index].dt_txt.slice(8, 10);
    }
    return dailyIndices;
  };

  /**
   * returns an arr.len=5 of objs with data from dailyIndicies
   * @param {object} data
   */
  updateWeather = (data) => {
    const days = [];
    const dailyIndices = this.selectDailyIndices(data);
    for (let i = 0; i < 5; i++) {
      days.push({
        description: data.list[dailyIndices[i]].weather[0].description,
        icon: data.list[dailyIndices[i]].weather[0].icon,
        temp: data.list[dailyIndices[i]].main.temp,
        date: data.list[dailyIndices[i]].dt_txt,
      });
    }
    this.setState({
      city: data.city.name,
      fiveDayForecast: days,
    });
  };

  handleUnitsChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  // TODO: tie into routing
  getShareableUrl = () => {
    this.setState({
      shareableUrl: `${window.location}?search=${this.state.city}`,
    });
  };

  render() {
    const { city, celcius, fiveDayForecast } = this.state;

    const DailyPanels = () => {
      const dailyPanels = fiveDayForecast.map((day) => (
        <li key={day.date}>
          <DailyPanel {...day} celcius={celcius} />
        </li>
      ));
      return <ul className="panel-list">{dailyPanels}</ul>;
    };

    return (
      <main>
        <Search getCurrentWeather={this.getCurrentWeather} />

        <Forecast
          city={city}
          celcius={celcius}
          currentWeather={this.state.currentWeather}
        />

        <button
          className="five-day"
          type="submit"
          onClick={() => this.getFiveDayForecast()}
        >
          5 Day Forecast
        </button>

        <DailyPanels />

        <div className="page-options">
          <label className="switch">
            <span className="visible-label">Celcius</span>
            <input
              id="celcius"
              type="checkbox"
              name="celcius"
              checked={celcius}
              onChange={this.handleUnitsChange}
            />
            <span className="slider round"></span>
          </label>

          <button onClick={this.getShareableUrl}>Share</button>
        </div>
        {this.state.shareableUrl && (
          <input
            readOnly
            className="shareable-url"
            value={this.state.shareableUrl}
          />
        )}
      </main>
    );
  }
}
