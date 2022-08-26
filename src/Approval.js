import React, { Component, useEffect, useState } from 'react';
import "./style.css";
import {
  rejectSubmit,
  deletePrevious,
  approveSubmittedApproval,
  getUrl
} from "./FirestoreFun"
import { useNavigate, useLocation } from 'react-router-dom';
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


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
  const [dialogUrl, setDialogUrl] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [ selectAllState, setSelectAllState ] = useState(false);
  let dateToSubMap ={};

  approvalData.forEach(approval => {
    if (approval[ "status" ] === "Pending") {
      approvalPending.push(approval);
    } else if (approval[ "status" ] === "Approved" || approval[ "status" ] === "Rejected") {
      approvalDone.push(approval);
    }
  });

  approvalPending.forEach(element => {
    dataToShow.push(element)
    const key = `${element["dateTime"]}${element["user"]}`;
    dateToSubMap[key] = element;
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

  const headers = [
    {label:"User", key:"user"},
    {label:"Submissions count", key:"subCount"},
    {label: "Date and Time", key:"dateTime"},
    {label: "Update here", key:"status"}
  ];
  
  const csvReport = {
    filename: `${campName}.csv`,
    headers:headers,
    data:dataToShow
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
      if(!selectedItems.includes(itemValue)){
        setSelectedItems([ ...selectedItems, itemValue ]);
      }
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

  const dialogOpen =(user, campId, subCount)=> async() =>{
    console.log("dialogOpen");
    let url = await getUrl(user,campId,subCount);
    if(url!==""){
      setDialogState(!dialogState);
      setDialogUrl(url)
    }
  }

  const dialogClose = () =>{
    console.log("Dialog close");
    setDialogState(!dialogState);
  }

  const selectAll =(event) =>{
    if(event.target.checked){
      setSelectAllState(true);
      setSelectedItems(approvalPending);

    }else{
      setSelectAllState(false);
      setSelectedItems([]);
    }
  }

  const selectFile=(e)=>{
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        let toRejectTemp = [];
        let toApproveTemp = [];
        for(const sub of valuesArray){
          if(sub[3]==="Rejected") toRejectTemp.push(sub);
          if(sub[3]==="Approved") toApproveTemp.push(sub);
        }
        console.log(toApproveTemp);
        console.log(toRejectTemp)
        let toReject = [];
        let toApprove = [];
        let skipped = 0;
        for(const sub of toApproveTemp){
          const hash = `${sub[2]}${sub[0]}`
          if(dateToSubMap[hash]!==undefined){
            toApprove.push(dateToSubMap[hash]);
          }else{
            skipped++;
          }
        }
        for(const sub of toRejectTemp){
          const hash = `${sub[2]}${sub[0]}`
          if(dateToSubMap[hash]!==undefined){
            toReject.push(dateToSubMap[hash]);
          }else{
            skipped++;
          }
        }
        const options = {
          title: 'Confirmation',
          message: `Items Approving: ${toApprove.length},  Items Rejecting: ${toReject.length}, Items Skipping: ${skipped}`,
          buttons: [
            {
              label: 'Confirm',
              onClick: () => continueTask(toApprove, toReject)
            },
            {
              label: 'Cancel',
              onClick: () => console.log("Cancelled")
            }
          ],
          closeOnEscape: true,
          closeOnClickOutside: false,
          overlayClassName: "overlay-custom-class-name"
        };
        confirmAlert(options);
      },
    });
  }

  const continueTask=async(listToApprove, listToReject)=>{
    setLoading(1);
    await approveSubmittedApproval(listToApprove);
    await rejectSubmit(listToReject);
    setLoading(0);
    navigate("../approvaldate", {replace:true});
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
                  <input style = {{width:"300px"}}type="text" value={searched} onChange={(e) => {
                    setSearched(e.target.value)
                  }} placeholder="Search user" />
                  <label style={{marginLeft:"30px", fontWeight:"bold"}}> Select All <input type="checkbox" onChange={(event)=>{selectAll(event)}}/></label>
                </div>
              </div>
              <div className="top-right">
                <CSVLink {...csvReport}>Download CSV</CSVLink>
                <input onChange={selectFile} id="csvInput" name="file" type="File" accept=".csv"/>
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
                                <li style={{ fontWeight: "bold", color: "#EEEEEE" }} onClick = {dialogOpen(value.user,value.campId, value.subCount)}>View Screenshot</li>
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
                                  <li style={{ fontWeight: "bold", color: "#EEEEEE" }} onClick = {dialogOpen(value.user,value.campId, value.subCount)} >View Screenshot</li>
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
                                    {/* Delete Button */}
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
              dialogState === true ? (
                <div style ={dialogStyles}>
                  <button style ={dialogCloseButtonStyles} onClick = {dialogClose}>x</button>
                  <img  style= {{height:"600px"}} src={dialogUrl}/>
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

//Hide keys in env file 
//Host on Firebase

export default Approval