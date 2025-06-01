import React from "react";
import "../Pages/Events.css";

function Event({event}) {
  return (
    <div className="event">
      <a href={event.url}>
      <img src={event.imageUrl} alt={event.name} className={"img"}/>
        <div>
          <h3>{event.Name}</h3>
          <div className="DateTime">
            <p>{event.Date}</p>
            {/* <p>{`${event.timeStart}  -  ${event.timeEnd}`}</p> */}
          </div>
        </div>
      </a>
    </div>
  );
}

export default Event;