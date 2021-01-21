import React from "react";

export default class Search extends React.Component {
  state = {
    search: "",
  };

  keyHandler = (event) => {
    // TODO: regex check for proper value
    if (event.keyCode === 13) {
      this.props.getCurrentWeather(this.state.search);
      this.setState({
        search: "",
      });
    }
  };

  render() {
    return (
      <input
        className="city-search"
        value={this.state.search}
        type="text"
        placeholder="Enter a city"
        onChange={(e) => this.setState({ search: e.target.value })}
        onKeyDown={this.keyHandler}
      />
    );
  }
}
