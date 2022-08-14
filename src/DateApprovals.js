import React, { useEffect, useState } from 'react'
import { db } from "./firebase-config"
import { collection, doc, setDoc, getDocs, query, getDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { format } from "date-fns";

function DateApprovals() {

    const [ approvalDates, setApprovalDates ] = useState([]);
    const [ uniqueDates, setUniqueDates ] = useState([]);
    const [ loadingState, setLoadingState] = useState(0);
    let count = 0;
    

    const getDates = async () => {
        setLoadingState(1);
        const querySnap = await getDocs(collection(db, "promoCampPerformed"));
        let eventData = [];
        let tempUniqueDates = [];
        querySnap.forEach((doc) => {
            Object.keys(doc.data()).forEach((key) => {
                if (doc.data()[ key ][ "campId" ] !== undefined) {
                    if(doc.data()[key]["status"]==="Pending" || doc.data()[key]["status"]==="Approved"|| doc.data()[key]["status"]==="Rejected"){
                        if (!(eventData.some(item => doc.data()[ key ][ "dateTime" ].split(",")[ 0 ] === item[ "dateTime" ].split(",")[ 0 ]))) {
                            tempUniqueDates.push(doc.data()[ key ][ "dateTime" ].split(",")[ 0 ]);
                        }
                        eventData.push(doc.data()[ key ]);
                    }
                    
                }
            })
        })
        setApprovalDates(eventData);
        let uniqueSortedDates = sortDates(tempUniqueDates);
        setUniqueDates(uniqueSortedDates);
        setLoadingState(0);
    }

    useEffect(() => {
        if (approvalDates.length < 1) {
            getDates();
        }
    }, [ 1 ]);

    const sortDates = (uniqueD) => {
        let sortedDatesMilli = [];
        for(const i of  uniqueD){
            var formattedDate = i.split("/")[1]+"/"+i.split("/")[0]+"/"+i.split("/")[2];
            var date = new Date(formattedDate);
            var milliseconds = date.getTime();
            sortedDatesMilli.push(milliseconds);
        }
        sortedDatesMilli.sort();
        let sortedDates = [];
        for(const i of sortedDatesMilli){
            var date = new Date(i);
            var formatted = format(date,"dd/MM/yyyy")
            sortedDates.push(formatted);
        }
        const final = [...sortedDates].reverse();
        count++;
        return final;
    }

    // useEffect(() => {
    //     if (count<1) {
    //         const dates = sortDates();
    //         console.log(dates);
    //         setUniqueDates(dates);
    //     }
    // }, [ 1 ]);

    


    // const docData = {
    //     "25,2": {
    //         campId:"25",
    //         campRewardName:"Instaclean,10",
    //         dateTime:"27/04/22, 11:15:10",
    //         formData: ["name,Sudhanshu", "class,10"],
    //         status: "Pending",
    //         subCount: "2",
    //         user: "androguide@gmail.com"
    //     }
    // };
    // const sendData = async() =>{
    //     await setDoc(doc(db, "promoCampPerformed", docData["25,2"]["user"]), docData, {merge:true});
    // }  for testing

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
        <>
        {
            loadingState ===0 ? (
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
            ):(
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

export default DateApprovals;