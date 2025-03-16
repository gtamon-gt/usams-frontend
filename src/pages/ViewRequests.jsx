
import './faciformCSS.css'; 
import React from 'react'
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import './AdviserApproval.css';
import './ViewRequests.css';


const ViewRequests = () => {

     const location = useLocation();
      const navigate = useNavigate();
      const { userId, userInfo } = location.state || {};
      const [org_id, setOrg_id] = useState(null);
       const [orgName, setOrgName] = useState(''); 
     const [reqdep, setReqdep] = useState('');
    const [books, setBooks] = useState([]);
    const [showComments, setShowComments] = useState({});
    const [comments, setComments] = useState({});
 const [feedback, setFeedback] = useState('');
   const [adviser, setAdviser] = useState(''); 

    const [searchTerm, setSearchTerm] = useState('');
          const handleSearch = (e) => {
           setSearchTerm(e.target.value);
         };
   

   useEffect(() => {
    const fetchAllBooks = async () => {
      try {

        const res = await axios.get("http://localhost:8800/facilityrequestorg");
        const filteredProposals = res.data.filter((p1) => p1.org_id === org_id);
        setBooks(filteredProposals);
        console.log(filteredProposals);
      //  setLoading(false);

      const commentsRes = await axios.get("http://localhost:8800/commentsfaci");
      const commentsData = commentsRes.data;

      // Map comments to their corresponding proposals
      const commentsMap = {};
      filteredProposals.forEach((list) => {
        commentsMap[list.faci_id] = commentsData.filter(
          (comment) => comment.faci_id === list.faci_id
        );
      });

      setComments(commentsMap);
      console.log (commentsMap);

      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
 
  }, [org_id]); 

      useEffect(() => {
        const fetchOrganizations = async () => {
          try {
            const response = await axios.get('http://localhost:8800/organizations/');
            const organizations = response.data;
            const matchedOrg = organizations.find(org => org.user_id === userId);
            if (matchedOrg) {
              setOrg_id(matchedOrg.org_id);
              setOrgName(matchedOrg.org_name);
              setReqdep(matchedOrg.org_name); 
              console.log('Matched Organization:', matchedOrg);
    
              // fetch advisers and find the matching adviser
              const advisersResponse = await axios.get('http://localhost:8800/advisers/');
              const advisers = advisersResponse.data;
              const matchedAdviser = advisers.find(adviser => adviser.adv_id === matchedOrg.adv_id);
              if (matchedAdviser) {
                setAdviser(matchedAdviser.adv_name); // set the adviser's name
                console.log('Adviser found');
              } else {
                console.log('No matched adviser found');
              }
            } else {
              console.log('No matching organization found');
            }
          } catch (error) {
            console.error('Error fetching organizations:', error);
          }
        };
    
        if (userId) {
          fetchOrganizations();
        }
      }, [userId]);

    
    
      const handleSignOut = () => {
        navigate('/', { state: { userId: null } });
      };
     

      const toggleComments = (books) => {

        setShowComments(prevState => ({
          ...prevState,
          [books]: !prevState[books]
          
        }));
        console.log(books);
      };

      //  navigate(`/updatefaci/${orgId}/${list.id}`);

      const filteredBooks = books.filter(book => 
        book.reqdep.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.actname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.otherfacility.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.facility && book.facility.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    

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

    
      <div className="spacer"></div>

<div className="adviser-approval-content">
  <div className="title-top-part">
    <h2>Submitted Facility Reservation Requests
    <input
            type="text" 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={handleSearch} 
            className="search-inputorg"
          />
    </h2>
    <p className="instructions">
      Track the approval status of the facility reservation requests submitted by your organization.
    </p>
  </div>
  <hr className="title-custom-line" />
  {filteredBooks.length > 0 ? (
    <div className="proposals-list">
      <div className="proposal-row header-row">
        <div className="proposal-cell">Activity Title</div>
        <div className="proposal-cell">Activity Type</div>
        <div className="proposal-cell">Facility</div>
        <div className="proposal-cell">Status</div>
        <div className="proposal-cell">Actions</div>
      </div>
      {filteredBooks.map((list) => (
        <div key={list.faci_id} className="proposal-row">
          <div className="proposal-cell">
            {list.actname}
          </div>
          <div className="proposal-cell">{list.acttype}</div>
          <div className="proposal-cell-facility">
  {list.facility !== "Others:" && list.facility} 
  {list.otherfacility && (list.facility !== "Others:" ? " | " : "")}
  {list.otherfacility}
</div>
          <div className="proposal-cell">{list.status} </div>
          <div className="proposal-cell ext">
            <button  onClick={() => {
                          
                          navigate(`/previewfaci/${org_id}/${list.faci_id}`, { state: { userId, userInfo } });
                           
                          }
                        }
            >
              View
            </button>
            <button 
              onClick={() => {
                         

                              navigate(`/updatefaci/${org_id}/${list.faci_id}`, { state: { userId, userInfo } });
                             
                          }
                        }
              >Update</button>
            <button >Delete</button>
            <button
                     
                        onClick={() => toggleComments(list.faci_id)}
                      >
                        {showComments[list.faci_id] ? 'Hide Comments' : 'Show Comments'}
              </button>
          
          
          </div>
          {showComments[list.faci_id] && (
                    <tr>
                      <td colSpan={5}>
                        <div className="comments-section">
                          {comments[list.faci_id] && comments[list.faci_id].length > 0 ? (
                            comments[list.faci_id].map((comment) => (
                              <div key={comment.comment_key} className="comment-item">
                                <p><strong>{comment.comment_content}</strong></p>
                                <p><small>{new Date(comment.date).toLocaleString()}</small></p>
                              </div>
                            ))
                          ) : (
                            <p>No comments available.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
        </div>
        
      ))}
      
    </div>
    
  ) : (
    <p>No proposals available</p>
  )}
  
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

export default ViewRequests;
