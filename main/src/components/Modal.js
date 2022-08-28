import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "./config";

export default function Modal() {
  const [Stock, setStock] = useState({
    name: "",
    quantity: 1,
    date: Date.now(),
    price: 0,
    availableStocks: [],
    totalBuyValue: 0,
  });
  const buyStock = () => {
    let fd = new FormData();
    fd.append("email", "reddyganesh1510@gmail.com");
    fd.append("coin", JSON.stringify(Stock));
    axios
      .post(baseUrl + "buy", fd)
      .then((res) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sellStock = () => {
    let fd = new FormData();
    fd.append("email", "reddyganesh1510@gmail.com");
    fd.append("coin", JSON.stringify(Stock));
    axios
      .post(baseUrl + "sell", fd)
      .then((res) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    axios
      .get(baseUrl + "misc/stock-names")
      .then((res) => {
        updateStock("availableStocks", res.data.stocks);
        updateStock("name", res.data.stocks[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    updateStock("totalBuyValue", Stock.price * Stock.quantity);
  }, [Stock.name, Stock.quantity, Stock.date, Stock.price]);

  useEffect(() => {
    axios
      .post(baseUrl + "misc/stock-price", Stock)
      .then((res) => {
        if (res.data.stockPrice == null) {
          updateStock("price", 0);
        } else {
          updateStock("price", res.data.stockPrice.price);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Stock.name, Stock.date]);

  const updateStock = (name, value) => {
    setStock((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  return (
    <div>
      <>
        <li className="nav-item">
          <a
            style={{ cursor: "pointer" }}
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Buy/Sell
          </a>
        </li>

        <div
          className="modal fade"
          id="exampleModalCenter"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Buy/Sell
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row p-2">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Stock name</label>
                        <select
                          name="name"
                          value={Stock.name}
                          className="form-control"
                          onChange={(e) =>
                            updateStock(e.target.name, e.target.value)
                          }
                        >
                          {Stock.availableStocks.map((item) => {
                            return <option>{item}</option>;
                          })}
                        </select>
                        {/* <input
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Enter Name of the Stock"
                          onChange={(e) =>
                            updateStock(e.target.name, e.target.value)
                          }
                        /> */}
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          name="date"
                          value={Stock.date}
                          type="date"
                          className="form-control"
                          onChange={(e) =>
                            updateStock(e.target.name, e.target.value)
                          }
                        />
                      </div>
                      <h6>Total value : {Stock.totalBuyValue.toFixed(2)}</h6>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Quantity</label>
                        <input
                          name="quantity"
                          value={Stock.quantity}
                          type="number"
                          className="form-control"
                          onChange={(e) =>
                            updateStock(e.target.name, e.target.value)
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Stock price</label>
                        <input
                          name="price"
                          type="number"
                          className="form-control"
                          value={Stock.price}
                          disabled
                          onChange={(e) =>
                            updateStock(e.target.name, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={buyStock}
                  disabled={Stock.price > 0 ? false : true}
                  className="btn btn-success mx-3"
                >
                  Buy
                </button>

                {/* <button
                  type="button"
                  onClick={sellStock}
                  disabled={Stock.price > 0 ? false : true}
                  className="btn btn-danger"
                >
                  Sell
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
