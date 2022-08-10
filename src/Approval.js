import React, { Component, useState } from 'react';
import "./style.css";
import {
  rejectSubmit,
  deletePrevious,
  approveSubmittedApproval
} from "./FirestoreFun"
import { useNavigate, useLocation } from 'react-router-dom';

function Approval(){

  const dialogStyles ={
    width:"400px",
    maxWidth: "400px",
    margin:"0 auto",
    position: "fixed",
    left:"30%",
    top: "60px",
    transform: "translate(-50,-50)",
    zIndex: "999",
    backgroundColor:"#eee",
    pading: "10px 20px 40px",
    borderRadius: "8px",
    flexDirection :"column"
};

const dialogCloseButtonStyles = {
    marginBottom: "15px",
    padding: "3px 8px",
    cursor: "pointer",
    borderRadius: "50%",
    border: "none",
    width: "30px",
    height: "30px",
    fontWeight: "bold",
    alignSelf: "flex-end"
};

  const loc = useLocation();
  const date = loc.state.date;
  const campName = loc.state.name;
  const approvalData = loc.state.passData;
  let approvalPending = [];
  let approvalDone = [];
  let dataToShow = [];
  const [ searched, setSearched ] = useState("");
  const [ selectedItems, setSelectedItems ] = useState([]);
  const [ loading, setLoading] = useState(0);
  let navigate = useNavigate();
  const [dialogState, setDialogState] = useState(false);


  approvalData.forEach(approval => {
    if (approval[ "status" ] === "Pending") {
      approvalPending.push(approval);
    } else if (approval[ "status" ] === "Approved" || approval[ "status" ] === "Rejected") {
      approvalDone.push(approval);
    }
  });
  approvalPending.forEach(element => {
    dataToShow.push(element)
  });
  approvalDone.forEach(element => {
    dataToShow.push(element)
  });

  const approveSelected =async() => {
    setLoading(1);
    let items = selectedItems;
    await approveSubmittedApproval(items);
    setLoading(0)
    navigate("../approvaldate", {replace:true})
  }

  const rejectSelected = async() => {
    setLoading(1);
    let items = selectedItems;
    await rejectSubmit(items);
    setLoading(0);
    navigate("../approvaldate", {replace:true})
  }

  const downloadCSV = () => {
  }

  const deletePreviousApprovals = async() => {
    setLoading(1);
    let items = approvalDone;
    await deletePrevious(items);
    setLoading(0);
    navigate("../approvaldate", {replace:true})
  }

  const cbClick = (event, itemValue) => {
    if (event.target.checked) {
      setSelectedItems([ ...selectedItems, itemValue ]);
    } else {
      let newData1 = selectedItems.filter((item) => {
        return item !== itemValue
      });
      setSelectedItems(newData1);
    }
  }

  const showCb = (value) => {
    if (value[ "status" ] === "Pending") {
      return (
        <input type="checkbox" onChange={(event) => {
          cbClick(event, value)
        }}></input>
      )
    } else if (value[ "status" ] === "Approved") {
      return (
        <h5 style={{ paddingRight: "16px", fontWeight: "400" }}>Approved</h5>
      )
    } else if (value[ "status" ] === "Rejected") {
      return (
        <h5 style={{ paddingRight: "16px", fontWeight: "400" }}>Rejected</h5>
      )
    }
  }

  const removeFromSelectedItems = (itemValue) => {
    if (selectedItems.includes(itemValue)) {
      let newData2 = selectedItems.filter((item) => {
        return item !== itemValue
      });
      //setSelectedItems(newData2);
    }
  }

  const dialogOpen = () =>{
    setDialogState(true)
  }

  const dialogClose = () =>{
    setDialogState(false)
  }
  

  return (
    <>
      {
        loading === 0 ? (
          <div className="container">
            <div className="div1">
              <div className="top-left">
                <h1 className="heading">Approvals</h1>
                <span>{campName}</span>
                <div className="search-div">
                  <input type="text" value={searched} onChange={(e) => {
                    setSearched(e.target.value)
                  }} placeholder="search by email-id" />
                  <img src={require('./undo.png')} style={{ width: "25px", height: "20px", marginLeft: "12px" }} />
                </div>
              </div>
              <div className="top-right">
                <button className="btn" onClick={downloadCSV} >Download CSV</button>
                <button className="btn" onClick={rejectSelected}>Rejected Selected</button>
                <button className="btn" onClick={approveSelected}>Aprrove selected</button>
                <button className="delete-btn" onClick={deletePreviousApprovals}>Delete previous</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="div2">
                <nav>
                  <h1 style={{ color: 'white' }}>Records</h1>
                  <ul>
                    {
                      searched == "" ? (
                        dataToShow.map((value, key) => {
                          return (
                            <div key={key} style={{ marginBottom: "20px", color: 'white', display: 'flex' }}>
                              <ul style={{ width: "80%" }}>
                                <li>{value.user}</li>
                                <li>{value.dateTime}</li>
                                <li style={{ fontWeight: "bold", color: "#EEEEEE" }} onClick = {dialogOpen}>View Screenshot</li>
                              </ul>
                              <ul>
                                {showCb(value)}
                              </ul>
                            </div>
                          )
                        })
                      ) : (
                        dataToShow.map((value, key) => {
                          if (value.user.includes(searched)) {
                            return (
                              <div key={key} style={{ marginBottom: "20px", color: 'white', display: 'flex' }}>
                                <ul style={{ width: "80%" }}>
                                  <li>{value.user}</li>
                                  <li>{value.dateTime}</li>
                                  <li style={{ fontWeight: "bold", color: "#EEEEEE" }} onClick = {dialogOpen} >View Screenshot</li>
                                </ul>
                                <ul>
                                  {showCb(value)}
                                </ul>
                              </div>
                            )
                          }
                        })
                      )
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
                                <div key={key} style={{ marginBottom: "20px", color: "white", display: "flex" }}>
                                  <ul style={{ width: "80%" }}>
                                    <li>{value.user}</li>
                                    <li>{value.dateTime}</li>
                                  </ul>
                                  <ul>
                                    <li onClick={removeFromSelectedItems(value)}><img src={require('./delete.png')} style={{ width: "30px", height: "30px" }} /></li>
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
            <div>
            {
              dialogState ? (
                <div style ={dialogStyles}>
                  <button style ={dialogCloseButtonStyles} onClick = {dialogClose}>x</button>
                  <img  style= {{height:"600px"}} src="https://firebasestorage.googleapis.com/v0/b/taskox-c1d7e.appspot.com/o/proofCampPromo%2Fajaybhatti127040%40gmail.com%2C21%2C1?alt=media&token=1769de4e-01fa-4153-add8-4a3750beaca2"/>
                </div>
              ):<></>
            }
            </div>
          </div>
          
          
        ) : (
          <div style={{display:"flex" , alignItems:"center" , justifyContent : "center"}}>
          <div className="loadingio-spinner-spinner-d5vda8qm7j5"><div className="ldio-9u8gbddmqad">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
          </div>
          <div>
            <h1>Loading...</h1>
          </div>
          </div>
        )
      }
    </>
  )
}

//Delete button in selectedItems
//View Screenshot
//Hide keys in env file 
//Host on Firebase

export default Approval