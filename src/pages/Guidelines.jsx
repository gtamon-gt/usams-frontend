import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './faciresCSS.css';
import './faciformCSS.css';

const Guidelines = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userInfo } = location.state || {};
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://localhost:8800/organizations/');
        const organizations = response.data;
        const matchedOrg = organizations.find(org => org.user_id === userId);
        if (matchedOrg) {
          setOrgId(matchedOrg.org_id);
          console.log('Matched Organization:', matchedOrg); // Debugging statement
        } else {
          console.log('No matching organization found'); // Debugging statement
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

  const handleBack = () => {
    navigate('/activities-tab', { state: { userId, userInfo } });
  };

  const handleNext = () => {
    if (orgId) {
      navigate(`/faciform/${orgId}`, { state: { userId, userInfo } });
    }
  };

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

      <div className="guidelines-content">
        <div className="incampus-content">
          <div className="incampus-header">
            <h4 className="unc-title">University of Nueva Caceres</h4>
            <h1 className="incampus-title">General Guidelines for University Activities</h1>
          </div>
          <div className="incampus-buttons">
            <button className="incampus-button-cancel" onClick={handleBack}>
              Back
            </button>
            <button className="incampus-button-proceed" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
        <hr className="title-custom-line" />

        <div className="guidelines-box">
          <div className="guidelineform">
            <div className="text1guide">
              1. Secure the Activity/Facility Form from the Grounds and Buildings Management Office and inquire if proposed activity has any conflict of schedule.
            </div>
            <br />
            <div className="text2guide">
              2. Filing of Activity/Facility Form must be done at least five (5) days prior to the start of the activity.
            </div>
            <br />
            <div className="text3guide">
              3. No activities sponsored by accredited student organizations must be scheduled ten (10) days before major examinations.
            </div>
            <br />
            <div className="text4guide">
              4. In case of any change in the submitted form such as date, time or use of facilities, the requesting party must inform all signatories and concerned offices.
            </div>
            <br />
            <div className="text5guide">
              5. At least two (2) days before the scheduled activity, approved copies of the Activity/Facilities Forms will be distributed as follows:
            </div>
            <div className="text5guide2">
              5.1 Office of the Vice President for Administration & Auxiliary Services <br />
              5.2 Office of the Vice President for Academic Affairs <br />
              5.3 Office of the Grounds and Buildings Management <br />
              5.4 AMSCO Office <br />
              5.5 Security Office <br />
              5.6 Generator Operator (If Necessary) <br />
              5.7 Requesting Party
            </div>
            <br />
            <div className="text6guide">
              6. Only officers of accredited student organizations in the university are authorized to make requests for the use of University facilities.
            </div>
            <br />
            <div className="text7guide">
              7. The use of the facilities for fund raising activities sponsored by the students or any other school and organization shall be charged accordingly.
            </div>
            <br />
            <div className="text8guide">
              8. Activities sponsored jointly with outside groups are required to execute a contract indicating the facilities to be used, the date, the time and the amount of rental.
            </div>
            <br />
            <div className="text9guide">
              9. In case there is a prescribed arrangement of the requested facilities such as tables, chairs, sound system, ornamental plants, lights, etc., the requesting party must attach a proposed <br />
              &nbsp;&nbsp;&nbsp;    layout of the arrangement in the Facility/Activity Form.
            </div>
            <br />
            <div className="text10guide">
              10. The adviser should be present during the whole duration of the activity.
            </div>
            <br />
            <div className="text11guide">
              11. During night, after class or holiday reservations, the requesting party, guests and participants are discouraged to loiter.
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

export default Guidelines;
