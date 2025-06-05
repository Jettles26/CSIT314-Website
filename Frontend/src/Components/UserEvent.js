import React from "react";
import "../Pages/Events.css";
import Checkbox from "./Checkbox";

function UserEvent({event}) {

  return (
    <div className="event">
      <img src={"https://www.visitsealife.com/sydney/media/f4webh41/hero-image.png"} alt={event.name} className={"img"}/>
        <div>
          <h3>{event.Name}</h3>
          <div className="DateTime">
            <p>{event.Date}</p>
            <p>{event.Location}</p>
          </div>
        </div>
        <div className="DateTime">
          <Checkbox checked={event.vip} disabled={true}></Checkbox>
        </div>

    </div>
  );
}

export default UserEvent;