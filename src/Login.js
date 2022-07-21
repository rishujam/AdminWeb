import { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login(){

    let navigate = useNavigate();

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
      auth.onAuthStateChanged((user) =>  {
          if(user!==null){
              console.log(user.email);
              setCurrentUser(user)
              navigate('/home');
          }
      });
    }, []);
  

  const login = async () =>{
    try{
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      console.log(user);
    }catch(error) {
      console.log(error.message);
    }
  };
  return (
    <div className="App">
      <h2> Login </h2>
      <input 
        type="text"
        onChange={(e) =>setLoginEmail(e.target.value)}
        value={loginEmail}
        placeholder="Email..."
        required/>
      <input 
        type="text"
        onChange={(event) => setLoginPassword(event.target.value)}
        value={loginPassword}
        placeholder="Password..."
        required/>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;