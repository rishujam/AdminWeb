import { db, messaging } from "./firebase-config"
import { collection, doc, setDoc, getDocs, query, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject} from "firebase/storage";
import { async } from "@firebase/util";

const storage = getStorage();

const updateSubmissionStatus= async(campSubmit,status) => {
    campSubmit["status"]=status;
    try{
        const docRef = doc(db, "promoCampPerformed", campSubmit["user"]);
        var obj = {};
        const key = `${campSubmit["campId"]},${campSubmit["subCount"]}`;
        obj[key] = campSubmit;
        await updateDoc(docRef, obj);
        console.log("UpdateSubmitDone")
    }catch(e){
        console.log(e);
    }
}

const updateWallet =  async(user,amount, operator) =>{
    try{
        const docRef = doc(db, "wallet", user);
        let document = await getDoc(docRef);
        let currentAmount = 0;
        if(document.exists()){
            currentAmount = document.data()["Total"];
            if(currentAmount===undefined){
                currentAmount= 0;
            }
        }
        let newAmount = currentAmount+amount;
        if(operator==="-"){
            newAmount=currentAmount-amount;
            if(newAmount<0){
                newAmount=0;
            }
        }
        await setDoc(doc(db, "wallet", user), {Total:newAmount}); 
        console.log("updateWalletDone");
    }catch(e){
        console.log(e);
    }
}

const updatePendingWallet = async(user, amount)=>{
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
        console.log("updatePendingDone")
    }catch(e){
        console.log(e);
    }
}

const getNotifyToken = async(user) =>{
    try{
        let token = ""
        const docRef = doc(db, "utils",`token${user}`);
        let document = await getDoc(docRef);
        if(document.exists()){
            token = document.data()["token"];
        }
        console.log("getTokenDone")
        return token
    }catch(e){
        console.log(e);
    }
}

const getFatherUser = async(user) =>{
    try{
        const docRef = doc(db,"refer", "child-parent");
        let document = await getDoc(docRef);
        if(document.exists()){
            let fatherUser = document.data()[user];
            console.log("getFatherDone")
            return fatherUser;
        }
        console.log("getFatherDone")
        return undefined;
    }catch(e){
        console.log(e);
    }
}

const addToReferAmount =  async(user, amount) =>{
    try{
        const docRef = doc(db, "refer", "userEarnings")
        let document = await getDoc(docRef);
        let oldAmount = 0
        if(document.data()[user]!==undefined){
            oldAmount = document.data()[user];
        }
        let newAmount = oldAmount+amount;
        await setDoc(docRef, {user:newAmount},{merge:true})
        console.log("addToReferAmountDone")
    }catch(e){
        console.log(e);
    }
}


const sendNotification = async(token, message) =>{
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'key=AAAA6u5VV9I:APA91bGjcEPeuJIvXkjHucizJ5CZaHyLGpmEkL-WlJaEWqfE9OHRvK-aUXjGMhHnONdepR0KCHPPuugCP9ZepbEFedr9aNN6MSECgXtJw3G3DvNo-2UII9rACfxCqF_eCkgDK-ItrVla'
        },
        body:JSON.stringify({
            "data" : {
                "message" : message
            },
            "to" : token
        })
    }
    try{
        await fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
        .then(response => response.json())
        .then(response => console.log(response))
        console.log("sendNotificationDone")
    }catch(e){
        console.log(e);
    }
}

const approveSubmit = async(campSubmit) =>{
    const amount = Number(campSubmit["campRewardName"].split(",")[1]);
    await updateSubmissionStatus(campSubmit, "Approved");
    await updateWallet(campSubmit["user"],amount,"+")
    await updatePendingWallet(campSubmit["user"], amount)
    const token = await getNotifyToken(campSubmit["user"])
    if(token!==undefined){
        await sendNotification(token, `₹${amount} Added to Wallet`)
    }
    const refAmount = amount/10;
    const fatherUser = await getFatherUser(campSubmit["user"])
    if(fatherUser!==undefined){
        await updateWallet(fatherUser, refAmount)
        await addToReferAmount(fatherUser,refAmount)
        const fatherToken = await getNotifyToken(fatherUser)
        if(fatherToken!==undefined){
            await sendNotification(fatherToken, `₹${refAmount} Added to Wallet as referral earnings`)
        }
    }
}

const rejectSubmit = async(campSubmit) =>{
    const amount = Number(campSubmit["campRewardName"].split(",")[1]);
    await updateSubmissionStatus(campSubmit,"Rejected")
    await updatePendingWallet(campSubmit["user"], amount)
}

const deletePrevious = async(campSubmit)=>{
    const fileRef = ref(storage, `proofCampPromo/${campSubmit["user"]},${campSubmit["campId"]},${campSubmit["subCount"]}`)
    await deleteObject(fileRef).then(() =>{
        console.log("FileDeleted");
    }).catch((error) =>{
        console.log(error);
    })
    await updateSubmissionStatus(campSubmit,`Deleted,${campSubmit["status"]}`);
}

export {
    approveSubmit,
    rejectSubmit,
    deletePrevious
}
