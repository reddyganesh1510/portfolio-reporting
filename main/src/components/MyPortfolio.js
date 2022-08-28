import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "./config";
import Navbar from "./Navbar";
import { PieChart } from "./PieChart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import MyOrders from "./MyOrders";
import { BarGraph } from "./BarGaph";

ChartJS.register(ArcElement, Tooltip, Legend);

function MyPortfolio() {
  const [Portfolio, setPortfolio] = useState([]);
  const [PieChartData, setPieChartData] = useState({});
  const [PortfolioBenchmarks, setPortfolioBenchmarks] = useState({
    totalBuyValue: 0,
    totalCurrentValue: 0,
    alpha: 0,
    beta: 0,
    nifty100: 0,
  });

  function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
  }

  const [BarGraphData, setBarGraphData] = useState({});

  const alphaCalculator = (stocks, niftyChange) => {
    let totalValue = 0;
    let totalBuyValue = 0;
    for (let item of stocks) {
      totalBuyValue = totalBuyValue + item.totalBuyValue;
      totalValue = item.marketPrice * item.quantity + totalValue;
    }
    updateBenchmarks(
      "alpha",
      ((totalValue - totalBuyValue) / totalBuyValue) * 100 - niftyChange
    );
    updateBenchmarks("totalBuyValue", totalBuyValue);
    updateBenchmarks("totalCurrentValue", totalValue);
  };

  const updateBenchmarks = (name, value) => {
    setPortfolioBenchmarks((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    axios
      .get(baseUrl + "portfolio")
      .then(async (res) => {
        // for await (let item of res.data.data.coins) {
        //   console.log(item);
        //   let fd = new FormData();
        //   fd.append("name", item.name);
        //   axios.post(baseUrl + "misc/stock-realtime-price", fd).then((res) => {
        //     item["marketPrice"] =
        //       res.data.stockPrice == null ? 0 : res.data.stockPrice.price;
        //   });
        // }
        setPortfolio(res.data.data.coins);
        alphaCalculator(res.data.data.coins, 4.25);
        updateBenchmarks("nifty100", 4.25);
        setPieChartData(res.data.pieChartData);
        setBarGraphData(res.data.BarGraphData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    console.log(Portfolio);
  }, [Portfolio]);

  return (
    <>
      <Navbar />

      <div className="container-fluid m-2" style={{ overflow: "hidden" }}>
        <div className="row" style={{ height: "40vh" }}>
          <div
            className="col-md-6 "
            style={{ height: "40vh", overflowY: "scroll" }}
          >
            <div className="row m-0 p-0" style={{ overflowX: "hidden" }}>
              <h3 className="m-2  col-md-12 ">My Portfolio</h3>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Stock</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Market Price</th>
                  <th scope="col">Current Value</th>
                  <th scope="col">Total Buy value</th>

                  <th scope="col">Gain</th>
                </tr>
              </thead>
              <tbody>
                {Portfolio &&
                  Portfolio.map((item) => {
                    return (
                      <tr>
                        <td>{item.name}</td>

                        <td>{item.quantity}</td>
                        <td>{item.marketPrice.toFixed(2)}</td>

                        <td>{(item.marketPrice * item.quantity).toFixed(2)}</td>
                        <td>
                          {item.totalBuyValue && item.totalBuyValue.toFixed(2)}
                        </td>
                        <td>
                          {item.marketPrice &&
                            item.totalBuyValue &&
                            (
                              item.marketPrice * item.quantity -
                              item.totalBuyValue
                            ).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="col-md-6  ">
            <MyOrders />
            {/* <div>
              <h6 className="" style={{ marginLeft: "45%" }}>
                % Holdings
              </h6>
            </div>
            <div>
              {!isEmptyObject(PieChartData) && (
                <PieChart dataP={PieChartData} title1={"% Holdings"} />
              )}
            </div> */}
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-4 ">
            <div>
              <h6 className="" style={{ marginLeft: "10%" }}>
                Portfolio Benchmarks in comparison to NIFTY100
              </h6>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Parameter</th>
                  <th scope="col">Value</th>
                  {/* <th scope="col">Handle</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Current Value of Portfolio</td>
                  <td>{PortfolioBenchmarks.totalCurrentValue}</td>
                </tr>
                <tr>
                  <td>Total Buy Value of Portfolio</td>
                  <td>{PortfolioBenchmarks.totalBuyValue}</td>
                </tr>

                <tr>
                  <td>% change in NIFTY 100 the past year</td>
                  <td>{PortfolioBenchmarks.nifty100}</td>
                </tr>
                <tr>
                  <td>Alpha</td>
                  <td>{PortfolioBenchmarks.alpha.toFixed(2)}</td>
                </tr>
                {/* <tr>
                  <td>Beta</td>
                  <td></td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <div className="col-md-4 ">
            <div>
              <h6 className="" style={{ marginLeft: "40%" }}>
                Value Comparison
              </h6>
            </div>
            <div>
              {!isEmptyObject(BarGraphData) && (
                <BarGraph data1={BarGraphData} title1={"% Holdings"} />
              )}
            </div>
          </div>
          <div className="col-md-4 ">
            <div>
              <h6 className="" style={{ marginLeft: "45%" }}>
                % Holdings
              </h6>
            </div>
            <div>
              {!isEmptyObject(PieChartData) && (
                <PieChart dataP={PieChartData} title1={"% Holdings"} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyPortfolio;
