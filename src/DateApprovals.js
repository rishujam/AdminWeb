import React, { useState } from 'react'
import {db} from "./firebase-config"
import {collection, doc, setDoc, getDocs, query, getDoc} from "firebase/firestore";

function DateApprovals() {

    const [approvalDates, setApprovalDates]  = useState([]);


    const getDates = async() =>{
        const querySnap = await getDocs(collection(db, "data"));
        querySnap.forEach((doc) =>{
            Object.keys(doc.data()).forEach((key) =>{

                if(doc.data()[key]["campId"]!==undefined){
                    //Add this doc object to list
                    setApprovalDates([...approvalDates,doc.data()[key]]);
                }
            })
        })
    }


    
    if(approvalDates.length<1){
        getDates();
    }
  return (
    <div>DateApprovals
        {
            console.log(approvalDates)
        }
    </div>
  )
}

export default DateApprovals