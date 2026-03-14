import React from "react";
import logo from '../Logo.png';
import Header from "../Components/Header";
import { Link } from "react-router-dom";

function HomePage() {
  



  return (
    <>
    <header>
         <div className="title">
              <img src={logo} alt="Logo"/>
                <h1>
                  APSIT S.A.F.E
                </h1>
                {/* <ul>
                  <li>Home</li>
                  <li>Login</li>
                  <li>Register</li>
                  <li>About Us</li>
                  <li>How It Works</li>
                </ul> */}
              </div>
    </header>

    <section>
      <div className="Info">
        <h2>Welcome to APSIT S.A.F.E</h2>
        <h2>Your safety is our priority. APSIT S.A.F.E is dedicated to providing a secure environment for all students and staff at APSIT. Our platform offers real-time safety alerts, emergency contacts, and safety resources to ensure everyone feels safe on campus.</h2>
      </div>
      <div className="Card">
        <div className="one">
        <h2>Admin Portal</h2>
        <button>
          Login
        </button>
        </div>
      <div className ="two">
        <h2>Student Portal</h2>
        <Link to="/Login">
        <button>
          Login
        </button>
        </Link>
        <button>
          Register
        </button>
      </div>
      </div>
    </section>


    </>
    );
}
export default HomePage;
