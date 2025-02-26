import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
//import logo from '/public/unc_logo.png'; 
import './OptionfaciCSS.css';
import './faciresCSS.css'; 
import axios from 'axios';

const OptionFaci = () => {
  
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
          </div>
        </div>
        <div className="navbar">
          <div className="navbar-links">
            <a href="/home" className="navbar-link">Home</a>
            <a href="/activities-tab" className="navbar-link">Activities</a>
            <a href="/" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="#" className="navbar-link">OSA Services</a>
          </div>
        </div>
      </div>

      <div className="main-content4">
        <div className="update-org-container">
          <div className="options-top">
            <h1 className="organizations-name">Facility Reservation Menu</h1>
            <p className="organizations-description">What do you want to do?</p>
          </div>
          <div className="options-tabs">
          <div className="tab">
              <div className="orglist-container">
                <div className="orglist-border">
                <img src="/facilitylogo.png" />
                </div>
              </div>
              <Link className="organizations-links" to="/Guidelines">Reserve a Facility</Link>
              <p className="organizations-desc"> Choose from the approved activity proposals, then request for a facility reservation by accomplishing the facility draft form.</p>
            </div>
            <div className="tab">
              <div className="orglist-container">
                <div className="orglist-border">
                <img src="/returned.png" />
                </div>
              </div>
              <Link className="organizations-links" to={`/optionreturned`}>View List of Returned Requests</Link>
              <p className="organizations-desc"> View the list of returned facility reservation requests, then revise the form for re-evaluation.</p>
            </div>
            <div className="tab">
              <div className="orglist-container">
                <div className="orglist-border">
                <img className = "approvelogo" src="/approvelogo.png" />
                </div>
              </div>
              <Link className="organizations-links" to={`/approvelist`}>View List of Approved Requests</Link>
              <p className="organizations-desc"> Here you can track your tentative facility reservation requests by viewing the list of GBM-approved requests.</p>
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

export default OptionFaci;
