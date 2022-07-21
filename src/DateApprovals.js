import React, { useEffect, useState } from 'react'
import {db} from "./firebase-config"
import {collection, doc, setDoc, getDocs, query, getDoc} from "firebase/firestore";

function DateApprovals() {

    const [approvalDates, setApprovalDates]  = useState([]);


    const getDates = async() =>{
        const querySnap = await getDocs(collection(db, "data"));
        let eventData = [];
        querySnap.forEach((doc) =>{
            Object.keys(doc.data()).forEach((key) =>{
                if(doc.data()[key]["campId"]!==undefined){
                    //Add this doc object to list
                    eventData.push(doc.data()[key]);
                }
            })
        })
        setApprovalDates(eventData);
    }
    
    useEffect(()=>{
        if(approvalDates.length<1){
            getDates();
        }
    } , [1]);

  return (
    <div>DateApprovals
        <ul>
            {
                approvalDates.map((data , key)=>{
                    return (
                        
                        <li key={key} title={`User : ${data.user}`}>{data.dateTime}</li>
                    )
                })
            }
        </ul>
    </div>
  )
}

export default DateApprovals