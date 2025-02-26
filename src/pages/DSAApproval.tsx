import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import './AdviserApproval.css';
import axios from 'axios';

interface User {
  user_id: string;
  user_role: string;
  user_name: string;
}

interface Organization {
  org_id: string;
  org_name: string;
  org_type: string;
  org_tag: string;
  org_desc: string;
  adv_id: string;
  dean_id: string;
  sy_id: string;
  org_img: string;
  org_header: string;
}

interface Proposal {
  pros_key: string;
  org_id: string;
  pros_type: string;
  pros_nature: string;
  pros_proponent: string;
  pros_title: string;
  pros_date: string;
  pros_venue: string;
  pros_objectives: string;
  pros_outcomes: string;
  pros_rationale: string;
  pros_participants: string;
  budget_total: number;
  status: string;
  step_at: number;
  on_revision: number;
}

interface Approver {
  employee_id: string;
  user_id: string;
  sy_id: string;
  employee_name: string;
  employee_position: string;
}

const DSAApproval: React.FC = () => {
  const location = useLocation();
  const { userId } = location.state || {};

  const [approver, setApprover] = useState<Approver | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [organizationsResponse, proposalsResponse, approversResponse] = await Promise.all([
          axios.get('http://localhost:8800/organizations'),
          axios.get('http://localhost:8800/proposals'),
          axios.get('http://localhost:8800/approvers'),
        ]);

        const organizationsData = organizationsResponse.data;
        const proposalsData = proposalsResponse.data;
        const approversData = approversResponse.data;

        setOrganizations(organizationsData);
        setProposals(proposalsData.filter((proposal: Proposal) =>
          proposal.status !== 'Fully approved' &&
          proposal.on_revision === 0 && (
            (proposal.pros_type === 'In Campus' && proposal.pros_nature === 'Co-Curricular' && proposal.step_at === 4) ||
            (proposal.pros_type === 'In Campus' && proposal.pros_nature === 'Extra-Curricular' && proposal.step_at === 3) ||
            (proposal.pros_type === 'Off-Campus A' && proposal.step_at === 4)
          )
        ));

        // Find the director from approvers where employee_position is 'OSA Director'
        const approverData = approversData.find((approver: Approver) => approver.employee_position === 'Dean for Student and Alumni Affairs');
        setApprover({
          employee_id: approverData?.employee_id,
          user_id: approverData?.user_id,
          sy_id: approverData?.sy_id,
          employee_name: approverData?.employee_name,
          employee_position: approverData?.employee_position,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleApprove = async (pros_key: string) => {
    try {
      await axios.put(`http://localhost:8800/proposals/approve/dsaa/${pros_key}`);
      setProposals(proposals.map(proposal => proposal.pros_key === pros_key ? { ...proposal, status: 'Approved by Dean for Student and Alumni Affairs' } : proposal));
      alert('Proposal approved successfully!');
      fetchProposals(); 
    } catch (err) {
      console.error('Error approving proposal:', err);
      alert('Failed to approve proposal.');
    }
  };

  const handleReject = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setComment('');
  };

  const handleSubmitReject = async () => {
    if (selectedProposal && comment) {
      try {
        await axios.post(`http://localhost:8800/proposals/reject/osa/${selectedProposal.pros_key}`, {
          comment: `[${approver?.employee_name}] ${comment}`
        });
        setProposals(proposals.map(proposal => proposal.pros_key === selectedProposal.pros_key ? { ...proposal, status: 'Rejected by Dean for Student and Alumni Affairs' } : proposal));
        setSelectedProposal(null);
        setComment('');
        alert('Proposal rejected and comment added successfully!');
        fetchProposals(); 
      } catch (err) {
        console.error('Error rejecting proposal:', err);
        alert('Failed to reject proposal.');
      }
    }
  };

  const fetchProposals = async () => {
    try {
      const proposalsResponse = await axios.get('http://localhost:8800/proposals');
      const proposalsData = proposalsResponse.data;

      setProposals(proposalsData.filter((proposal: Proposal) =>
        proposal.status !== 'Fully approved' &&
        proposal.on_revision === 0 && (
          (proposal.pros_type === 'In Campus' && proposal.pros_nature === 'Co-Curricular' && proposal.step_at === 4) ||
          (proposal.pros_type === 'In Campus' && proposal.pros_nature === 'Extra-Curricular' && proposal.step_at === 3) ||
          (proposal.pros_type === 'Off-Campus A' && proposal.step_at === 4)
        )
      ));
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('Failed to load proposals.');
    }
  };

  const handleSignOut = () => {
    // Reset the userId in the location state
    navigate('/', { state: { userId: null } });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
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
            {approver && (
              <>
                <div className="profile-text">
                  <div className="user-name">
                    {approver.employee_name}
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
          <h2>Proposals for Approval</h2>
          <p className="instructions">Review and approve or reject the proposals submitted by various organizations.</p>
        </div>
        <hr className="title-custom-line" />
        {proposals.length > 0 ? (
          <div className="proposals-list">
            <div className="proposal-row header-row">
              <div className="proposal-cell">Organization Name</div>
              <div className="proposal-cell">Proposal Title</div>
              <div className="proposal-cell">Type</div>
              <div className="proposal-cell">Nature</div>
              <div className="proposal-cell">Actions</div>
            </div>
            {proposals.map(proposal => (
              <div key={proposal.pros_key} className="proposal-row">
                <div className="proposal-cell">{organizations.find(org => org.org_id === proposal.org_id)?.org_name}</div>
                <div className="proposal-cell">{proposal.pros_title}</div>
                <div className="proposal-cell">{proposal.pros_type}</div>
                <div className="proposal-cell">{proposal.pros_nature}</div>
                <div className="proposal-cell ext">
                  <button
                    onClick={() => {
                      switch (proposal.pros_type) {
                        case 'In Campus':
                          navigate(`/preview/${proposal.pros_key}`);
                          break;
                        case 'Off-Campus A':
                          navigate(`/preview/out-campus-a/${proposal.pros_key}`);
                          break;
                        case 'Off-Campus B':
                          navigate(`/preview/out-campus-b/${proposal.pros_key}`);
                          break;
                        default:
                          alert('Proposal not found');
                      }
                    }}
                  >
                    View
                  </button>
                  <button className="approve-button" onClick={() => handleApprove(proposal.pros_key)}>Approve</button>
                  <button className="reject-button" onClick={() => handleReject(proposal)}>Reject</button>
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
            <h3>Reject Proposal</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment or feedback..."
            ></textarea>
            <button onClick={handleSubmitReject}>Submit</button>
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

export default DSAApproval;