import { auth } from "./firebase-config";
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

    const logout = async () =>{
        auth.signOut();
    }

    let navigate = useNavigate();

    const navToApprovalsDate=  () =>{
        navigate('/approvaldate');
    }
    return (
        <div>
            <h2>Home Page</h2>
            <h1></h1>
            <h1></h1>
            <h2 onClick={navToApprovalsDate}>Approvals</h2>
            <h4></h4>
            <h2>Redeem Request</h2>
            <h4></h4>
            <h2>Manage Campaings</h2>
            <h4></h4>
            <h2>Manage Career</h2>
            <button onClick={logout} >Signout</button>
        </div>
    )
}

export default Home;