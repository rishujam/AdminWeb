import { db, messaging } from "./firebase-config"
import { collection, doc, setDoc, getDocs, query, getDoc, updateDoc, increment } from "firebase/firestore";

const updateSubmissionStatus=campSubmit => async() => {
    try{
        const docRef = doc(db, "promoCampPerformed", campSubmit["user"]);
        var obj = {};
        const key= `${campSubmit["campId"]},${campSubmit["subCount"]}`;
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

const getNotifyToken= (user,token) =>async() =>{
    try{
        const docRef = doc(db, "utils",`token${user}`);
        let document = await getDoc(docRef);
        if(document.exists()){
            token = document.data()["token"];
        }else{
            token = undefined;
        }
        console.log(token);
    }catch(e){
        console.log(e);
    }
}

const getFatherUser =(user, fatherUser) => async() =>{
    try{
        const docRef = doc(db,"refer", "child-parent");
        let document = await getDoc(docRef);
        if(document.exists()){
            fatherUser = document.data()[user];
        }
    }catch(e){
        console.log(e);
    }
}

const addToReferAmount = (user, amount) => async() =>{
    try{
        const docRef = doc(db, "refer", "earnings")
        
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
            "message" : "Hey I am Ved Gupta",
        },
        "to":"faws0RvtQDm95XmG69xtOa:APA91bGa5Mp-YdsmaxNHo3KtVbM9jQWwUsnmoR0omcjpLjCTCvYm6ZCr7s7DTHygkpeJsqi3cRxPOe8Dao-A-C_JEohcY32eAbNHVPWXgDYs55aPqMQhtDVnNRLZQkqTZuvX7CtAn1qL"
    })
}

const send = async() =>{
    try{
        fetch('https://fcm.googleapis.com/fcm/send/', requestOptions).then(response => console.log(response.json()))
    }catch(e){
        console.log(e);
    }
}


export {
    updateSubmissionStatus, 
    updateWallet, 
    updatePendingWallet, 
    getNotifyToken,
    getFatherUser,
    send
}
