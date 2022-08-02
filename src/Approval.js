import React, { useState } from 'react';
import "./style.css";
import { 
  approveSubmit,
  rejectSubmit,
  deletePrevious
} from "./FirestoreFun"
import { Link, useParams, useLocation } from 'react-router-dom';

function Approval() {

  const loc = useLocation();
  const date = loc.state.date;
  const campName = loc.state.name;
  const approvalData = loc.state.passData;
  let approvalTodDo = [];
  let approvalDone = [];
  let approvalPrevious = [];
  const [selectedItems, setSelectedItems]=useState([]);

  approvalData.forEach(approval => {
    if(approval["status"]==="Pending"){
      approvalTodDo.push(approval);
    }
    if(approval["status"]==="Approved" || approval["status"]==="Rejected"){
      approvalDone.push(approval);
    }
  });



  const approveSelected =() =>{
    selectedItems.forEach(element => {
      
    });
  }

  const rejectSelected=() =>{
    selectedItems.forEach(element => {
      
    });
  }

  const downloadCSV=() =>{

  }

  const deletePrevious=() =>{

  } 

  const searchApprovalByUser=(user)=>{

  }

  const selectAll=()=>{
    
  }

  const cbClick=(event, itemClicked) =>{
    if(event.target.checked){
      // selectedItems.push(itemSelected);
      console.log("Clicked")
    }else{
      // const newList = selectedItems.filter((item) => item !== itemClicked);
      // setSelectedItems(newList);
      console.log("UnChecked")
    }
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
         <button className="btn" >Download CSV</button>
         <button className="btn">Rejected Selected</button>
         <button className="btn">Aprrove selected</button>
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
                  <cb><input type="checkbox" onChange={cbClick}></input></cb>
                </div>
              )
            })
          }
        </ul>
        </nav>
      </div>
      <div className = "div3">
      <nav> 
          <ul>
            {
              selectedItems.map((value,key) =>{
                return (
                  <div key = {key} style ={{marginBottom: "20px"}}>
                    <li>{value.user}</li>
                    <li>{value.dateTime}</li>
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

// To Ask: UI, SelectedItems wale function mai param kaise pass kare, Waiting for first function to finish

export default Approval