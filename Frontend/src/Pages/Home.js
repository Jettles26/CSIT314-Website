import React,  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./Events.css";
import UserEvent from "../Components/UserEvent";
import axios from "axios";

// const userEvents = [
//     {
//     ID: 1,
//     name: "Mueseum",
//     genre: "Tour",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//     price: 50,
//     vip: true,
//   },
//   {
//     ID: 2,
//     name: "WIN Stadium Woman's Soccer",
//     genre: "Sport",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     imageUrl: "https://gothunderbirds.ca/images/2023/11/9/RK9_2535.jpg?width=1080&height=608&mode=crop&format=jpg&quality=80",
//     price: 86,
//     vip: false,
//   },
//   {
//     ID: 3,
//     name: "VIVID",
//     genre: "Festival",
//     date: "2025-29-09",
//     timeStart: "8:00 PM",
//     timeEnd: "11:00 PM",
//     imageUrl: "https://s1.at.atcdn.net/wp-content/uploads/2023/12/HEROSydneyVivid.jpg",
//     price: 20,
//     vip: true,
//   },
//   {
//     ID: 4,
//     name: "Aquarium of the Bizarre", 
//     genre: "Tour",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     imageUrl: "https://www.visitsealife.com/sydney/media/f4webh41/hero-image.png",
//     price: 67,
//     vip: false,
//   },
//   {
//     ID: 5,
//     name: "Easter Carnival", 
//     genre: "Festival",
//     date: "2025-04-05",
//     timeStart: "10:00 AM",
//     timeEnd: "6:00 PM",
//     imageUrl: "https://assets.atdw-online.com.au/images/fe9c37dec21b1e410c5c4b8631122a51.jpeg?rect=314%2C0%2C5035%2C3776&w=2048&h=1536&rot=360&q=eyJ0eXBlIjoibGlzdGluZyIsImxpc3RpbmdJZCI6IjYyYjI4OWQ3YzhlNjA5ZWM2MDBjYTUzMyIsImRpc3RyaWJ1dG9ySWQiOiI1NmIxZWI5MzQ0ZmVjYTNkZjJlMzIwYzgiLCJhcGlrZXlJZCI6IjU2YjFlZTU5MGNmMjEzYWQyMGRjNTgxOSJ9",
//     price: 32,
//     vip: true,
//   },
//   {
//     ID: 6,
//     name: "Tech Conference 2025", 
//     genre: "Conference",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     imageUrl: "https://businessevents.australia.com/content/businessevents/en/plan-your-event/association-events/_jcr_content/hero/mobile.adapt.768.high.jpg",
//     price: 70,
//     vip: false,
//   },
// ];



function Home() {
  const [userEvents, setUserEvents] = useState([]);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/customer_My_purchases",{
      withCredentials: true
    })
    .then(response => {
      console.log(response.data.my_purchases);
      setUserEvents(response.data.my_purchases);  
    })
    .catch(error => {
      console.log("Error fetching event data:", error);
    })
  }, []);

  return (

    <div>
      <h2 className="Subtitle">Purchased Events</h2>

      <div className="eventList">
        {userEvents.map((eventItem) => (
          <UserEvent event={eventItem}/>
        ))}
      </div>
    </div>
    
  );
}

export default Home;