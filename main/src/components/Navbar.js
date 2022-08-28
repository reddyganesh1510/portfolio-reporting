import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "./config";
import Modal from "./Modal";

function Navbar() {
  const sendMail = () => {
    axios
      .get(baseUrl + "misc/send-mail")
      .then((res) => {
        console.log(res);
      })
      .catch((errr) => {
        console.log(errr);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand mx-4" href="#">
        Portfolio Reporting
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav  ml-auto mx-4">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              My Portfolio
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={sendMail}>
              Send Mail
            </a>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <Modal />
            </div>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Cash Balance
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">
                USD 100.00
              </a>
              <a class="dropdown-item" href="#">
                INR 7,997.15
              </a>
              <a class="dropdown-item" href="#">
                EUR 100.34
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
