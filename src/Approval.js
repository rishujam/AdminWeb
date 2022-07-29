import React, { useState } from 'react';
import "./style.css";
import { 
  updateSubmissionStatus, 
  updateWallet, 
  updatePendingWallet,
  getNotifyToken,
  send
} from "./FirestoreFun"
import { Link, useParams, useLocation } from 'react-router-dom';

function Approval() {

  const loc = useLocation();
  const date = loc.state.date;
  const campName = loc.state.name;
  const approvalData = loc.state.passData;
  const token = undefined;
  let selectedItems=[];

  const approveSelected =() =>{
    
  }

  const rejectSelected=() =>{

  }

  const downloadCSV=() =>{

  }

  const deleteProvious=() =>{

  } 

  const searchApprovalByUser=(user)=>{

  }

  const selectAll=()=>{
    
  }

  const campSubmit = {
        campId:"25",
        campRewardName:"Instaclean,10",
        dateTime:"27/04/22, 05:05:10",
        formData: ["name,Sudhanshu", "class,10"],
        status: "Approved",
        subCount: "1",
        user: "rishuparashar7@gmail.com"
};

  return (
    <div className="container">
      <div className="div1">
       <div className="top-left">
        <h1 className="heading">Approvals</h1>
        <span>{campName}</span>
         <div className="search-div">
          <input type = "text" placeholder = "search by email-id"/>
          <button className="select-btn">Select all</button>
         </div>
       </div>
       <div className="top-right">
         <button className="btn" onClick={send}>Download CSV</button>
         <button className="btn">Rejected Selected</button>
         <button className="btn" onClick={updateSubmissionStatus(campSubmit)}>Aprrove selected</button>
         <button className="delete-btn">Delete previous</button>
       </div>
      </div>
      <div className="div2">
        <nav>
        <ul>
          {
            approvalData.map((value,key) =>{
              return (
                <div key={key} style={{marginBottom:"20px"}}>
                  <li>{value.user}</li>
                  <li>{value.dateTime}</li>
                  <li>View Screenshot</li>
                </div>
              )
            })
          }
        </ul>
        </nav>
      </div>
    </div>
  )
}

export default Approval