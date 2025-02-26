import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
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

interface User {
  user_id: string;
  user_role: string;
}

const OptionActivities: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  console.log('OptionActivities userId:', userId); // Debugging statement

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userInfo, setUserInfo] = useState<Organization | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, organizationsResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/organizations'),
        ]);

        setUsers(usersResponse.data);
        setOrganizations(organizationsResponse.data);
        console.log('Fetched users:', usersResponse.data);
        console.log('Fetched organizations:', organizationsResponse.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userId && users.length > 0 && organizations.length > 0) {
      const user = users.find((u) => u.user_id === userId);
      if (user) {
        console.log('Found user:', user);
        const organization = organizations.find((o) => o.user_id === userId);
        if (organization) {
          console.log('Found organization:', organization);
          setUserInfo(organization);
          setOrganization(organization);
        } else {
          console.log('Organization not found for userId:', userId);
        }
      } else {
        console.log('User not found for userId:', userId);
      }
    }
  }, [userId, users, organizations]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!organization) {
    return <div>No organization found.</div>;
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
            <Link to="/home" state={{ userId }} className="navbar-link">Home</Link>
            <Link to="/activities-tab" state={{ userId }} className="navbar-link">Activities</Link>
            <Link to="/organizations-tab" state={{ userId }} className="navbar-link">Organizations</Link>
            <Link to="#" state={{ userId }} className="navbar-link">Accreditation</Link>
            <Link to="#" state={{ userId }} className="navbar-link">OSA Services</Link>
          </div>
        </div>
      </div>

      <div className="spacer"></div>

      <div className="main-content4">
      <div className="update-org-container">
        <div className="options-top">
            <h1 className="organizations-name">Activities Menu</h1>
            <p className="organizations-description">What do you want to do?</p>
          </div>
        <div className="option-shortcut-boxes">
          <div className="option-tab">
            <div className="orglist-container">
              <div className="orglist-border shortcutimg">
                <img src="/propose-project.png" alt="Shortcut 1" />
              </div>
            </div>
            <div className="option-shortcut-text-section">
              <Link
                className="organizations-links option-shortcut-name"
                to={`/proposals-options/${organization.org_id}`}
                state={{ userId: userId, userInfo: userInfo }}
              >
                Send a Project Proposal
              </Link>
              <p className="organizations-desc option-shortcut-desc">
                Submit your in-campus or off-campus activity proposal to the approvers.
              </p>
            </div>
            <img src="/arrow.png" alt="Arrow" className="arrowimg" />
          </div>
          <div className="option-tab">
            <div className="orglist-container">
              <div className="orglist-border shortcutimg">
                <img src="/manageproposal.png" alt="Shortcut 2" />
              </div>
            </div>
            <div className="option-shortcut-text-section">
              <Link
                className="organizations-links option-shortcut-name"
                to={`/view-proposals/${organization.org_id}`}
                state={{ userId: userId, userInfo: userInfo }}
              >
                Manage Submitted Proposals
              </Link>
              <p className="organizations-desc option-shortcut-desc">
                View and manage the proposals submitted by your organization.
              </p>
            </div>
            <img src="/arrow.png" alt="Arrow" className="arrowimg" />
          </div>
          <div className="option-tab">
            <div className="orglist-container">
              <div className="orglist-border shortcutimg">
                <img src="/facilitylogo.png" alt="Shortcut 3" />
              </div>
            </div>
            <div className="option-shortcut-text-section">
              <Link
                className="organizations-links option-shortcut-name"
                to={`/guidelines/${organization.org_id}`}
                state={{ userId: userId, userInfo: userInfo }}
              >
                Reserve a Facility
              </Link>
              <p className="organizations-desc option-shortcut-desc">
                Request a facility reservation for your approved activity proposals.
              </p>
            </div>
            <img src="/arrow.png" alt="Arrow" className="arrowimg" />
          </div>
          <div className="option-tab">
            <div className="orglist-container">
              <div className="orglist-border shortcutimg">
                <img src="/manage-faci-requests.png" alt="Shortcut 4" />
              </div>
            </div>
            <div className="option-shortcut-text-section">
              <Link
                className="organizations-links option-shortcut-name"
                to={`/facirequests/${organization.org_id}`}
                state={{ userId: userId, userInfo: userInfo }}
              >
                Manage Facility Requests
              </Link>
              <p className="organizations-desc option-shortcut-desc">
                View and manage your facility reservation requests.
              </p>
            </div>
            <img src="/arrow.png" alt="Arrow" className="arrowimg" />
          </div>
          <div className="option-tab">
            <div className="orglist-container">
              <div className="orglist-border shortcutimg">
                <img src="/facilitylogo.png" alt="Shortcut 5" />
              </div>
            </div>
            <div className="option-shortcut-text-section">
              <Link
                className="organizations-links option-shortcut-name"
                to={`/viewfacility/${organization.org_id}`}
                state={{ userId: userId, userInfo: userInfo }}
              >
                View Reserved Facilities
              </Link>
              <p className="organizations-desc option-shortcut-desc">
                View reserved facilities to know the status of each facilities.
              </p>
            </div>
            <img src="/arrow.png" alt="Arrow" className="arrowimg" />
          </div>
          <div className="option-tab">
            <div className="orglist-container">
              <div className="orglist-border shortcutimg">
                <img src="/accomplishment.png" alt="Shortcut 6" />
              </div>
            </div>
            <div className="option-shortcut-text-section">
              <Link
                className="organizations-links option-shortcut-name"
                to={`/view-activities/${organization.org_id}`}
                state={{ userId: userId, userInfo: userInfo }}
              >
                Generate Accomplishment Report
              </Link>
              <p className="organizations-desc option-shortcut-desc">
                Submit an accomplishment report for your organization's activities.
              </p>
            </div>
            <img src="/arrow.png" alt="Arrow" className="arrowimg" />
          </div>
          <div className="option-tab">
            <div className="orglist-container">
              <div className="orglist-border shortcutimg">
                <img src="/manageaccomplishment.png" alt="Shortcut 7" />
              </div>
            </div>
            <div className="option-shortcut-text-section">
              <Link
                className="organizations-links option-shortcut-name"
                to={`/viewreports/${organization.org_id}`}
                state={{ userId: userId, userInfo: userInfo }}
              >
                Manage Accomplishment Reports
              </Link>
              <p className="organizations-desc option-shortcut-desc">
                View and manage your organization's accomplishment reports.
              </p>
            </div>
            <img src="/arrow.png" alt="Arrow" className="arrowimg" />
          </div>
        </div>
      </div>
      </div>

      <div className="bottom-spacer"></div>

      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <div className="foot1"> 09561301775 | 09071566898</div>
            <div className="foot1">J. Hernandez Ave, Naga City 4400</div>
            <div className="foot1">info@unc.edu.ph</div>
          </div>
          <div className="footer-column2">
            <img src="/osa_logo.png" alt="Logo" className="logo-img2" />
            <div>
              <div className="unc1"> UNIVERSITY OF NUEVA CACERES </div>
              <div className="unc2"> STUDENT AFFAIRS</div>
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

export default OptionActivities;