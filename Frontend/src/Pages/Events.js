import React, { useEffect, useState } from "react";
import Event from "../Components/Event"; // make sure the path is correct
import "./Events.css";
import axios from "axios";

// const eventList = [
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "WIN Stadium Woman's Soccer",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://gothunderbirds.ca/images/2023/11/9/RK9_2535.jpg?width=1080&height=608&mode=crop&format=jpg&quality=80",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Mueseum",
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
//   },
//   {
//     name: "Aquarium of the Bizarre", 
//     date: "2025-06-05",
//     timeStart: "2:00 PM",
//     timeEnd: "4:00 PM",
//     url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
//     imageUrl: "https://www.visitsealife.com/sydney/media/f4webh41/hero-image.png",
//   },
// ];



function Events() {//30 Character Limit for title
  const [eventList, setEventList] = useState([]);
  const [filteredEventList, setFilteredEventList] = useState([]);
  const [filtered, setFiltered] = useState(false);

  const filterByCategory = (category) => {
    const filtered = eventList.filter(event => event.Name === category);
    setFilteredEventList(filtered);
    setFiltered(true);
  };
  

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/all_Events")
    .then(response => {
      console.log("Full response:", response); // Add this
      console.log("response.data:", response.data.events); // Add this
      setEventList(response.data.events);  
    })
    .catch(error => {
      console.log("Error fetching event data:", error);
    })
  }, []);

  return (
    <div>
      {filtered === false &&
        <><h2 className="Subtitle">Upcoming Events</h2>
        <button onClick={() => setFilteredEventList(eventList)}>Show All</button>
        <button onClick={() => filterByCategory("Sport")}>Show Sport Events</button><div className="eventList">
          {eventList.map((eventItem, index) => (
            <Event key={index} event={eventItem} />
          ))}
        </div></>
      }

      {filtered === true &&
        <><h2 className="Subtitle">Upcoming Events (Filtered)</h2>
        <button onClick={() => {setFilteredEventList(eventList); setFiltered(false)}}>Show All</button>
        <button onClick={() => filterByCategory("Sport")}>Show Sport Events</button><div className="eventList">
          {filteredEventList.map((eventItem, index) => (
            <Event key={index} event={eventItem} />
          ))}
        </div></>
      }
      
    </div>
  );
}

export default Events;