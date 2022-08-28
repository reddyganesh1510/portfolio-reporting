import MyPortfolio from "./components/MyPortfolio";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyOrders from "./components/MyOrders";

const url = "http://localhost:8000/";

function App() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MyPortfolio />}></Route>
          <Route path="/orders" element={<MyOrders />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
