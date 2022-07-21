import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import DateApprovals from "./DateApprovals";
import Approval from  "./Approval"
import NameApproval from "./NameApproval"

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/home" element={<Home/>} />
          <Route exact path="/approvaldate" element={<DateApprovals/>} />
          <Route exact path="/approvalsName" element={<NameApproval/>} />
          <Route exact path="/approval" element={<Approval/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
