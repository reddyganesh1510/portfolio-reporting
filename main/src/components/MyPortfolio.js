import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "./config";

function MyPortfolio() {
  const [Portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + "portfolio")
      .then((res) => {
        setPortfolio(res.data.data.coins);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    console.log(Portfolio);
  }, [Portfolio]);

  return (
    <div className="container-fluid m-3">
      <div className="row">
        <div className="col-md-6 ">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Stock</th>
                <th scope="col">Quantity</th>
                <th scope="col">Market Price</th>
                <th scope="col">Holding</th>
              </tr>
            </thead>
            <tbody>
              {Portfolio &&
                Portfolio.map((item) => {
                  return (
                    <tr>
                      <td>{item.name}</td>

                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity * item.price}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyPortfolio;
