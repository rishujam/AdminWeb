import { db, messaging } from "./firebase-config"
import { collection, doc, setDoc, getDocs, query, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject, getDownloadURL} from "firebase/storage";
import { async } from "@firebase/util";
import { format } from "date-fns";

const storage = getStorage();

const approveSubmittedApproval = async(selectedSubmits) =>{
    let count = 0;
    for(const campSubmit of selectedSubmits){
        try{
            campSubmit["status"]="Approved";
            const amount = Number(campSubmit["campRewardName"].split(",")[1]);
            const user = campSubmit["user"]

            // update submission status

            const docRef1 = doc(db, "promoCampPerformed", user);
            var obj = {};
            const key = `${campSubmit["campId"]},${campSubmit["subCount"]}`;
            obj[key] = campSubmit;
            await updateDoc(docRef1, obj);
            console.log("UpdateSubmitDone")

            // Update Wallet

            const docRef2 = doc(db, "wallet", user);
            let document = await getDoc(docRef2);
            let currentAmount = 0;
            if(document.exists()){
                currentAmount = document.data()["Total"];
                if(currentAmount===undefined){
                    currentAmount= 0;
                }
            }
            let newAmount = currentAmount+amount;
            await setDoc(doc(db, "wallet", user), {Total:newAmount}); 
            console.log("updateWalletDone");

            //update Pending Wallet

            const docRef3 = doc(db, "pendingAmount", user);
            let document1 = await getDoc(docRef3);
            let pendAmount= 0;
            if(document1.exists()){
                pendAmount = document1.data()["Total"];
                if(pendAmount===undefined){
                    pendAmount = 0;
                }
            }
            let newAmount1 = pendAmount-amount;
            if(newAmount1>=0){
                await updateDoc(docRef3, {Total: newAmount1});
            }
            console.log("updatePendingDone")

            //get Token

            let token = ""
            const docRef4 = doc(db, "utils",`token${user}`);
            let document2 = await getDoc(docRef4);
            if(document2.exists()){
                token = document2.data()["token"];
            }
            console.log("getTokenDone")

            //sendNotify
            if(token!==undefined && token!==""){
                let message =  `₹${amount} Added to Wallet`;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization': `key=${process.env.REACT_APP_SERVER_KEY_MESSAGING}`
                    },
                    body:JSON.stringify({
                        "data" : {
                            "message" :  message
                        },
                        "to" : token
                    })
                }
                await fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
                console.log("sendNotificationDone")
            }

            // get Father

            const refAmount = Math.floor(amount/10);
            if(refAmount>0){
                const docRef5 = doc(db,"refer", "child-parent");
                let fatherUser = undefined;
                let document3 = await getDoc(docRef5);
                if(document3.exists()){
                    fatherUser = document3.data()[user];
                }
                console.log("getFatherDone")

                if(fatherUser!==undefined){
                    // Update Father Wallet
                    const docRef6 = doc(db, "wallet", fatherUser);
                    let document4 = await getDoc(docRef6);
                    let currentAmount1 = 0;
                    if(document4.exists()){
                        currentAmount1 = document4.data()["Total"];
                        if(currentAmount1===undefined){
                            currentAmount1= 0;
                        }
                    }
                    let newAmount2 = currentAmount1+refAmount;
                    await setDoc(doc(db, "wallet", fatherUser), {Total:newAmount2}); 
                    console.log("updateFatherWalletDone");

                    // Update to referal Earning document

                    const docRef7 = doc(db, "refer", "userEarnings")
                    let document5 = await getDoc(docRef7);
                    let oldAmount = 0
                    if(document5.data()[fatherUser]!==undefined){
                        oldAmount = Number(document5.data()[fatherUser]);
                    }
                    let newAmount3 = oldAmount+refAmount;
                    let dataToSet = {};
                    dataToSet[fatherUser] = ""+newAmount3
                    await setDoc(docRef7, dataToSet,{merge:true})
                    console.log("addToReferAmountDone")

                    //get father token

                    let fatherToken = ""
                    const docRef = doc(db, "utils",`token${fatherUser}`);
                    let document = await getDoc(docRef);
                    if(document.exists()){
                        token = document.data()["token"];
                    }
                    console.log("getTokenDone")

                    if(fatherToken!==undefined || fatherToken!==""){
                        let message1 = `₹${refAmount} Added to Wallet as referral earnings`;
                        const requestOptions1 = {
                            method: 'POST',
                            headers: {
                                'Content-Type':'application/json',
                                'Authorization': `key=${process.env.REACT_APP_SERVER_KEY_MESSAGING}`
                            },
                            body:JSON.stringify({
                                "data" : {
                                    "message" : message1
                                },
                                "to" : fatherToken
                            })
                        }
                        await fetch('https://fcm.googleapis.com/fcm/send', requestOptions1);
                    }
                }
            }
        }catch(error){}
        count++;
        console.log(`Approval: ${count} Done`);
    }
}

const rejectSubmit = async(selectedItems) =>{
    let count = 0;
    for(const campSubmit of selectedItems){
        try{
            const amount = Number(campSubmit["campRewardName"].split(",")[1]);

            // update submission status

            campSubmit["status"]="Rejected";
            const docRef = doc(db, "promoCampPerformed", campSubmit["user"]);
            var obj = {};
            const key = `${campSubmit["campId"]},${campSubmit["subCount"]}`;
            obj[key] = campSubmit;
            await updateDoc(docRef, obj);
            console.log("UpdateSubmitDone");

            //update pending wallet

            const docRef2 = doc(db, "pendingAmount", campSubmit["user"]);
            let document1 = await getDoc(docRef2);
            let pendAmount= 0;
            if(document1.exists()){
                pendAmount = document1.data()["Total"];
                if(pendAmount===undefined){
                    pendAmount = 0;
                }
            }else{
                pendAmount = 0;
            }
            let newAmount1 = pendAmount-amount;
            if(newAmount1>=0){
                await updateDoc(docRef2, {Total: newAmount1});
            }
            console.log("updatePendingDone")
        }catch(error){}
        count++;
        console.log(`Rejection ${count}`);
    }
}

const deletePrevious = async(selectedItems)=>{
    let count = 0;
    for(const campSubmit of selectedItems){
        try{
            // Update sumbission status

            let currStatus = campSubmit["status"];
            campSubmit["status"] = `Deleted,${currStatus}`;
            const docRef = doc(db, "promoCampPerformed", campSubmit["user"]);
            var obj = {};
            const key = `${campSubmit["campId"]},${campSubmit["subCount"]}`;
            obj[key] = campSubmit;
            await updateDoc(docRef, obj);
            console.log("UpdateSubmitDone")

            //Delete File

            const fileName = ref(storage, `proofCampPromo/${campSubmit["user"]},${campSubmit["campId"]},${campSubmit["subCount"]}`);
            await deleteObject(fileName);
            console.log("Deleted Image")

        }catch(error){}
        count++;
        console.log(`Deleted ${count}`);
    }
    console.log("Deletion completed");
}

const getUrl = async(user, campId, subCount) =>{
    try{
        const url = await getDownloadURL(ref(storage,`proofCampPromo/${user},${campId},${subCount}`));
        return url;
    }catch{
        return ""
    }
}

const getAllReddemRequests = async() =>{
    const querySnap = await getDocs(collection(db, "redeem"));
    let redeemData = [];
    querySnap.forEach((doc) =>{
        redeemData.push(doc.data());
    })
    let sorted = sortRedeemReq(redeemData);
    return sorted;
}

const sortRedeemReq = (requests) => {
    for(const i of  requests){
        var x = i["dateTime"].split(",")[0];
        var y = i["dateTime"].split(",")[1];
        var formattedDate = x.split("/")[1]+"/"+x.split("/")[0]+"/"+x.split("/")[2];
        var date = new Date(formattedDate+" "+y);
        var milliseconds = date.getTime();
        i["dateTime"] = milliseconds;
    }
    const myData = [].concat(requests).sort((a, b) => a.dateTime > b.dateTime ? 1 : -1)
    for(const i of myData){
        var date = new Date(i["dateTime"]);
        var formatted = format(date,"dd/MM/yyyy")
        i["dateTime"] = formatted;
    }
    const final = [...myData].reverse();
    return final;
}

const approveSelectedRedeem = async(selectedItems) =>{
    let doneCount = 0;
    let errorCount = 0;
    for(const i of selectedItems){
        try{
            //DeleteRedeem Request
            await deleteDoc(doc(db, "redeem", i["email"]));

            //Add to payment Done
            const rand = Math.floor(Number("100")* Math.random() + Math.random());
            const map = {};
            map[rand] = i["amount"];
            const docRefPayment = doc(db, "paymentDone", i["email"]);
            await setDoc(docRefPayment, map,{merge:true})

            //getToken
            let token = ""
            const docRefToken = doc(db, "utils",`token${i["email"]}`);
            let docum = await getDoc(docRefToken);
            if(docum.exists()){
                token = docum.data()["token"];
            }

            //sendNotify
            if(token!==undefined && token!==""){
                let message =  `₹${i["amount"]} Sent to your ${i["method"]}`;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization': `key=${process.env.REACT_APP_SERVER_KEY_MESSAGING}`
                    },
                    body:JSON.stringify({
                        "data" : {
                            "message" :  message
                        },
                        "to" : token
                    })
                }
                await fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
            }
            doneCount++;
        }catch(error){
            errorCount++;
        }
    }
    console.log(`Errors: ${errorCount}`);
    console.log(`Success: ${doneCount}`);
}


export {
    rejectSubmit,
    deletePrevious,
    approveSubmittedApproval,
    getUrl,
    getAllReddemRequests,
    approveSelectedRedeem
}
