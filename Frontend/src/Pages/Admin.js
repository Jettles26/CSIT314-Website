import React, { useState, useEffect } from "react";
import EventAdmin from "../Components/EventAdmin";
import "./Admin.css";
import axios from "axios";

function Admin(){

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

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        date: "",
        time: "",
        location: "",
        description: "",
        vip: ""
    });
    

    const togglePopup = () => setIsOpen(!isOpen);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        const parsedData = {
            ...formData,
            quantity: parseInt(formData.quantity, 10),
            vip: parseInt(formData.vip, 10),
        };
        console.log(parsedData);

        e.preventDefault();
        try {
          await axios.post("http://127.0.0.1:8000/admin_AddEvent", parsedData, {
            withCredentials: true,
          });
          alert("Event added successfully!");
          window.location.reload();
          togglePopup();
        } catch (error) {
          console.error("Submission error:", error);
          alert("Something went wrong.");
        }
      };
  
    const handleDelete = async (EventID) => {
        try {
            await axios.post(`http://127.0.0.1:8000/admin_DeleteEvent`,
                 {
                    "event_id": EventID,
                 },
                {
                withCredentials: true, // ensure session_token is sent
                });
            alert("Event deleted successfully and refunds are now processing.");
            window.location.reload();
          } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event.");
          }
    };

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
    
      <button class="genre-button" onClick={togglePopup}>ADD EVENT</button>

      {/* Event List */}
      <div className="eventList">
        
        {filteredEvents.map((eventItem) => (
            <div>
                <div id="DeleteAlign">
                    <button class="DeleteButton" onClick={() => handleDelete(eventItem.EventID)}>DELETE</button>
                </div>
                
                <EventAdmin key={eventItem.ID} event={eventItem} />
            </div>
          
        ))}
      </div>

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <form onSubmit={handleSubmit}>
              <h3>Enter Item Details</h3>

              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>

              <label>
                Quantity:
                <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} required />
              </label>

              <label>
                Date:
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </label>

              <label>
                Time:
                <input type="text" name="time" value={formData.time} onChange={handleChange} required />
              </label>

              <label>
                Location:
                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
              </label>

              <label>
                Description:
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </label>

              <label>
                Vip (0 for NO, 1 for YES):
                <input type="text" name="vip" value={formData.vip} onChange={handleChange} required />
              </label>

              <div className="button-group">
                <button type="submit">Submit</button>
                <button type="button" onClick={togglePopup}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

    
  );
}

export default Admin;