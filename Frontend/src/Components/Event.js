import React from "react";
import { Link } from "react-router-dom";

function Event({event}) {
  return (
    <div className="event">
      <a href={event.url}>
      <img src={event.imageUrl} alt={event.name} style={{width:100, height:80}}/>
        <div>
          <h3>{event.name}</h3>
          <p>{event.date}</p>
          <p>{`${event.timeStart}  -  ${event.timeEnd}`}</p>
        </div>
      </a>
    </div>
  );
}

export default Event;