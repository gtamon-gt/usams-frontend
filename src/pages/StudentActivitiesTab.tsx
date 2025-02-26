import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '/unc_logo.png';
import './StudentActivitiesTab.css';

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

interface User {
  user_id: string;
  user_role: string;
}

interface Student {
  stud_id: string;
  user_id: string;
  stud_dept: string;
  stud_name: string;
  stud_img: string;
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
  user_id: string;
}

const StudentActivitiesTab: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  console.log('StudentActivitiesTab userId:', userId); // Debugging statement

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proposalsResponse, usersResponse, studentsResponse, organizationsResponse] = await Promise.all([
          axios.get('http://localhost:8800/proposals'),
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/students'),
          axios.get('http://localhost:8800/organizations'),
        ]);

        const proposalsData = proposalsResponse.data;
        const usersData = usersResponse.data;
        const studentsData = studentsResponse.data;
        const organizationsData = organizationsResponse.data;

        setProposals(proposalsData);
        setOrganizations(organizationsData);

        // Find user information
        const user = usersData.find((u: User) => u.user_id === userId);
        if (user) {
          setUserInfo(user);
        }

        // Find student information
        const stud = studentsData.find((s: Student) => s.user_id === userId);
        if (stud) {
          setStudent(stud);
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  const handleViewEvent = (prosKey: string) => {
    navigate('/event-details', { state: { prosKey } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const isStudent = userInfo?.user_role === 'Student';

  return (
    <div className="student-activities-wrapper">
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
                    {student?.stud_name}
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
            <Link to={isStudent ? "/student-activities-tab" : "/activities-tab"} state={{ userId }} className="navbar-link">Activities</Link>
            <Link to={isStudent ? "/organizationlist" : "/organizations-tab"} state={{ userId }} className="navbar-link">Organizations</Link>
            <Link to="/accreditation-tab" state={{ userId }} className="navbar-link">Accreditation</Link>
            <Link to="/osa-services-tab" state={{ userId }} className="navbar-link">OSA Services</Link>
          </div>
        </div>
      </div>

      <div className="spacer"></div>
      <div className="student-activities-content">
      <div className="title-top-part">
          <h2>Student Activities</h2>
          <p className="instructions">The list shows the approved student activities organized by accredited organizations</p>
        </div>
        <hr className="title-custom-line" />

        <div className="activities-list">
          {proposals.map(proposal => {
            const organization = organizations.find(org => org.org_id === proposal.org_id);
            return (
              <div key={proposal.pros_key} className="activity-card">
                <img src="/default_header.jpg" alt="Event" className="event-header-img" />
                <div className="event-tags">
                  <div className="event-tag">{new Date(proposal.pros_date).toLocaleDateString()}</div>
                  <div className="event-tag">{proposal.pros_venue}</div>
                  <div className="event-tag">{proposal.pros_participants}</div>
                </div>
                <div className="event-details">
                  <h2 className="event-title">{proposal.pros_title}</h2>
                  <p className="event-rationale">{proposal.pros_rationale}</p>
                </div>
                <div className="event-org">
                  {organization && (
                    <>
                      <img src={`http://127.0.0.1/uploads/${organization.org_img}`} alt={organization.org_name} className="org-img-activities" />
                      <div className="org-name-activities">{organization.org_name}</div>
                    </>
                  )}
                </div>
                <button className="view-button-activities" onClick={() => handleViewEvent(proposal.pros_key)}>View</button>
              </div>
            );
          })}
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

export default StudentActivitiesTab;
