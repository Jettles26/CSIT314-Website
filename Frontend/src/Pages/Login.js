import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // optional: for styling

function Login() {
  const [userType, setUserType] = useState("");
  const [choice, setChoice] = useState("");
  const [LoginSignup, setLoginSignup] = useState(true);
  const [showTypeButtonDiv, setShowTypeButtonDiv] = useState(false);
  // API CALL FUNCTION
  


  return (
      <div>
        {LoginSignup === true &&
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

          <input class="input-details" type="text" placeholder="Username"></input>
          <input class="input-details" type="text" placeholder="Password"></input>

          <button class="button-login">Submit</button> {/*API LOGIN REQUEST*/}
          <button class="button-login" onClick={() => {setShowTypeButtonDiv(true); setUserType("")}}>Back</button>
          
          </div>
        )}

        {choice === "Signup" && userType !== "" &&(
          <div class="login-main-div">
          <h1>{userType} {choice}</h1>

          <input class="input-details" type="text" placeholder="Username"></input>
          <input class="input-details" type="text" placeholder="Password"></input>

          <button class="button-login">Submit</button>  {/*API REGISTER REQUEST*/}
          <button class="button-login" onClick={() => {setShowTypeButtonDiv(true); setUserType("")}}>Back</button>
          
          </div>
        )}
        
      </div>
  );
}

export default Login;