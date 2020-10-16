import React from "react";
import VideoListItem from "../components/video-list-item";

const VideoList = (props) => {
 const { movieList } = props;

  return (
    <ul>
      {movieList.map((val) => {
        return (
          <VideoListItem key={val.id} movie={val} callback={receiveCallback} />
        );
      })}
    </ul>
  );
  function receiveCallback(movie) {
    props.callback(movie);
  }
};

export default VideoList;
