import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "./config";
import Navbar from "./Navbar";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";

function MyOrders() {
  const [LineChartData, setChartData] = useState([]);
  const [Orders, setOrders] = useState([]);
  useEffect(() => {
    axios
      .get(baseUrl + "misc/orders")
      .then(async (res) => {
        console.log(res.data);
        setOrders(res.data.orders);
        lineGraphMaker(res.data.orders);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  const lineGraphMaker = (orders) => {
    let lG = [];
    const lineGraphData = {
      labels: [],
      datasets: [
        {
          label: "Value of Portfolio",
          data: [],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    orders = orders.reverse();

    console.log(lineGraphData);
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="container-fluid " style={{ overflow: "hidden" }}>
        <div className="row " style={{ height: "40vh" }}>
          <h3 className="m-3 mx-4">Order History</h3>
          <div
            className="col-md-12 "
            style={{ height: "40vh", overflowY: "scroll" }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Stock</th>
                  <th scope="col">Date</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Buy Price</th>
                  <th scope="col">Total Buy value</th>
                </tr>
              </thead>
              <tbody>
                {Orders &&
                  Orders.map((item) => {
                    return (
                      <tr>
                        <td>{item.stockName}</td>
                        <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price && item.price.toFixed(2)}</td>

                        <td>{item.totalValue && item.totalValue.toFixed(2)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* <div className="col-md-6">
            <PieChart />
          </div> */}
        </div>
        {/* <div className="row " style={{ height: "40vh" }}>
          <div className="col-md-12">
            <LineChart data1={LineChartData} />
          </div>
        </div> */}
      </div>
    </>
  );
}

export default MyOrders;
