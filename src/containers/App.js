import React, { Component } from "react";

import SearchBar from "../components/search-bar";
import VideoList from "./video-list";
import Axios from "axios";
import VideoDetail from "../components/video-detail";
import Video from "../components/video";

const API_KEY = "ee52528a3d2bfff0312880daeaee21b3";
const API_END_POINT = "https://api.themoviedb.org/3/";
const DEFAULT_TYPE_SEARCH = "discover";
const DEFAULT_PARAM = "language=fr&include_adult=false";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { movies: {}, currentMovie: {} };
  }

  initMovies() {
    Axios.get(
      `${API_END_POINT}${DEFAULT_TYPE_SEARCH}/movie?api_key=${API_KEY}&sort_by=popularity.desc&${DEFAULT_PARAM}`
    ).then(
      function (response) {
        this.setState(
          {
            movies: response.data.results.slice(1, 6),
            currentMovie: response.data.results[0],
          },
          function () {
            this.applyToCurrentMovie();
          }
        );
      }.bind(this)
    );
  }
  applyToCurrentMovie() {
    Axios.get(
      `${API_END_POINT}movie/${this.state.currentMovie.id}?api_key=${API_KEY}&append_to_response=videos&include_adult=false`
    ).then(
      function (response) {
        if (
          response.data.videos.results[0] &&
          response.data.videos.results[0].key
        ) {
          const youtubeKey = response.data.videos.results[0].key;

          let newCurrentMovieState = this.state.currentMovie;
          newCurrentMovieState.videoId = youtubeKey;
          this.setState({ currentMovie: newCurrentMovieState });
        }
      }.bind(this)
    );
  }

  UNSAFE_componentWillMount() {
    this.initMovies();
  }
  onClickListItem(movie) {
    this.setState({ currentMovie: movie }, function () {
      this.applyToCurrentMovie();
      this.setRecommendation();
    });
  }
  setRecommendation() {
    const request = Axios.get(
      `${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?api_key=${API_KEY}&language=fr`
    ).then(
      function (response) {
        if (response.data && response.data.results.length > 5) {
          this.setState({ movies: response.data.results.slice(0, 5) });
        }
      }.bind(this)
    );
  }
  searchMovie(serachText) {
    //si on recoit pas du texte on fait rien
    if (serachText) {
      const request = Axios.get(
        `${API_END_POINT}search/movie?api_key=${API_KEY}&${DEFAULT_PARAM}&query=${serachText}`
      ).then(
        function (response) {
          //il ya  un résultat
          if (response.data && response.data.results[0]) {
            //le résultat est != du current
            if (response.data.results[0].id != this.state.currentMovie.id) {
              this.setState({ currentMovie: response.data.results[0] }, () => {
                this.applyToCurrentMovie();
                this.setRecommendation();
              });
            }

            //            this.setState()
          }
        }.bind(this)
      );
    }
  }
  render() {
    const renderMovieList = () => {
      if (this.state.movies.length > 0) {
        return (
          <VideoList
            movieList={this.state.movies}
            callback={this.onClickListItem.bind(this)}
          />
        );
      }
    };
    return (
      <div>
        <div className="search_bar">
          <SearchBar callback={this.searchMovie.bind(this)} />
        </div>
        <div className="row">
          <div className="col-md-8">
            <Video videoId={this.state.currentMovie.videoId} />
            <VideoDetail
              title={this.state.currentMovie.title}
              decription={this.state.currentMovie.overview}
            />
          </div>
          <div className="col-md-4">{renderMovieList()}</div>
        </div>
      </div>
    );
  }
}

export default App;
