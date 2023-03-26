import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import {
    getAllReddemRequests,
    approveSelectedRedeem
  } from "./FirestoreFun"
import { useNavigate } from 'react-router-dom';
import "./style.css";
import { CSVLink } from "react-csv";

function RedeemReq () {
    const [loadingRedeem, setLoadingRedeem] = useState(0);
    const [dataToShow, setDataToShow] = useState([]);
    let navigate = useNavigate();
    const [selectedItemsRedeem, setSelectedItemsRedeem] = useState([]);

    const getData = async() =>{
        let data = await getAllReddemRequests();
        setDataToShow(data);
    }

    useEffect(() => {
        if (dataToShow.length < 1) {
            getData();
        }
    }, [ 1 ]);

    const handleCbClick =(e, value) =>{
        const checked = e.target.checked;
        const email = value["email"];
        if(value === "Select All" ){
            let tempData = dataToShow.map((data)=>{
                return { ...data, isChecked:checked}
            })
            setDataToShow(tempData);
            if(checked) {
                setSelectedItemsRedeem(tempData);
            }else{
                setSelectedItemsRedeem([]);
            }
        }else{
            let tempData = dataToShow.map((data) =>
                data.email === email ? { ...data, isChecked: checked } : data
            );
            setDataToShow(tempData)
            if(checked){
                if( !selectedItemsRedeem.includes(value)) {
                    setSelectedItemsRedeem([...selectedItemsRedeem, value]);
                }
            }else{
                let newData = [];
                selectedItemsRedeem.map((item)=>{
                    if(item["email"]!==value["email"]){
                        newData.push(item);
                    }
                })
                setSelectedItemsRedeem(newData)
            }
        }
    }

    const doneSelected=async()=>{
        setLoadingRedeem(1);
        let items = selectedItemsRedeem
        await approveSelectedRedeem(items);
        setLoadingRedeem(0);
        navigate("../home", {replace:true});
    }

    const csvHeaders = [
        {label:"User", key:"email"},
        {label:"Amount", key:"amount"},
        {label: "Method", key:"method"},
        {label: "Number/Id", key:"methodDetail"}
    ];

    const csvReport = {
        filename: `redeemreq.csv`,
        headers:csvHeaders,
        data:dataToShow
    }

  return (
    <>
    {
        loadingRedeem === 0 ? (
            <div className='container'>
                <div className ="div1">
                    <div className = "top-left">
                        <h1 className='heading'>Redeem Requests</h1>
                    </div>
                </div>
                <div className="top-right">
                    <CSVLink {...csvReport}>Download CSV</CSVLink>
                    <button className="btn" onClick={doneSelected}>Done Selected</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="div2">
                        <nav>
                            <h1 style={{ color: 'white' }}>Records</h1>
                            <div style={{display:"flex", justifyContent:"center"}}>
                                <label style={{paddingRight:"10px", color:"white"}}>Select All</label>
                                <input type="checkbox" onChange={(event)=>{handleCbClick(event, "Select All")}} checked={dataToShow.filter((data) => data?.isChecked !== true).length <1
                                }/>
                            </div>
                            <ul>
                                {
                                    dataToShow.map((value,key) =>{
                                        return(
                                            <div key={key} style={{ marginBottom: "24px", color: 'white', display: 'flex' }}>
                                            <ul style={{ width: "80%" }}>
                                                <li>{value.email}</li>
                                                <li>{`Date: ${value.dateTime.split(",")[0]}`}</li>
                                                <li>{`Amount: ₹${value.amount}`}</li>
                                                <li>{`${value.method}: ${value.methodDetail}`}</li>
                                            </ul>
                                            <ul style={{display:"flex", justifyContent:"center"}}>
                                                <input name={value.email} type="checkbox" style={{marginRight:"20px"}} checked={value?.isChecked || false } onChange={(event)=>{handleCbClick(event, value)}}/>
                                            </ul>
                                            </div>
                                        )
                                    })
                                }
                            </ul>
                        </nav>
                    </div>
                    <div className="div3">
                        {
                            selectedItemsRedeem.length > 0 ? (
                                <nav>
                                <h1 style={{ color: "white" }}>Selected People</h1>
                                <ul>
                                    {
                                        selectedItemsRedeem.map((value, key) => {
                                            return (
                                                <div key={key} style={{ marginBottom: "20px", color: "white", display: "flex" }}>
                                                    <ul style={{ width: "80%" }}>
                                                        <li>{value.email}</li>
                                                        <li>{value.dateTime}</li>
                                                    </ul>
                                                </div>
                                            )
                                        })
                                    }
                                </ul>
                                </nav>
                            ) : <></>
                        }
                    </div>
                </div>
            </div>
        ) : (
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

export default RedeemReq