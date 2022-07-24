import React from 'react'
import {db} from "./firebase-config"
import { Link, useParams, useLocation } from 'react-router-dom';
import {collection, doc, setDoc, getDocs, query, getDoc} from "firebase/firestore";

function NameApproval(){

    const loc = useLocation();
    const date = loc.state.date;
    const data = loc.state.passData;

    // const getDates = async() =>{
    //     const querySnap = await getDocs(collection(db, "data"));
    //     querySnap.forEach((doc) =>{
    //         Object.keys(doc.data()).forEach((key) =>{
    //             if(doc.data()[key]["campId"]!==undefined && doc.data()[key]["dateTime"].toString().split(",")[0]===date){
    //                 //Add this doc object to list
    //             }
    //         })
    //     })
    // }

  return (
    <div>{
            data.map((value , key)=>{
                return (
                    <div key={key} style={{marginBottom:"20px"}}>
                        <li>{`User : ${value.user}`}</li>
                        <li>{`FormData : ${value.formData[0]}`}</li>
                        <li>{`campRewardName : ${value.campRewardName}`}</li>
                        <li>{`status : ${value.status}`}</li>
                    </div>
                )
            })
    }</div>
  )
}

export default NameApproval