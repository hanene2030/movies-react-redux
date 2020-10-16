import React, { Component } from "react";

//class SearchBar extends React.Component{

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      placeHolder: "Tapez votre film...",
      lockRequestCall: false,
      intervalBeforeRequest: 1000,
    };
  }

  render() {
    return (
      <div className="row input-goup">
        <div className="col-md-8 ">
          <input
            className="form-control input-lg"
            onChange={this.handleChange.bind(this)}
            placeholder={this.state.placeHolder}
          />
        </div>
        <span className="input-goup-btn">
          <button
            className="btn btn-secondary"
            onClick={this.handleOnClick.bind(this)}
          >
            GO
          </button>
        </span>
      </div>
    );
  }

  handleOnClick(event) {
    this.search();
  }
  search() {
    this.props.callback(this.state.searchText);
    this.setState({ lockRequestCall: false });
  }
  handleChange(event) {
    this.setState({ searchText: event.target.value });
    if (!this.state.lockRequestCall) {
      this.setState({ lockRequestCall: true });
      setTimeout(
        function () {
          this.search();
        }.bind(this),
        this.state.intervalBeforeRequest
      );
    }
  }
}

export default SearchBar;
