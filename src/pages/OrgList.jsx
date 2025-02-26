import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '/unc_logo.png';
import './OrgList.css';
import search from '/search.svg';

const OrgList = () => {
  const [organizations, setOrgs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, studentsResponse, organizationsResponse, approversResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/students'),
          axios.get('http://localhost:8800/organizations'),
          axios.get('http://localhost:8800/approvers'),
        ]);

        setUsers(usersResponse.data);
        setStudents(studentsResponse.data);
        setOrgs(organizationsResponse.data);
        setApprovers(approversResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userId && users.length > 0 && students.length > 0 && organizations.length > 0) {
      const user = users.find((u) => u.user_id === userId);
      if (user) {
        setUserInfo(user);
        if (user.user_role === 'Organization') {
          const org = organizations.find((o) => o.user_id === userId);
          if (org) {
            setOrganization(org);
          }
        } else if (user.user_role === 'Student') {
          const stud = students.find((s) => s.user_id === userId);
          if (stud) {
            setStudent(stud);
          }
        }
      }
    }
  }, [userId, users, students, organizations]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagClick = (tag) => {
    setActiveTag(tag === activeTag ? '' : tag);
  };

  const handleViewClick = (org_id) => {
    navigate(`/organization/${org_id}`);
  };

  const filteredOrgs = organizations.filter(org => {
    const matchesSearchTerm = org.org_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = activeTag ? (org.org_type === activeTag || org.org_tag.includes(activeTag)) : true;
    return matchesSearchTerm && matchesTag;
  });

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  const isStudent = userInfo?.user_role === 'Student';
  const isOrganization = userInfo?.user_role === 'Organization';

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
                    {userInfo.user_role === 'Organization' ? organization?.org_name : student?.stud_name}
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

      <div className="main-content">
        <div className="title-top-part">
          <h2>Organization List</h2>
          <p className="instructions">The list shows the current accredited organizations, fraternities, and sororities for the school year.</p>
        </div>
        <hr className="title-custom-line" />

        <div className="sortings">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search organization..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img src={search} alt="Search" className="search-icon" />
          </div>
          <div className="tags-container">
            {['Academic', 'Non-Academic', 'CAS', 'CBA', 'CCS', 'CEA', 'CED', 'CJE', 'CNR'].map(tag => (
              <div
                key={tag}
                className={`tag ${activeTag === tag ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
          
          <div className="org-container">
            {filteredOrgs.map(org => (
              <div className="org" key={org.org_id}>
                <div className="org-img">
                  {org.org_img && <img src={`http://127.0.0.1/uploads/${org.org_img}`} alt="" />}
                </div>
                <div className="org-details">
                  <div className={`org-type ${org.org_type === 'Academic' ? 'academic' : 'non-academic'}`}>
                    {org.org_type}
                  </div>
                  <div className="org-name">{org.org_name}</div>
                  <div className="line"> </div>
                  <div className="org-desc">{org.org_desc}</div>
                </div>
                <div className="org-view">
                  <Link to={`/organization/${org.org_id}`} className="view-button">View</Link>
                </div>
              </div>
            ))}
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

export default OrgList;
