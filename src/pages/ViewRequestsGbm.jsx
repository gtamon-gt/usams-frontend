import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import './AdviserApproval.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
//import { color } from 'html2canvas/dist/types/css/types/color';

const ViewRequestsGbm = () => {
 
 const location = useLocation();
 // const { userId } = location.state || {};

 const { userId, userInfo } = location.state || {};
  const [gbm, setGbm] = useState(null);
 const [orgId, setOrgId] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gbmResponse] = await Promise.all([
          axios.get('http://localhost:8800/gbm')
        
        ]);

        const gbms = gbmResponse.data;
    

        // Find adviser based on userId
        const foundAdviser = gbms.find((gbm) => gbm.user_id === userId);
        if (!foundAdviser) {
          setError('GBM Officer not found.');
          setLoading(false);
          return;
        }
 
        setGbm(foundAdviser);
console.log(foundAdviser)
   
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

 
  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  const{id} = useParams();
  const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
          try {
            const res = await axios.get("http://localhost:8800/facilityrequestall");
            //console.log(res);
            setBooks(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchAllBooks();
      }, []);

      const handleReject = (books) => {
        setSelectedProposal(books);
        console.log(books);
        setComment('');
      };
      
      const handleSubmitReject = async (e) => {
        e.preventDefault(); // Ensure this runs first to prevent default form submission
      
        if (selectedProposal && comment) {
            try { 
                const response = await axios.post(`http://localhost:8800/gbmreturned/${selectedProposal.faci_id}`, {
                    comment_content: `[${gbm?.gbm_name}] ${comment}` // Ensure correct key name
                });
      
                alert('Form Returned!');
                setSelectedProposal(null);
                setComment('');
                console.log(response.data); // Corrected usage of response
      
                // navigate('/returnedlist'); // Uncomment if navigation is needed
            } catch (err) {
                console.error(err.response?.data || "An error occurred"); // Improved error handling
            }
        } else {
            alert("Please select a proposal and provide a comment.");
        }
      };
      

const handleApprove = (faci_id) =>{
    try{ 
   // e.preventDefault() 
     axios.put('http://localhost:8800/gbmapproved/'+faci_id);
      alert('Form Approved!');
    //  navigate('/returnedlist');
    console.log(response.data);
    }catch(err){
      console.log(err.response.data);
    }

}

  return (
    <div className="main-wrapper">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-text-section">
            <img src={logo} alt="Logo" className="logo-img" />
            <div className="text-section">
              <div className="one-text-section">UNIVERSITY STUDENT AFFAIRS</div>
              <div className="two-text-section">MANAGEMENT SYSTEM</div>
            </div>
          </div>
          <div className="right-section">
            <div className="ellipse-div" />
            <img className="vector-icon" loading="lazy" alt="" src="/vector.svg" />
            <img className="pfp-1-icon" loading="lazy" alt="" src="/default.png" />
          
            {gbm && (
              <>
                <div className="profile-text">
                  <div className="user-name">{gbm.gbm_name}</div>
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
            <a href="/home" className="navbar-link">Home</a>
            <a href="/activities-tab" className="navbar-link">Activities</a>
            <a href="/organizations-tab" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="#" className="navbar-link">OSA Services</a>
          </div>
        </div>
      </div>

      <div className="spacer"></div>
     

<div className="adviser-approval-content">
  <div className="title-top-part">
    <h2>Facility Reservation Requests for Approval</h2>
    <p className="instructions">
      Review and approve or return the facility reservation requests submitted by organizations.
    </p>
  </div>
  <hr className="title-custom-line" />
  {books.length > 0 ? (
    <div className="proposals-list">
      <div className="proposal-row header-row">
        <div className="proposal-cell">Organization Name</div>
        <div className="proposal-cell">Activity Title</div>
        <div className="proposal-cell">Activity Type</div>
        <div className="proposal-cell">Facility</div>
        <div className="proposal-cell">Actions</div>
      </div>
      {books.map((list) => (
        <div key={list.faci_id} className="proposal-row">
          <div className="proposal-cell">
            {list.reqdep}
          </div>
          <div className="proposal-cell">{list.actname}</div>
          <div className="proposal-cell">{list.acttype}</div>
          <div className="proposal-cell"> {list.facility || ""}
      {list.facility && list.otherfacility ? " " : ""}
      {list.otherfacility || ""}</div>
          <div className="proposal-cell ext">
            <button  onClick={() => {
                   
                   navigate(`/viewrequestformgbm/${list.faci_id}`, { state: { userId, userInfo } });

               }
             } >
              View
            </button>
            <button className="approve-button"onClick={() => handleApprove(list.faci_id)}>Approve</button>
            <button className="reject-button" onClick={() => handleReject(list)}>Request Revision</button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No proposals available for approval.</p>
  )}
</div>

{selectedProposal && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Return Reports</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment or feedback..."
            ></textarea>
            <button onClick={handleSubmitReject} className='submitfeedback' style={{
                    
                    color: "white",
                   
                    cursor: "pointer",
                   
                  }}>Submit</button>
            <button onClick={() => setSelectedProposal(null)}>Cancel</button>
          </div>
        </div>
      )}

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
};

export default ViewRequestsGbm;
