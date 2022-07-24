import React, { useEffect, useState } from 'react'
import { db } from "./firebase-config"
import { collection, doc, setDoc, getDocs, query, getDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';

function DateApprovals() {

    const [ approvalDates, setApprovalDates ] = useState([]);
    const [ uniqueDates, setUniqueDates ] = useState([]);

    const getDates = async () => {
        const querySnap = await getDocs(collection(db, "data"));
        let eventData = [];
        let tempUniqueDates = [];
        querySnap.forEach((doc) => {
            Object.keys(doc.data()).forEach((key) => {
                if (doc.data()[ key ][ "campId" ] !== undefined) {
                    if (!(eventData.some(item => doc.data()[ key ][ "dateTime" ].split(",")[ 0 ] === item[ "dateTime" ].split(",")[ 0 ]))) {
                        tempUniqueDates.push(doc.data()[ key ][ "dateTime" ].split(",")[ 0 ]);
                    }
                    eventData.push(doc.data()[ key ]);
                }
            })
        })
        setApprovalDates(eventData);
        setUniqueDates(tempUniqueDates);
    }



    useEffect(() => {
        if (approvalDates.length < 1) {
            getDates();
        }
    }, [ 1 ]);

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

    const filterAndPassData = (date) => {
        let tempDataToPass = [];
        approvalDates.forEach((approval) => {
            if (approval[ "dateTime" ].split(",")[ 0 ] === date) {
                tempDataToPass.push(approval);
            }
        })
        return tempDataToPass;
    }

    return (
        <div>
            <h1>Date of Approvals </h1>
            <ul>
                {
                    uniqueDates.map((dat, key) => {
                        return (
                            <li key={key} ><Link to="/approvalname"
                            state={{
                                date : dat ,
                                passData : filterAndPassData(dat)
                            }}>{dat}</Link></li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default DateApprovals;