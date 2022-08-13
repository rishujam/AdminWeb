import { auth } from "./firebase-config";
import React from "react";
import { useNavigate } from "react-router-dom";
require('dotenv').config()

function Home() {

    console.log(process.env.REACT_APP_API_KEY);

    const logout = async () =>{
        auth.signOut();
    }

    let navigate = useNavigate();

    const navToApprovalsDate=  () =>{
        navigate('/approvaldate');
    }
    return (
        <div>
            <header>
              <h1>Admin Taskox</h1>
            </header>
            <nav>
               <a onClick={navToApprovalsDate}>Manage Approvals</a>
               <a>Manage Campaign</a>
               <a>Redeem Requests</a>
               <a>Manage Career</a>
               <a onClick={logout}>Sign out</a>
            </nav>
        </div>
    )
}

export default Home;