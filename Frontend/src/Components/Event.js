import React from "react";
import { useState } from "react";
import "../Pages/Events.css";
import "./Checkbox";
import Checkbox from "./Checkbox";
import "./Button";
import Button from "./Button";

function Event({event}) {

  const [money, setMoney] = useState(25);
  const pricePerVIP = 15;

  const handleCheckboxToggle = (checked) => {
    setMoney((prevMoney) => prevMoney + (checked ? pricePerVIP : -pricePerVIP));
  };
  


  return (
    <div className="event">
      <img src={"https://www.visitsealife.com/sydney/media/f4webh41/hero-image.png"} alt={event.Name} className={"img"}/>
        <div>
          <h3>{event.Name}</h3>
          <div className="DateTime">
            <p>{event.Date}</p>
            <p>{event.Location}</p>
          </div>
        </div>
        <div className="DateTime">
          <Checkbox onToggle={handleCheckboxToggle}></Checkbox>
          <p>Price: ${money}</p>
          <Button></Button>
        </div>
    </div>
  );
}

export default Event;