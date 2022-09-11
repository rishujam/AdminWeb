import React, { useEffect, useState } from 'react'
import {
    getAllReddemRequests
  } from "./FirestoreFun"
import "./style.css";

function RedeemReq () {
    const [loadingRedeem, setLoadingRedeem] = useState(0);
    const [dataToShow, setDataToShow] = useState([]);
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

    const handleCbClick =(e, mail) =>{
        const checked = e.target.checked;
        const email = mail;
        if(email === "Select All" ){
            let tempData = dataToShow.map((data)=>{
                return { ...data, isChecked:checked}
            })
            setDataToShow(tempData);
        }else{
            let tempData = dataToShow.map((data)=>
                data.email === email ? { ...data, isChecked: checked} : data
            );
            setDataToShow(tempData)
        }
        
    }

    const click= () =>{
        
        console.log(Math.floor(rand));
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
                    <button className="btn" onClick={click}>Done Selected</button>
                    <button className="btn" >Remove selected</button>
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
                                                <input name={value.email} type="checkbox" style={{marginRight:"20px"}} checked={value?.isChecked || false } onChange={(event)=>{handleCbClick(event, value.email)}}/>
                                            </ul>
                                            </div>
                                        )
                                    })
                                }
                            </ul>
                        </nav>
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