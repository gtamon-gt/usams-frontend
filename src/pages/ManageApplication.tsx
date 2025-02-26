import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '/unc_logo.png';
import './ViewSubmittedProposals.css';
import axios from 'axios';

interface Application {
  control_no: string;
  stud_id: string;
  application_sem: string;
  application_sy: string;
  application_class: string;
  application_status: string;
  date_submitted: Date;
  date_approved: Date;
  comment: string;
}

interface Student {
  stud_id: string;
  user_id: string;
  stud_dept: string;
  stud_name: string;
  stud_img: string;
}

interface User {
  user_id: string;
  user_role: string;
}

const ManageApplication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userInfo, student } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get(`http://localhost:8800/users`);
        setUsers(usersRes.data);

        const studentsRes = await axios.get(`http://localhost:8800/students`);
        setStudents(studentsRes.data);

        const applicationsRes = await axios.get(`http://localhost:8800/applications`);
        setApplications(applicationsRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteApplication = async (control_no: string) => {
    try {
      await axios.delete(`http://localhost:8800/applications/${control_no}`);
      setApplications(applications.filter(app => app.control_no !== control_no));
      alert('Application successfully deleted.');
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete application.');
    }
  };

  const toggleComments = (control_no: string) => {
    setShowComments(prevState => ({
      ...prevState,
      [control_no]: !prevState[control_no]
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

  const filteredApplications = applications.filter(app =>
    students.some(student => student.stud_id === app.stud_id)
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
            {userInfo && (
              <>
                <div className="profile-text">
                  <div className="user-name">
                    {student.stud_name}
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
          <h2>Submitted Applications</h2>
          <p className="instructions">View and manage the applications submitted by students.</p>
        </div>
        <hr className="title-custom-line" />
        {filteredApplications.length > 0 ? (
          <div className="proposals-list">
            <div className="proposal-row header-row">
              <div className="proposal-cell">Date Submitted</div>
              <div className="proposal-cell">School Year</div>
              <div className="proposal-cell">Semester</div>
              <div className="proposal-cell">Application Status</div>
              <div className="proposal-cell">Comment</div>
              <div className="proposal-cell">Actions</div>
            </div>
            {filteredApplications.map(application => (
              <React.Fragment key={application.control_no}>
                <div className="proposal-row">
                  <div className="proposal-cell">{new Date(application.date_submitted).toLocaleDateString()}</div>
                  <div className="proposal-cell">{application.application_sy}</div>
                  <div className="proposal-cell">{application.application_sem}</div>
                  <div className="proposal-cell">{application.application_status}</div>
                  <div className="proposal-cell">{application.comment}</div>
                  <div className="proposal-cell ext">
                    <button onClick={() => navigate(`/view-application/${application.control_no}`, { state: { userId, userInfo, student } })}>View</button>
                    <button onClick={() => navigate(`/update-application/${application.control_no}`, { state: { userId, userInfo, student } })}>Update</button>
                    <button onClick={() => handleDeleteApplication(application.control_no)}>Delete</button>
                    {application.application_status === 'Approved' && (
                      <button onClick={() => navigate(`/view-application-pass/${application.control_no}`, { state: { userId, userInfo, student, application } })}>View Pass</button>
                    )}
                    {/*<button onClick={() => toggleComments(application.control_no)}>
                      {showComments[application.control_no] ? 'Hide Comments' : 'Show Comments'}
                    </button> */}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>No applications available for management.</p>
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

export default ManageApplication;