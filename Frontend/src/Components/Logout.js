import axios from "axios";
import "./Logout.css";

function Logout() {
    const handleLogout = async () => {
        try{
            const res = await axios.post("http://127.0.0.1:8000/all_Logout", {}, {
                withCredentials: true
            });
            alert("Logout success");
            window.location.reload();
          } catch(err) {
            alert("Please login");
          }
    }
    
    return(
        <div>
             <button className="logout-button" onClick={() => handleLogout()}>Logout</button>
        </div>
       
    )
}
export default Logout;