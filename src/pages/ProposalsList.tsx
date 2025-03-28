import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import './ProposalAdviserApproval.css'; // Reuse the existing CSS
import axios from 'axios';

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

const ProposalsList: React.FC = () => {
  const location = useLocation();
  const { userInfo } = location.state || {};

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [organizationsResponse, proposalsResponse] = await Promise.all([
          axios.get('http://localhost:8800/organizations'),
          axios.get('http://localhost:8800/proposals'),
        ]);

        const organizationsData = organizationsResponse.data;
        const proposalsData = proposalsResponse.data;

        // Set organizations
        setOrganizations(organizationsData);

        // Find proposals for the advised organizations
        const orgIds = organizationsData.map((org: Organization) => org.org_id);
        const filteredProposals = proposalsData.filter((proposal: Proposal) =>
          orgIds.includes(proposal.org_id)
        );

        // Sort proposals by date in descending order
        filteredProposals.sort((a: Proposal, b: Proposal) =>
          new Date(b.pros_date).getTime() - new Date(a.pros_date).getTime()
        );

        // Format the date as a string
        const formattedProposals = filteredProposals.map((proposal: Proposal) => ({
          ...proposal,
          pros_date: new Date(proposal.pros_date).toLocaleDateString(),
        }));

        setProposals(formattedProposals);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = () => {
    // reset the userId in the location state
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
          <h2>All Sent Proposals for Approval</h2>
          <p className="instructions">View all proposals submitted by your advised organizations.</p>
        </div>
        <hr className="title-custom-line" />
        {proposals.length > 0 ? (
          <div className="proposals-list">
            <div className="proposal-row header-row-proposals-list">
              <div className="proposal-cell">Organization Name</div>
              <div className="proposal-cell">Activity Title</div>
              <div className="proposal-cell">Facility</div>
              <div className="proposal-cell">Date</div>
              <div className="proposal-cell">Status</div>
            </div>
            {proposals.map((proposal: Proposal) => (
              <div key={proposal.pros_key} className="proposal-row">
                <div className="proposal-cell">{organizations.find(org => org.org_id === proposal.org_id)?.org_name}</div>
                <div className="proposal-cell">{proposal.pros_title}</div>
                <div className="proposal-cell">{proposal.pros_venue}</div>
                <div className="proposal-cell">{proposal.pros_date}</div>
                <div className="proposal-cell">{proposal.status}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No proposals available.</p>
        )}
      </div>

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

export default ProposalsList;
