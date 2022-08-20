import MyPortfolio from "./components/MyPortfolio";
import Navbar from "./components/Navbar";

import axios from "axios";
import { useEffect } from "react";
import Modal from "./components/Modal";

const url = "http://localhost:8000/";

function App() {
  return (
    <div>
      <Navbar />
      <MyPortfolio />
    </div>
  );
}

export default App;
