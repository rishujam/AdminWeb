import React, { useState } from 'react'
import {db} from "./firebase-config"
import { Link, useParams, useLocation } from 'react-router-dom';
import {collection, doc, setDoc, getDocs, query, getDoc} from "firebase/firestore";

function NameApproval(){

    const loc = useLocation();
    const date = loc.state.date;
    const data = loc.state.passData;
    let campNames = [];


    const filterNamesFromData=() =>{
        data.forEach((obj) =>{
            if(!(campNames.some(item => obj["campRewardName"].split(",")[0] === item))){
                campNames.push(obj["campRewardName"].split(",")[0]);
            }
        })
    }
    filterNamesFromData();

    const filterDataToPass =(name) =>{
        let approvals = [];
        data.forEach((doc) =>{
            if(doc["campRewardName"].split(",")[0]===name){
                approvals.push(doc);
            }
        })
        return approvals;
    }


  return (
    <div>
        <h2>{date}</h2>
        <ul>
            {
                campNames.map((value, key)=>{
                    return (
                        <li key={key} ><Link to="/approval"
                            state={{
                                date : date,
                                name: value,
                                passData : filterDataToPass(value)
                            }}>{value}</Link></li>
                    )
                })
            }
        </ul>
    </div>
  )
}

export default NameApproval