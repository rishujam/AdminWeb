import React, { useState } from 'react'

function RedeemReq () {
    const [loadingRedeem, setLoadingRedeem] = useState(0);
    let dataToShow = [];

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
                    <button className="btn" onClick={rejectSelected}>Done Selected</button>
                    <button className="btn" onClick={approveSelected}>Reject selected</button>
                </div>
            </div>
        ) : (
            <div>
                <nav>
                    <h1 style={{ color: 'white' }}>Records</h1>
                    <ul>
                        {

                        }
                    </ul>
                </nav>
            </div>
        )
    }
    </>
    
  )
}

export default RedeemReq