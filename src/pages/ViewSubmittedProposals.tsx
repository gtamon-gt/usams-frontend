import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import logo from '/unc_logo.png';
import './ViewSubmittedProposals.css';
import axios from 'axios';

interface Organization {
  org_id: string;
  org_name: string;
  org_type: string;
  org_tag: string;
  org_desc: string;
  org_img: string;
  org_header: string;
  user_id: string;
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
}

interface Comment {
  comment_key: string;
  pros_key: string;
  comment_content: string;
  date: Date;
}

interface User {
  user_id: string;
  user_role: string;
}

const ViewSubmittedProposals: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userInfo } = location.state || {};
  
  const { org_id } = useParams<{ org_id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userInfoState, setUserInfoState] = useState<Organization | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgRes = await axios.get(`http://localhost:8800/organizations/`);
        const org = orgRes.data.find((o: Organization) => o.org_id === org_id);
        setOrganization(org || null);

        const proposalRes = await axios.get(`http://localhost:8800/proposals`);
        const proposals = proposalRes.data.filter((p: Proposal) => p.org_id === org_id);
        setProposals(proposals);

        const commentsRes = await axios.get(`http://localhost:8800/comments`);
        const commentsData = commentsRes.data;
        const commentsMap: { [key: string]: Comment[] } = {};
        proposals.forEach((proposal: Proposal) => {
          commentsMap[proposal.pros_key] = commentsData.filter((comment: Comment) => comment.pros_key === proposal.pros_key);
        });
        setComments(commentsMap);

        const usersRes = await axios.get(`http://localhost:8800/users`);
        setUsers(usersRes.data);

        const organizationsRes = await axios.get(`http://localhost:8800/organizations`);
        setOrganizations(organizationsRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [org_id]);

  useEffect(() => {
      if (userId && users.length > 0 && organizations.length > 0) {
        const user = users.find((u) => u.user_id === userId);
        if (user) {
          console.log('Found user:', user);
          const selectedOrganization = organizations.find((o) => o.user_id === userId);
          if (selectedOrganization) {
            console.log('Found organization:', selectedOrganization);
            setUserInfoState(selectedOrganization);
          } else {
            console.log('Organization not found for userId:', userId);
          }
        } else {
          console.log('User not found for userId:', userId);
        }
      }
    }, [userId, users, organizations]);

  const handleDeleteProposal = async (pros_key: string) => {
    try {
      await axios.delete(`http://localhost:8800/proposals/${pros_key}`);
      setProposals(proposals.filter(proposal => proposal.pros_key !== pros_key));
      alert('Proposal successfully deleted.');
    } catch (err) {
      console.error('Error deleting proposal:', err);
      alert('Failed to delete proposal.');
    }
  };

  const toggleComments = (pros_key: string) => {
    setShowComments(prevState => ({
      ...prevState,
      [pros_key]: !prevState[pros_key]
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

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
            {userInfoState && (
              <>
                <div className="profile-text">
                  <div className="user-name">
                    {userInfoState.org_name}
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
          <h2>Submitted Proposals</h2>
          <p className="instructions">View and manage the proposals submitted by your organization.</p>
        </div>
        <hr className="title-custom-line" />
        {proposals.length > 0 ? (
  <div className="proposals-list">
    <div className="proposal-row header-row">
      <div className="proposal-cell">Nature of Activity</div>
      <div className="proposal-cell">Proposal Type</div>
      <div className="proposal-cell">Project Title</div>
      <div className="proposal-cell">Status</div>
      <div className="proposal-cell">Actions</div>
    </div>
    {proposals.map(proposal => (
      <React.Fragment key={proposal.pros_key}>
        <div className="proposal-row">
          <div className="proposal-cell">{proposal.pros_type}</div>
          <div className="proposal-cell">{proposal.pros_nature}</div>
          <div className="proposal-cell">{proposal.pros_title}</div>
          <div className="proposal-cell">{proposal.status}</div>
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
            <button
              onClick={() => {
                switch (proposal.pros_type) {
                  case 'In Campus':
                    navigate(`/update/in-campus/${org_id}/${proposal.pros_key}`);
                    break;
                  case 'Off-Campus A':
                    navigate(`/update/out-campus-a/${org_id}/${proposal.pros_key}`);
                    break;
                  case 'Off-Campus B':
                    navigate(`/update/out-campus-b/${org_id}/${proposal.pros_key}`);
                    break;
                  default:
                    alert('Unknown proposal nature');
                }
              }}
            >
              Update
            </button>
            <button onClick={() => handleDeleteProposal(proposal.pros_key)}>Delete</button>
            <button onClick={() => toggleComments(proposal.pros_key)}>
              {showComments[proposal.pros_key] ? 'Hide Comments' : 'Show Comments'}
            </button>
          </div>
        </div>
        {showComments[proposal.pros_key] && (
          <div className="comments-section">
            {comments[proposal.pros_key] && comments[proposal.pros_key].length > 0 ? (
              comments[proposal.pros_key].map((comment) => (
                <div key={comment.comment_key} className="comment-item">
                  <p>{comment.comment_content}</p>
                  <p><small>{new Date(comment.date).toLocaleString()}</small></p>
                </div>
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
) : (
  <p>No proposals available for approval.</p>
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

export default ViewSubmittedProposals;
