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
  let approvalPending = [];
  let approvalDone = [];
  let approvalPrevious = [];
  let dataToShow = [];
  const [ selectedItems, setSelectedItems ] = useState([]);

  approvalData.forEach(approval => {
    if (approval[ "status" ] === "Pending") {
      approvalPending.push(approval);
    } else if (approval[ "status" ] === "Approved" || approval[ "status" ] === "Rejected") {
      approvalDone.push(approval);
    } else if (approval[ "status" ] === "Deleted,Approved" || approval[ "status" ] === "Deleted,Rejected") {
      approvalPrevious.push(approval);
    }
  });

  approvalPending.forEach(element => {
    dataToShow.push(element)
  });
  approvalDone.forEach(element =>{
    dataToShow.push(element)
  });

  const approveSelected = () => {
    selectedItems.forEach(element => {
      approveSubmit(element);
    });
    setSelectedItems([]);
  }

  const rejectSelected = () => {
    selectedItems.forEach(element => {
      rejectSubmit(element);
    });
    setSelectedItems([]);
  }

  const downloadCSV = () => {

  }

  const deletePrevious = () => {
    approvalPrevious.forEach(element => {
      deletePrevious(element);
    });
    
  }

  const searchApprovalByUser = (user) => {
    approvalPending.forEach(element => {
      if(element["user"]===user){
        dataToShow.push(element);
      }
    });
  }

  const cbClick = (itemValue) => {
    if (!selectedItems.includes(itemValue)) {
      ;
      setSelectedItems([ ...selectedItems, itemValue ]);
    } else {
      let newData1 = selectedItems.filter((item) => {
        return item !== itemValue
      });
      setSelectedItems(newData1);
    }
  }

  const removeFromSelectedItems = (itemValue)=>{
    console.log("clicked")
    if(selectedItems.includes(itemValue)){
      let newData2 = selectedItems.filter((item) => {
        return item !== itemValue
      });
      setSelectedItems(newData2);
    }
  }

  const campSubmit = {
    campId: "25",
    campRewardName: "Instaclean,10",
    dateTime: "27/04/22, 05:05:10",
    formData: [ "name,Sudhanshu", "class,10" ],
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
            <input type="text" placeholder="search by email-id" />
            <button onClick={searchApprovalByUser}>Search</button>
            <img src={require('./undo.png')} style={{width:"25px", height:"20px", marginLeft:"12px"}} />
          </div>
        </div>
        <div className="top-right">
          <button className="btn" >Download CSV</button>
          <button className="btn">Rejected Selected</button>
          <button className="btn">Aprrove selected</button>
          <button className="delete-btn">Delete previous</button>
        </div>
      </div>
      <div style={{display : 'flex' , justifyContent : 'space-between'}}>
        <div className="div2">
          <nav>
            <h1 style={{ color: 'white' }}>Records</h1>
            <ul>
              {
                dataToShow.map((value, key) => {
                  return (
                    <div key={key} style={{ marginBottom: "20px", color: 'white', display: 'flex' }}>
                      <ul style={{ width: "80%" }}>
                        <li>{value.user}</li>
                        <li>{value.dateTime}</li>
                        <li>View Screenshot</li>
                      </ul>
                      <ul>
                        <li>
                          <input type="checkbox" onClick={() => {
                            cbClick(value)
                          }}></input>
                        </li>
                      </ul>
                    </div>
                  )
                })
              }
            </ul>
          </nav>
        </div>
        <div className="div3">
          {
            selectedItems.length > 0 ?
              (
                <nav>
                  <h1 style={{ color: "white" }}>Selected People</h1>
                  <ul>
                    {
                      selectedItems.map((value, key) => {
                        return (
                          <div key={key} style={{ marginBottom: "20px", color: "white", display:"flex"}}>
                            <ul style={{ width: "80%" }}>
                              <li>{value.user}</li>
                              <li>{value.dateTime}</li>
                            </ul>
                            <ul>
                              <li onClick={removeFromSelectedItems(value)}><img src={require('./delete.png')} style={{width:"30px", height:"30px"}}/></li>
                            </ul>
                          </div>
                        )
                      })
                    }
                  </ul>
                </nav>
              ) : <></>
          }
        </div>
      </div>
    </div>
  )
}

// Waiting for first function to finish, 
//Set data dynamically to views, 
//view checkbox only if status is pending,
//
// refresh data once rejected or approved,

export default Approval