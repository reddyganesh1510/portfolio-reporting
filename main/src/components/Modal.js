import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "./config";

export default function Modal() {
  const [Stock, setStock] = useState({
    name: "",
    quantity: 0,
    date: Date.now(),
    price: 0,
  });
  const buyStock = () => {
    let fd = new FormData();
    fd.append("email", "reddyganesh1510@gmail.com");
    fd.append("coin", JSON.stringify(Stock));
    axios
      .post(baseUrl + "buy", fd)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStock = (event) => {
    const { name, value } = event.target;

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
                        <input
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Enter Name of the Stock"
                          onChange={(e) => updateStock(e)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          name="date"
                          type="date"
                          className="form-control"
                          placeholder="Enter Date of the Stock"
                          onChange={(e) => updateStock(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Quantity</label>
                        <input
                          name="quantity"
                          type="number"
                          className="form-control"
                          placeholder="Enter Quantity of the Stock"
                          onChange={(e) => updateStock(e)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Stock price</label>
                        <input
                          name="price"
                          type="number"
                          className="form-control"
                          placeholder="Enter Price of the Stock"
                          onChange={(e) => updateStock(e)}
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
                  className="btn btn-success mx-3"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
