import React from "react";
import { useState } from "react";
import "../Pages/Events.css";
import "./Checkbox";
import Checkbox from "./Checkbox";
import "./Button";
import Button from "./Button";
import axios from "axios";
import Alert from "../Components/Alert";

function Event({event}) {
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [money, setMoney] = useState(25);
  const pricePerVIP = 15;

  const handleCheckboxToggle = (checked) => {
    setMoney((prevMoney) => prevMoney + (checked ? pricePerVIP : -pricePerVIP));
  };

  const purchase = async (eventId) => {
    try{
      const res = await axios.post("http://127.0.0.1:8000/customer_Purchase", {
        "event_id":parseInt(eventId)
      },
      {
        withCredentials: true
      });
      setAlertMsg(`Successfully purchased ticket!`);
      setShowAlert(true);
    } catch(err) {
      alert("Failed");
      console.log("Failed", err);
    }
     
  }
  
 


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
          {
            event.Availability === "Available" ? (
            <button onClick={() => purchase(event.EventID)}>Purchase</button>
            ) : (
              "SOLD OUT"
            )
          }
          
        
        </div>

        {showAlert && (
          <Alert
            message={alertMsg}
            duration={3000}
            onClose={() => setShowAlert(false)}
          />
        )}
    </div>
  );
}

export default Event;