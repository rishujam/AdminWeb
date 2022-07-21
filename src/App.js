import { useState, useEffect} from 'react';
import './App.css';
import { db } from './firebase-config';
import { collection, doc, getDocs } from 'firebase/firestore';

function App() {
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      getUsers(data.data.map((doc) => ({...doc.data(), id: doc.id})));
    };

    getUsers()
  }, []);
  return (
    <div className="App"> 
    {users.map((user) => {
        return (
          <div>
            {" "}
            <h1>Name: {user.name}</h1>
            <h1>Class: {user.class}</h1>
          </div>
        );
    })}
    </div>
  );
}

export default App;
