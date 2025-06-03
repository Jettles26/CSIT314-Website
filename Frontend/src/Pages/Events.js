import React, { useState, useEffect } from "react";
import Event from "../Components/Event";
import "./Events.css";
import axios from "axios";

// const eventList = [
//     {
//     ID: 1,
//     name: "Mueseum",
//     genre: "tour",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//     price: 50,
//   },
//   {
//     ID: 2,
//     name: "WIN Stadium Woman's Soccer",
//     genre: "sports",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     imageUrl: "https://gothunderbirds.ca/images/2023/11/9/RK9_2535.jpg?width=1080&height=608&mode=crop&format=jpg&quality=80",
//     price: 86,
//   },
//   {
//     ID: 3,
//     name: "Mueseum",
//     genre: "tour",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//     price: 50,
//   },
//   {
//     ID: 4,
//     name: "Aquarium of the Bizarre", 
//     genre: "tour",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     imageUrl: "https://www.visitsealife.com/sydney/media/f4webh41/hero-image.png",
//     price: 67,
//   },
// ];



function Events() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [eventList, setEventList] = useState([]);

  // Extract unique genres for filter buttons
  const genres = ["All", ...new Set(eventList.map((event) => event.Availability))];

  const filteredEvents =
    selectedGenre === "All"
      ? eventList
      : eventList.filter((event) => event.Availability === selectedGenre);

    useEffect(() => {
      axios.get("http://127.0.0.1:8000/all_Events")
      .then(response => {
        setEventList(response.data.events);  
      })
      .catch(error => {
        console.log("Error fetching event data:", error);
      })
    }, []);
  

  return (
    <div>
      <h2 className="Subtitle">Upcoming Events</h2>

      {/* Genre Filter Buttons */}
      <div className="genre-filter">
        {genres.map((genre) => (
          <span
            key={genre}
            className={`genre-button ${
              selectedGenre === genre ? "active" : ""
            }`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Event List */}
      <div className="eventList">
        {filteredEvents.map((eventItem) => (
          <Event key={eventItem.ID} event={eventItem} />
        ))}
      </div>
    </div>
  );
}

export default Events;