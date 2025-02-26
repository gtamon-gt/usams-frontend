import './faciformCSS.css'; 
import React from 'react'
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const ApproveList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, userInfo } = location.state || {};
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
          try {
            const res = await axios.get("http://localhost:8800/gbmapprovelist");
            //console.log(res);
            setBooks(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchAllBooks();
      }, []);

  return (
    <div className="main-wrapper">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-text-section">
            <img src="/unc_logo.png" alt="Logo" className="logo-img" />
            <div className="text-section">
              <div className="one-text-section">UNIVERSITY STUDENT AFFAIRS</div>
              <div className="two-text-section">MANAGEMENT SYSTEM</div>
            </div>
          </div>
          <div className="right-section">
            <div className="ellipse-div" />
            <img className="vector-icon" loading="lazy" alt="" src="/vector.svg" />
            <img className="pfp-1-icon" loading="lazy" alt="" src="/default.png" />
            {userInfo && (
              <>
                <div className="profile-text">
                  <div className="user-name">
                    {userInfo.org_name}
                  </div>
                  <button className="sign-out-button" onClick={handleSignOut}>
                    SIGN OUT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="navbar">
          <div className="navbar-links">
            <a href="#" className="navbar-link">Home</a>
            <a href="#" className="navbar-link">Activities</a>
            <a href="#" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="#" className="navbar-link">OSA Services</a>
          </div>
        </div>
      </div>

      <div className="main-content">
      
      <div className="text1faci">List of Approved Facility Reservation Requests 
          <a href='optiongbm'className="approvedmenu"   >  Menu Page  </a></div>
      <hr className="hr1"></hr>
      <div className="text2list"></div>
      <div className="main-containerproposals"> 

      <div className="row1proposals"> 

      <div className="proposallist">
        {books.map((list) => (
          <div key={list.id} className="list">
          
          <div className="actnamelist">{list.actname}</div>
            <div className="datelist">{list.date}</div>
            <br></br>
            
            <hr className="hrlist"></hr>

            <div className="facilityy">
              {list.facility || ""}
              {list.facility && list.otherfacility ? " " : ""}
              {list.otherfacility || ""}
            </div>
            <div className="repnamelist">{list.reqdep}</div>
            <Link className='linktodata'to={`/approvedform/${list.id}`}>
              <button className='viewbutton'>View</button>
            </Link>
        </div>
        ))}
    </div>
      </div>
      </div>
      </div>

      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <div className="foot1">09561301775 | 09071566898</div>
            <div className="foot1">J. Hernandez Ave, Naga City 4400</div>
            <div className="foot1">info@unc.edu.ph</div>
          </div>
          <div className="footer-column2">
            <img src="/osa_logo.png" alt="Logo" className="logo-img2" />
            <div>
              <div className="unc1">UNIVERSITY OF NUEVA CACERES</div>
              <div className="unc2">STUDENT AFFAIRS</div>
            </div>
          </div>
          <div className="footer-column footer-column-follow">
            <div className="followtext">Follow Us</div>
            <div>
              <img src="/fb.png" alt="Facebook" />
              <img src="/email.png" alt="Email" />
            </div>
          </div>
        </div>
        <div className="footer-row thin">
          <div>Copyright © 2023. University of Nueva Caceres. All Rights Reserved</div>
          <div>Privacy Policy</div>
        </div>
      </div>
    </div>
  );
}

export default ApproveList;