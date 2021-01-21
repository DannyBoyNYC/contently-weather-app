import React from "react";
import { toCel } from "../utils/tools";

export default class Forecast extends React.Component {
  render() {
    const { celcius, currentWeather } = this.props;

    return (
      <div className="current">
        <h1>{currentWeather.name} Weather</h1>
        {currentWeather.weather && (
          <div className="current-weather">
            <div>
              <img
                src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                alt="weather icon"
              />
            </div>
            <div>
              <div className="temp">
                <h3>Currrently</h3>
                {celcius
                  ? `${Math.round(toCel(currentWeather.main.temp))}°C`
                  : `${Math.round(currentWeather.main.temp)}°F`}
              </div>
              <p>{currentWeather.weather[0].description}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}
