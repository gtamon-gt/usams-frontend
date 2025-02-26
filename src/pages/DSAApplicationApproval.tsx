import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import axios from 'axios';

interface User {
  user_id: string;
  user_role: string;
  user_name: string;
}

interface Approver {
  employee_id: string;
  user_id: string;
  sy_id: string;
  employee_name: string;
  employee_position: string;
}

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
  on_revision: number;
}

interface Student {
  stud_id: string;
  user_id: string;
  stud_dept: string;
  stud_name: string;
  stud_img: string;
}

const DSAApplicationApproval: React.FC = () => {
  const location = useLocation();
  const { userId } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [approver, setApprover] = useState<Approver | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, approversResponse, applicationsResponse, studentsResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/approvers'),
          axios.get('http://localhost:8800/applications'),
          axios.get('http://localhost:8800/students'),
        ]);

        const users = usersResponse.data;
        const approvers = approversResponse.data;
        const applicationsData = applicationsResponse.data;
        const studentsData = studentsResponse.data;

        // Find the user based on userId
        const foundUser = users.find((u: User) => u.user_id === userId);
        console.log('Found User:', foundUser);
        if (foundUser) {
          setUser(foundUser);

          // Find the approver based on userId
          const foundApprover = approvers.find((appr: Approver) => appr.user_id === userId);
          if (foundApprover) {
            setApprover(foundApprover);

            // Filter applications that need approval
            const filteredApplications = applicationsData.filter((app: Application) =>
              app.application_status === 'Pending' && app.on_revision === 0
            );
            setApplications(filteredApplications);
          } else {
            setError('Approver not found.');
          }
        } else {
          setError('User not found.');
        }

        setStudents(studentsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    console.log('User State:', user);
  }, [user]);

  const handleApprove = async (control_no: string) => {
    try {
      await axios.put(`http://localhost:8800/applications/approve/${control_no}`);
      setApplications(applications.map(app => app.control_no === control_no ? { ...app, application_status: 'Approved' } : app));
      alert('Application approved successfully!');
      fetchApplications();
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Failed to approve application.');
    }
  };

  const handleReject = (application: Application) => {
    setSelectedApplication(application);
    setComment('');
  };

  const handleSubmitReject = async () => {
    if (selectedApplication && comment) {
      try {
        await axios.post(`http://localhost:8800/applications/reject/${selectedApplication.control_no}`, {
          comment: `[${approver?.employee_name}] ${comment}`
        });
        setApplications(applications.map(app => app.control_no === selectedApplication.control_no ? { ...app, application_status: 'Rejected' } : app));
        setSelectedApplication(null);
        setComment('');
        alert('Application rejected and comment added successfully!');
        fetchApplications();
      } catch (err) {
        console.error('Error rejecting application:', err);
        alert('Failed to reject application.');
      }
    }
  };

  const fetchApplications = async () => {
    try {
      const applicationsResponse = await axios.get('http://localhost:8800/applications');
      const applicationsData = applicationsResponse.data;

      // Filter applications that need approval
      const filteredApplications = applicationsData.filter((app: Application) =>
        app.application_status === 'Pending' && app.on_revision === 0
      );
      setApplications(filteredApplications);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications.');
    }
  };

  const handleSignOut = () => {
    // Reset the userId in the location state
    navigate('/', { state: { userId: null } });
  };

  const handleViewApplication = (application: Application) => {
    const student = students.find(stud => stud.stud_id === application.stud_id);
    if (student) {
      navigate(`/view-application/${application.control_no}`, { state: { userId, userInfo: user, student, approver } });
    } else {
      alert('Student not found.');
    }
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
          <h2>Applications for Approval</h2>
          <p className="instructions">Review and approve or reject the applications submitted by students.</p>
        </div>
        <hr className="title-custom-line" />
        {applications.length > 0 ? (
          <div className="proposals-list">
            <div className="proposal-row header-row">
              <div className="proposal-cell">Control No.</div>
              <div className="proposal-cell">Student ID</div>
              <div className="proposal-cell">Semester</div>
              <div className="proposal-cell">School Year</div>
              <div className="proposal-cell">Class</div>
              <div className="proposal-cell">Actions</div>
            </div>
            {applications.map(application => (
              <div key={application.control_no} className="proposal-row">
                <div className="proposal-cell">{application.control_no}</div>
                <div className="proposal-cell">{application.stud_id}</div>
                <div className="proposal-cell">{application.application_sem}</div>
                <div className="proposal-cell">{application.application_sy}</div>
                <div className="proposal-cell">{application.application_class}</div>
                <div className="proposal-cell ext">
                  <button onClick={() => handleViewApplication(application)}>View</button>
                  <button className="approve-button" onClick={() => handleApprove(application.control_no)}>Approve</button>
                  <button className="reject-button" onClick={() => handleReject(application)}>Request Revision</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No applications available for approval.</p>
        )}
      </div>

      {selectedApplication && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Reject Application</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment or feedback..."
            ></textarea>
            <button onClick={handleSubmitReject}>Submit</button>
            <button onClick={() => setSelectedApplication(null)}>Cancel</button>
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

export default DSAApplicationApproval;
