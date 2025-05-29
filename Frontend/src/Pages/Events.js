import React from "react";
import Event from "../Components/Event"; // make sure the path is correct
import "./Events.css";

const eventList = [
  {
    name: "React Meetup",
    date: "2025-06-01",
    timeStart: "10:00 AM",
    timeEnd: "12:00 PM",
    url: "https://example.com/react-meetup",
    imageUrl: "https://example.com/react-meetup.jpg",
  },
  {
    name: "Vue Workshop",
    date: "2025-06-05",
    timeStart: "2:00 PM",
    timeEnd: "4:00 PM",
    url: "https://example.com/vue-workshop",
    imageUrl: "https://example.com/vue-workshop.jpg",
  },
  {
    name: "Mueseum",
    date: "2025-06-05",
    timeStart: "2:00 PM",
    timeEnd: "4:00 PM",
    url: "https://www.klook.com/en-AU/activity/129401-natural-history-museum-ticket-in-los-angeles/",
    imageUrl: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/kxckqbyccilrbh1g2ezg/NaturalHistoryMuseumTicketinLosAngeles-KlookAustralia.jpg",
  },
];



function Events() {
  return (
    <div>
      <h2>Upcoming Events</h2>
      <div className="eventList">
        {eventList.map((eventItem, index) => (
          <Event key={index} event={eventItem} />
        ))}
      </div>
    </div>
  );
}

export default Events;