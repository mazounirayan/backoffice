import React from "react";

import  Image  from "../components/image/logo.png";
import "./single.scss";
import { useAuth } from "../services/AuthService";

function Dashboard2() {
  const { user } = useAuth();
  return (
    <div className="single">
      <div className="singleContainer">
    
        <div className="top">
          <div className="left">
            <h1 className="title">Information</h1>
            <span className="editButton" onClick={() =>console.log("test")}>modifier</span>


            <div className="item">
              <img src={Image} alt="" className="itemImg" />

              <div className="details">
                <h1 className="itemTitle">{user?.nom} {user?.prenom} </h1>
                <div className="detailItem">
                  <span className="itemkey">Email: </span>
                  <span className="itemValue">{user?.email} </span>
                </div>
                <div className="detailItem">
                  <span className="itemkey">num telephone: </span>
                  <span className="itemValue"></span>
                </div>
                <div className="detailItem">
                  <span className="itemkey">Address: </span>
                  <span className="itemValue">paliseau paris</span>
                </div>
                <div className="detailItem">
                  <span className="itemkey">pays: </span>
                  <span className="itemValue">france</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
          </div>
        </div>
        {/* <div className="bottom">
          {/* <h1 className="title">Last Transactions</h1> }
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard2;