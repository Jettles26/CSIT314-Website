import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // optional: for styling
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userType, setUserType] = useState("");
  const [choice, setChoice] = useState("");
  const [loginSignup, setLoginSignup] = useState(true);
  const [showTypeButtonDiv, setShowTypeButtonDiv] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const handleRedirect = (userType) => {
    if(userType === "User"){
      navigate("/Events");
    } else {
      navigate("/admin");
    }
    
  }
  

  const handleUsername = (value) => {
    setUsername(value.target.value);
  }
  const handlePassword = (value) => {
    setPassword(value.target.value);
  }
  const handleEmail = (value) => {
    setEmail(value.target.value);
  }
  // API CALL FUNCTION
  const handleSubmit = async () => {
    if(userType === "User"){
      console.log(username, email, password)
      try{
        const res = await axios.post("http://127.0.0.1:8000/registerCustomer", {
          "name": username,
          "email": email,
          "password": password
        });
        alert("Customer register success");
        window.location.reload();
      } catch(err) {
        alert("Failed to register")
      }
    } else {
      try{
        const res = await axios.post("http://127.0.0.1:8000/registerAdmin", {
          "name":username,
          "email": email,
          "password":password
        });
        alert("Admin register success");
        window.location.reload();
      } catch(err) {
        alert("Failed to register")
      }
    }
    
    setUsername("");
    setEmail("");
    setPassword("");
  }

  const handleLogin = async () => {
    if(userType === "User"){
      try{
        const res = await axios.post("http://127.0.0.1:8000/loginCustomer", {
          "email": email,
          "password":password
        }, {
          withCredentials: true
        });
        alert("Customer login success");
        handleRedirect(userType);
      } catch(err) {
        alert("Incorrect Email or Password")
      }
    } else {
      try{
        const res = await axios.post("http://127.0.0.1:8000/loginAdmin", {
          "email": email,
          "password":password
        }, {
          withCredentials: true
        });
        alert("Admin Login success")
        handleRedirect(userType);
      } catch(err) {
        alert("Incorrect Email or Password")
      }
    }
    
    setUsername("");
    setEmail("");
    setPassword("");
  }
  


  return (
      <div>
        {loginSignup === true &&
          <div class="user-type">
          <button class="button-login" onClick={() => {setShowTypeButtonDiv(true); setLoginSignup(false); setChoice("Login")}}>Login</button>
          OR
          <button class="button-login" onClick={() => {setShowTypeButtonDiv(true); setLoginSignup(false); setChoice("Signup")}}>Sign up</button>
          </div>
        }

        {showTypeButtonDiv === true &&
          <div class="login-main-div">
            <div id="lr">
              <button class="button-login" onClick={() => {setUserType("User"); setShowTypeButtonDiv(false)}}>User</button>
              OR
              <button class="button-login" onClick={() => {setUserType("Organiser"); setShowTypeButtonDiv(false)}}>Organiser</button>
            </div>
            <div>
              <button class="button-login" onClick={() => {setShowTypeButtonDiv(false); setLoginSignup(true); setChoice("")}}>Back</button>
            </div>

          </div>
          
        }
        

        {choice === "Login" && userType !== "" &&(
          <div class="login-main-div">
          <h1>{userType} {choice}</h1>

          <input class="input-details" type="text" placeholder="Email address" value={email} onChange={handleEmail}></input>
          <input class="input-details" type="text" placeholder="Password" value={password} onChange={handlePassword}></input>

          <button class="button-login" onClick={handleLogin}>Submit</button> {/*API LOGIN REQUEST*/}
          <button class="button-login" onClick={() => {setShowTypeButtonDiv(true); setUserType("")}}>Back</button>
          
          </div>
        )}

        {choice === "Signup" && userType !== "" &&(
          <div class="login-main-div">
          <h1>{userType} {choice}</h1>

          <input class="input-details" type="text" placeholder="Username" value={username} onChange={handleUsername}></input>
          <input class="input-details" type="text" placeholder="Email address" value={email} onChange={handleEmail}></input>
          <input class="input-details" type="text" placeholder="Password" value={password} onChange={handlePassword}></input>

          <button class="button-login" onClick={handleSubmit}>Submit</button>  {/*API REGISTER REQUEST*/}
          <button class="button-login" onClick={() => {setShowTypeButtonDiv(true); setUserType("")}}>Back</button>
          
          </div>
        )}
        
      </div>
  );
}

export default Login;