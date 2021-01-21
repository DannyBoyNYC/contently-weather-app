import React from "react";
import { getDay, toCel } from "../utils/tools";

export default class DailyPanel extends React.Component {
  render() {
    const { date, icon, temp, celcius, weather_desc } = this.props;
    return (
      <div className="panel">
        <h3>{date && getDay(date)}</h3>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={weather_desc}
        />
        <p className="temp">
          {celcius ? `${Math.round(toCel(temp))}°C` : `${Math.round(temp)}°F`}
        </p>
      </div>
    );
  }
}
