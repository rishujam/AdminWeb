import React, { useEffect, useState } from 'react'
import {db} from "./firebase-config"
import {collection, doc, setDoc, getDocs, query, getDoc} from "firebase/firestore";
import { Link } from 'react-router-dom';

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

    // const docData = {
    //     "22,1": {
    //         campId:"22",
    //         campRewardName:"Axis,10",
    //         dateTime:"27/04/22, 05:05:10",
    //         formData: ["name,Sudhanshu", "class,10"],
    //         status: "Deleted, Rejected",
    //         subCount: "1",
    //         user: "rishuparashar7@gmail.com"
    //     }
    // };
    // const sendData = async() =>{
    //     await setDoc(doc(db, "data", "one"), docData, {merge:true});
    // }
    console.log(approvalDates);
    
  return (
    <div>
        <h1>Date of Approvals </h1>
        <ul>
            {
                approvalDates.map((dat , key)=>{
                    return (
                        <div>
                            <li key={key}>{dat.dateTime.split(",")[0]}</li>
                            <Link to = "/approvalname" state={{data: dat}}>See</Link>
                        </div>
 
                    )
                })
            }
        </ul>
    </div>
  )
}

export default DateApprovals