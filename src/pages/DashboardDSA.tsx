import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '/unc_logo.png';

interface Approver {
  employee_id: string;
  user_id: string;
  sy_id: string;
  employee_name: string;
  employee_position: string;
}

interface User {
  user_id: string;
  user_role: string;
}

const DashboardDSA: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  console.log('DashboardAdviser userId:', userId); // Debugging statement

  const [approver, setApprover] = useState<Approver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, approversResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/approvers'),
        ]);

        setUsers(usersResponse.data);
        setApprovers(approversResponse.data);
        console.log('Fetched users:', usersResponse.data);
        console.log('Fetched approvers:', approversResponse.data);
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
    if (userId && users.length > 0 && approvers.length > 0) {
      const user = users.find((u) => u.user_id === userId);
      if (user) {
        console.log('Found user:', user);
        setUserInfo(user);
        if (user.user_role === 'OSA_Director') {
          const adv = approvers.find((a) => a.user_id === userId);
          if (adv) {
            console.log('Found DSA:', adv);
            setApprover(adv);
          } else {
            console.log('DSA not found for userId:', userId);
          }
        }
      } else {
        console.log('User not found for userId:', userId);
      }
    }
  }, [userId, users, approvers]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userInfo) {
    return <div>No user information found.</div>;
  }

  const isDSA = userInfo?.user_role === 'OSA_Director';

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
                    {approver?.employee_name}
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
            <Link to="/adviser-activities-tab" state={{ userId }} className="navbar-link">Activities</Link>
            <Link to="/org-list-dsa" state={{ userId }} className="navbar-link">Organizations</Link>
            <Link to="/accreditation-tab" state={{ userId }} className="navbar-link">Accreditation</Link>
            <Link to="/osa-services-tab" state={{ userId }} className="navbar-link">OSA Services</Link>
          </div>
        </div>
      </div>

      <div className="spacer"></div>

      {isDSA ? (
        <div className="main-content4">
          <div className="update-org-container">
            <div className="options-top">
              <h1 className="organizations-name">OSA Director Dashboard</h1>
              <p className="organizations-description">What do you want to do?</p>
            </div>
            <div className="option-shortcut-boxes">
            <div className="option-tab">
                <div className="orglist-container">
                  <div className="orglist-border shortcutimg">
                    <img src="/shortcut2.png" alt="Evaluate Project Proposals" />
                  </div>
                </div>
                <div className="option-shortcut-text-section">
                  <Link
                    className="organizations-links option-shortcut-name"
                    to="/user-management"
                    state={{ userId: userId, userInfo: userInfo }}
                  >
                    User Management
                  </Link>
                  <p className="organizations-desc option-shortcut-desc">
                    Manage the users of this system.
                  </p>
                </div>
                <img src="/arrow.png" alt="Arrow" className="arrowimg" />
              </div>
              <div className="option-tab">
                <div className="orglist-container">
                  <div className="orglist-border shortcutimg">
                    <img src="/shortcut2.png" alt="Evaluate Project Proposals" />
                  </div>
                </div>
                <div className="option-shortcut-text-section">
                  <Link
                    className="organizations-links option-shortcut-name"
                    to="/org-list-dsa"
                    state={{ userId: userId, userInfo: userInfo }}
                  >
                    View Organization Details & Reports
                  </Link>
                  <p className="organizations-desc option-shortcut-desc">
                    View organizations' activities, members, officers, accreditation history, and activity reports.
                  </p>
                </div>
                <img src="/arrow.png" alt="Arrow" className="arrowimg" />
              </div>
              <div className="option-tab">
                <div className="orglist-container">
                  <div className="orglist-border shortcutimg">
                    <img src="/shortcut2.png" alt="Evaluate Project Proposals" />
                  </div>
                </div>
                <div className="option-shortcut-text-section">
                  <Link
                    className="organizations-links option-shortcut-name"
                    to="/director-approval"
                    state={{ userId: userId, userInfo: userInfo }}
                  >
                    Evaluate Project Proposals
                  </Link>
                  <p className="organizations-desc option-shortcut-desc">
                    Evaluate project proposals submitted by organizations.
                  </p>
                </div>
                <img src="/arrow.png" alt="Arrow" className="arrowimg" />
              </div>
              <div className="option-tab">
                <div className="orglist-container">
                  <div className="orglist-border shortcutimg">
                    <img src="/manage-faci-requests.png" alt="Evaluate Facility Requests" />
                  </div>
                </div>
                <div className="option-shortcut-text-section">
                  <Link
                    className="organizations-links option-shortcut-name"
                    to="/view-application-approval"
                    state={{ userId: userId, userInfo: userInfo }}
                  >
                    Evaluate Uniform Exemption Applications
                  </Link>
                  <p className="organizations-desc option-shortcut-desc">
                    Evaluate uniform exemption applications submitted by students.
                  </p>
                </div>
                <img src="/arrow.png" alt="Arrow" className="arrowimg" />
              </div>
              <div className="option-tab">
                <div className="orglist-container">
                  <div className="orglist-border shortcutimg">
                    <img src="/uep3.png" alt="Evaluate Facility Requests" />
                  </div>
                </div>
                <div className="option-shortcut-text-section">
                  <Link
                    className="organizations-links option-shortcut-name"
                    to="/ueplist"
                    state={{ userId: userId, userInfo: userInfo }}
                  >
                    Students with Uniform Exemption Pass
                  </Link>
                  <p className="organizations-desc option-shortcut-desc">
                    View students with uniform exemption pass for tracking.
                  </p>
                </div>
                <img src="/arrow.png" alt="Arrow" className="arrowimg" />
              </div>
              {/*<div className="option-tab">
                <div className="orglist-container">
                  <div className="orglist-border shortcutimg">
                    <img src="/manageaccomplishment.png" alt="Approve Accomplishment Reports" />
                  </div>
                </div>
                <div className="option-shortcut-text-section">
                  <Link
                    className="organizations-links option-shortcut-name"
                    to="/approvereports"
                    state={{ userId: userId, userInfo: userInfo }}
                  >
                    Review Accomplishment Reports
                  </Link>
                  <p className="organizations-desc option-shortcut-desc">
                    Review accomplishment reports submitted by organizations.
                  </p>
                </div>
                <img src="/arrow.png" alt="Arrow" className="arrowimg" />
              </div>*/}
              <div className="option-tab">
                <div className="orglist-container">
                  <div className="orglist-border shortcutimg">
                    <img src="/managefinancial.png" alt="Approve Accreditation Applications" />
                  </div>
                </div>
                <div className="option-shortcut-text-section">
                  <Link
                    className="organizations-links option-shortcut-name"
                    to="/approveaccreditation"
                    state={{ userId: userId, userInfo: userInfo }}
                  >
                    Approve Accreditation Applications
                  </Link>
                  <p className="organizations-desc option-shortcut-desc">
                    Evaluate accreditation applications submitted by organizations.
                  </p>
                </div>
                <img src="/arrow.png" alt="Arrow" className="arrowimg" />
              </div>
              <div className="option-tab">
                <div className="orglist-container">
                  <div className="orglist-border shortcutimg">
                    <img src="/managefinancial.png" alt="Approve Re-Accreditation Applications" />
                  </div>
                </div>
                <div className="option-shortcut-text-section">
                  <Link
                    className="organizations-links option-shortcut-name"
                    to="/approvereaccreditation"
                    state={{ userId: userId, userInfo: userInfo }}
                  >
                    Approve Re-Accreditation Applications
                  </Link>
                  <p className="organizations-desc option-shortcut-desc">
                    Evaluate re-accreditation applications submitted by organizations.
                  </p>
                </div>
                <img src="/arrow.png" alt="Arrow" className="arrowimg" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="main-content4">
          <div className="update-org-container">
            <div className="options-top">
              <h1 className="organizations-name">Adviser Dashboard</h1>
              <p className="organizations-description">This page is for advisers only. Login to your adviser account.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bottom-spacer"></div>

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

export default DashboardDSA;