import React from 'react'
import {db} from "./firebase-config"
import { Link, useParams, useLocation } from 'react-router-dom';
import {collection, doc, setDoc, getDocs, query, getDoc} from "firebase/firestore";

function NameApproval(props){

    const location = useLocation();
    console.log("Props value" + props);
    console.log(location.state.data);

    const date = "27/04/2022"
    const getDates = async() =>{
        const querySnap = await getDocs(collection(db, "data"));
        querySnap.forEach((doc) =>{
            Object.keys(doc.data()).forEach((key) =>{
                if(doc.data()[key]["campId"]!==undefined && doc.data()[key]["dateTime"].toString().split(",")[0]===date){
                    //Add this doc object to list
                }
            })
        })
    }
  return (
    <div>NameApproval</div>
  )
}

export default NameApproval