import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '/unc_logo.png';
import './Home.css';

interface Student {
  stud_id: string;
  org_id: string;
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
}

interface User {
  user_id: string;
  user_role: string;
}

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userRole } = location.state || {};

  console.log('Home userId:', userId); // Debugging statement
  console.log('Home userRole:', userRole); // Debugging statement

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['/pic1.png', '/pic2.jpg', '/pic3.jpg', '/pic4.jpg', '/pic5.jpg', '/pic6.jpg']; // paths to your images here
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userInfo, setUserInfo] = useState<Student | Organization | null>(null);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000); // change slide every 3 seconds

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch data
        const [usersResponse, studentsResponse, organizationsResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/students'),
          axios.get('http://localhost:8800/organizations'),
        ]);

        setUsers(usersResponse.data);
        setStudents(studentsResponse.data);
        setOrganizations(organizationsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userId && users.length > 0 && students.length > 0 && organizations.length > 0) {
      // find the user
      const user = users.find((u) => u.user_id === userId);
      if (user) {
        // check if the user is a student
        const student = students.find((s) => s.stud_id === userId);
        if (student) {
          setUserInfo(student);
        } else {
          // check if the user is an organization
          const organization = organizations.find((o) => o.org_id === userId);
          if (organization) {
            setUserInfo(organization);
          }
        }
      }
    }
  }, [userId, users, students, organizations]);

  const handleSignOut = () => {
    // Reset the userId in the location state
    navigate('/', { state: { userId: null } });
  };

  const isStudent = userInfo && 'stud_name' in userInfo;
  const isOrganization = userInfo && 'org_name' in userInfo;

  const handleNavigateToOptionOrganization = () => {
    navigate('/option-organization', { state: { userId } });
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
            {userInfo && (
              <>
                <div className="profile-text">
                  <div className="user-name">
                    {(userInfo as Student).stud_name || (userInfo as Organization).org_name}
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

      <div id="home-content">
        <div id="home-left-column">
          <div id="home-slideshow-container">
            {slides.map((slide, index) => (
              <div
                key={index}
                id={`home-slide-${index}`}
                className={`home-slide ${index === currentSlide ? 'home-active' : ''}`}
                style={{ backgroundImage: `url(${slide})` }}
              ></div>
            ))}
            <div id="home-dots">
              {slides.map((_, index) => (
                <span
                  key={index}
                  id={`home-dot-${index}`}
                  className={`home-dot ${index === currentSlide ? 'home-active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </div>
          <div id="home-left-column-text">
            <div id="home-bold-text">Welcome to UNC Student Affairs!</div>
            <div id="home-non-bold-text">The UNC Office of Student Affairs is primarily concerned with the coordination and overall development of the non-academic areas of student life. It is one of the SAS ( Student Affairs & Services) units along with the Guidance and Career Center.</div>
          </div>
        </div>
        <div id="home-right-column">
          <div id="home-shortcuts-text">Your Shortcuts</div>
          <div id="home-shortcut-boxes">
            <div id="home-shortcut-box-1" className="home-shortcut-box">
              <img src="/shortcut1.png" alt="Shortcut 1" className="shortcutimg" />
              <div className="home-shortcut-text-section">
                <div className="home-shortcut-name">Accredit your Organization</div>
                <div className="home-shortcut-desc">Apply for accreditation for your new or existing organization.</div>
              </div>
              <img src="/arrow.png" alt="Arrow" className="arrowimg" />
            </div>
            <div id="home-shortcut-box-2" className="home-shortcut-box">
              <img src="/shortcut2.png" alt="Shortcut 2" className="shortcutimg" />
              <div className="home-shortcut-text-section">
                <div className="home-shortcut-name">Send Project Proposal</div>
                <div className="home-shortcut-desc">Submit an in-campus or off-campus activity proposal to the approvers.</div>
              </div>
              <img src="/arrow.png" alt="Arrow" className="arrowimg" />
            </div>
            <div id="home-shortcut-box-3" className="home-shortcut-box">
              <img src="/shortcut3.png" alt="Shortcut 3" className="shortcutimg" />
              <div className="home-shortcut-text-section">
                <div className="home-shortcut-name">Reserve Facility</div>
                <div className="home-shortcut-desc">Request a facility reservation for your activity.</div>
              </div>
              <img src="/arrow.png" alt="Arrow" className="arrowimg" />
            </div>
            <div id="home-shortcut-box-4" className="home-shortcut-box">
              <img src="/shortcut4.png" alt="Shortcut 4" className="shortcutimg" />
              <div className="home-shortcut-text-section">
                <div className="home-shortcut-name">Apply for Uniform Exemption Pass</div>
                <div className="home-shortcut-desc">Fill out the Application form.</div>
              </div>
              <img src="/arrow.png" alt="Arrow" className="arrowimg" />
            </div>
          </div>
        </div>
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
}

export default Home;
