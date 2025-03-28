import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import './ProposalAdviserApproval.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewRequestsAdviser = () => {
  const location = useLocation();
  const { userId, userInfo } = location.state || {};
  const [adviser, setAdviser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchBooks = async () => {
    try {
      const [advisersResponse, organizationsResponse, proposalsResponse] = await Promise.all([
        axios.get('http://localhost:8800/advisers'),
        axios.get('http://localhost:8800/organizations'),
        axios.get('http://localhost:8800/facilityrequestadviser'),
      ]);

      const advisers = advisersResponse.data;
      const organizationsData = organizationsResponse.data;
      const proposalsData = proposalsResponse.data;

      // Find adviser based on userId
      const foundAdviser = advisers.find((adv) => adv.user_id === userId);
      if (!foundAdviser) {
        setError('Adviser not found.');
        setLoading(false);
        return;
      }

      setAdviser(foundAdviser);

      // Get organizations advised by the adviser
      const advisedOrganizations = organizationsData.filter(
        (org) => org.adv_id === foundAdviser.adv_id
      );
      setOrganizations(advisedOrganizations);

      // Get proposals for the advised organizations with status "Pending"
      const orgIds = advisedOrganizations.map((org) => org.org_id);
      const filteredProposals = proposalsData.filter(
        (proposal) =>
          orgIds.includes(proposal.org_id) && proposal.status === 'Pending'
      );
      setBooks(filteredProposals);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [userId]);

  const handleApprove = async (faci_id) => {
    try {
      await axios.put('http://localhost:8800/adviserapproved/' + faci_id);
      alert('Form Approved!');
      fetchBooks(); // Refetch the books after approval
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleReject = (book) => {
    setSelectedProposal(book);
    setComment('');
  };

  const handleSubmitReject = async (e) => {
    e.preventDefault();

    if (selectedProposal && comment) {
      try {
        await axios.post(`http://localhost:8800/adviserreturned/${selectedProposal.faci_id}`, {
          comment_content: `[${adviser?.adv_name}] ${comment}`,
        });

        alert('Form Returned!');
        setSelectedProposal(null);
        setComment('');
        fetchBooks(); // Refetch the books after rejection
      } catch (err) {
        console.error(err.response?.data || 'An error occurred');
      }
    } else {
      alert('Please select a proposal and provide a comment.');
    }
  };

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const filteredBooks = books.filter(
    (book) =>
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
            {adviser && (
              <>
                <div className="profile-text">
                  <div className="user-name">{adviser.adv_name}</div>
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
          <h2>Facility Reservation Requests for Approval
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-inputgbm"
            />
          </h2>
          <p className="instructions">
            Review and approve or return the facility reservation requests submitted by your advised organizations.
          </p>
        </div>
        <hr className="title-custom-line" />
        {filteredBooks.length > 0 ? (
          <div className="proposals-list">
            <div className="proposal-row header-row">
              <div className="proposal-cell">Organization Name</div>
              <div className="proposal-cell">Activity Title</div>
              <div className="proposal-cell">Activity Type</div>
              <div className="proposal-cell">Facility</div>
              <div className="proposal-cell">Actions</div>
            </div>
            {filteredBooks.map((list) => (
              <div key={list.faci_id} className="proposal-row">
                <div className="proposal-cell">{list.reqdep}</div>
                <div className="proposal-cell">{list.actname}</div>
                <div className="proposal-cell">{list.acttype}</div>
                <div className="proposal-cell-facility">
                  {list.facility !== 'Others:' && list.facility}
                  {list.otherfacility && (list.facility !== 'Others:' ? ' | ' : '')}
                  {list.otherfacility}
                </div>
                <div className="proposal-cell ext">
                  <button
                    onClick={() => {
                      navigate(`/viewrequestform/${list.faci_id}`, { state: { userId, userInfo } });
                    }}
                  >
                    View
                  </button>
                  <button className="approve-button" onClick={() => handleApprove(list.faci_id)}>Approve</button>
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
            <button onClick={handleSubmitReject} className='submitfeedback' style={{ cursor: 'pointer' }}>Submit</button>
            <button onClick={() => setSelectedProposal(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="spacer"></div>

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

export default ViewRequestsAdviser;
