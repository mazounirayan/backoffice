import React from "react";


import "./single.scss";

function Dashboard2() {
  return (
    <div className="single">
      <div className="singleContainer">
    
        <div className="top">
          <div className="left">
            <h1 className="title">Information</h1>
            <span className="editButton">modofier</span>

            <div className="item">
              <img src="/assets/person.jpg" alt="" className="itemImg" />

              <div className="details">
                <h1 className="itemTitle">rayan maze</h1>
                <div className="detailItem">
                  <span className="itemkey">Email: </span>
                  <span className="itemValue">rayan@gmail.com</span>
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