import React, { useEffect, useState } from 'react'
import { db } from "./firebase-config"
import { collection, doc, setDoc, getDocs, query, getDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';

function DateApprovals() {

    const [ approvalDates, setApprovalDates ] = useState([]);
    const [ uniqueDates, setUniqueDates ] = useState([]);

    const getDates = async () => {
        const querySnap = await getDocs(collection(db, "promoCampPerformed"));
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

    const docData = {
        "25,4": {
            campId:"25",
            campRewardName:"Instaclean,10",
            dateTime:"27/04/22, 07:05:10",
            formData: ["name,Sudhanshu", "class,10"],
            status: "Pending",
            subCount: "4",
            user: "rishuparashar7@gmail.com"
        }
    };
    const sendData = async() =>{
        await setDoc(doc(db, "promoCampPerformed", docData["25,4"]["user"]), docData, {merge:true});
    }

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
            <h1 onClick={sendData}>Date of Approvals </h1>
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