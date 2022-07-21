import React, { useState } from 'react';
import "./style.css";
import {db} from "./firebase-config"
import {collection, doc, setDoc, getDocs, query, getDoc} from "firebase/firestore";

function Approval() {

  // const ref  = doc(db, "data", "one");

  // const getData = async() =>{
  //   const docu = await getDoc(ref);
  //   if(docu.data()["25"]["campId"]===undefined){
  //     console.log("true");
  //   }else{
  //     console.log("false")
  //   }
  // }

  const date = "27/04/22";
  const campName = "Instaclean";

  const[approvals, setApprovals] = useState([]);

  const getApprovalData = async () =>{
    const querySnapShot = await getDocs(collection(db, "data"));
    querySnapShot.forEach((doc) =>{
      Object.keys(doc.data()).forEach((key) =>{
        if(doc.data()[key]["campId"]!==undefined && doc.data()[key]["dateTime"].toString().split(",")[0]===date && doc.data()[key]["campRewardName"].toString().split(",")[0]===campName){
          //Add this doc object to list
        }
      })
    })
  }

  return (
    <div className="container">
      <div className="div1">
       <div className="top-left">
        <h1 className="heading">Approvals</h1>
        <span>Axis $20</span>
         <div className="search-div">
          <input type = "text" placeholder = "search by email-id"/>
          <button className="select-btn" onClick={getApprovalData}>Select all</button>
         </div>
       </div>
       <div className="top-right">
         <button className="btn">Download CSV</button>
         <button className="btn">Rejected Selected</button>
         <button className="btn">Aprrove selected</button>
         <button className="delete-btn">Delete previous</button>
       </div>
      </div>
      <div className="div2">
       <div className = "information-div">
         <span>rishuparashar7@gmail.com</span>
         <span>11/07/2022  19:29:11</span>
         <button>view screenshot</button>
       </div>
       <div className = "information-div">
        <span>rishuparashar7@gmail.com</span>
        <span>11/07/2022  19:29:11</span>
        <button>view screenshot</button>
      </div>
      <div className = "information-div">
        <span>rishuparashar7@gmail.com</span>
        <span>11/07/2022  19:29:11</span>
        <button>view screenshot</button>
      </div>
      <div className = "information-div">
        <span>rishuparashar7@gmail.com</span>
        <span>11/07/2022  19:29:11</span>
        <button>view screenshot</button>
      </div>
      <div className = "information-div">
        <span>rishuparashar7@gmail.com</span>
        <span>11/07/2022  19:29:11</span>
        <button>view screenshot</button>
      </div>
      <div className = "information-div">
        <span>rishuparashar7@gmail.com</span>
        <span>11/07/2022  19:29:11</span>
        <button>view screenshot</button>
      </div>
      <div className = "information-div">
        <span>rishuparashar7@gmail.com</span>
        <span>11/07/2022  19:29:11</span>
        <button>view screenshot</button>
      </div>
      </div>
    </div>
  )
}

export default Approval