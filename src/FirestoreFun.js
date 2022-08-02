import { db, messaging } from "./firebase-config"
import { collection, doc, setDoc, getDocs, query, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject} from "firebase/storage";
import { async } from "@firebase/util";


const storage = getStorage();

const updateSubmissionStatus=campSubmit => async() => {
    try{
        const docRef = doc(db, "promoCampPerformed", campSubmit["user"]);
        var obj = {};
        const key = `${campSubmit["campId"]},${campSubmit["subCount"]}`;
        obj[key] = campSubmit;
        await updateDoc(docRef, obj);
    }catch(e){
        console.log(e);
    }
}

const updateWallet = (user,amount, operator) => async() =>{
    try{
        const docRef = doc(db, "wallet", user);
        let document = await getDoc(docRef);
        let currentAmount = 0;
        if(document.exists()){
            currentAmount = document.data()["Total"];
            if(currentAmount===undefined){
                currentAmount= 0;
            }
        }else{
            currentAmount=0;
        }
        console.log(currentAmount);
        let newAmount = currentAmount+amount;
        if(operator==="-"){
            newAmount=currentAmount-amount;
            if(newAmount<0){
                newAmount=0;
            }
        }
        console.log(newAmount);
        await setDoc(doc(db, "wallet", user), {Total:newAmount}); 
    }catch(e){
        console.log(e);
    }
}

const updatePendingWallet =(user, amount) => async()=>{
    try{
        const docRef = doc(db, "pendingAmount", user);
        let document = await getDoc(docRef);
        let pendAmount= 0;
        if(document.exists()){
            pendAmount = document.data()["Total"];
            if(pendAmount===undefined){
                pendAmount = 0;
            }
        }else{
            pendAmount = 0;
        }
        let newAmount = pendAmount-amount;
        if(newAmount>=0){
            await updateDoc(docRef, {Total: newAmount});
        }
    }catch(e){
        console.log(e);
    }
}

const getNotifyToken= (user) =>async() =>{
    try{
        let token = ""
        const docRef = doc(db, "utils",`token${user}`);
        let document = await getDoc(docRef);
        if(document.exists()){
            token = document.data()["token"];
        }
        return token
    }catch(e){
        console.log(e);
    }
}

const getFatherUser =(user) => async() =>{
    try{
        const docRef = doc(db,"refer", "child-parent");
        let document = await getDoc(docRef);
        if(document.exists()){
            let fatherUser = document.data()[user];
            return fatherUser;
        }
        return undefined;
    }catch(e){
        console.log(e);
    }
}

const addToReferAmount = (user, amount) => async() =>{
    try{
        const docRef = doc(db, "refer", "userEarnings")
        let document = await getDoc(docRef);
        let oldAmount = 0
        if(document.data()[user]!==undefined){
            oldAmount = document.data()[user];
        }
        let newAmount = oldAmount+amount;
        await setDoc(docRef, {user:newAmount},{merge:true})
    }catch(e){
        console.log(e);
    }
}

const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type':'application/json',
        'Authorization': 'key=AAAA6u5VV9I:APA91bGjcEPeuJIvXkjHucizJ5CZaHyLGpmEkL-WlJaEWqfE9OHRvK-aUXjGMhHnONdepR0KCHPPuugCP9ZepbEFedr9aNN6MSECgXtJw3G3DvNo-2UII9rACfxCqF_eCkgDK-ItrVla'
    },
    body:JSON.stringify({
        "data" : {
            "message" : ""
        },
        "to" : ""
    })
}

const sendNotification =(token, message)=> async() =>{
    requestOptions["body"]["to"] = token
    requestOptions["body"]["data"]["message"] = message
    try{
        await fetch('https://fcm.googleapis.com/fcm/send', requestOptions).then(response => console.log(response.json()))
    }catch(e){
        console.log(e);
    }
}

const approveSubmit=(campSubmit) => async() =>{
    const amount = Number(campSubmit["campRewardName"].split(",")[1]);
    updateSubmissionStatus(campSubmit);
    updateWallet(campSubmit["user"],amount,"+")
    updatePendingWallet(campSubmit["user"], amount)
    const token = getNotifyToken(campSubmit["user"])
    if(token!==undefined){
        sendNotification(token, `₹${amount} Added to Wallet`)
    }
    const refAmount = amount/10;
    if(refAmount>0){
        const fatherUser = getFatherUser(campSubmit["user"])
        if(fatherUser!==undefined){
            updateWallet(fatherUser, refAmount)
            addToReferAmount(fatherUser,refAmount)
            const fatherToken = getNotifyToken(fatherUser)
            if(fatherToken!==undefined){
                sendNotification(fatherToken, `₹${refAmount} Added to Wallet as referral earnings`)
            }
        }
    }
}

const rejectSubmit =(campSubmit) => async() =>{
    const amount = Number(campSubmit["campRewardName"].split(",")[1]);
    updateSubmissionStatus(campSubmit)
    updatePendingWallet(campSubmit["user"], amount)
}

const deletePrevious=(campSubmit)=> async()=>{
    const fileRef = ref(storage, `proofCampPromo/${campSubmit["user"]},${campSubmit["campId"]},${campSubmit["subCount"]}`)
    deleteObject(fileRef).then(() =>{
        console.log("FileDeleted");
    }).catch((error) =>{
        console.log(error);
    })
    updateSubmissionStatus(campSubmit);
}

export {
    approveSubmit,
    rejectSubmit,
    deletePrevious
}
