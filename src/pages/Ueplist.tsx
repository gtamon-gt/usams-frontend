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
  stud_name?: string;
  year_level?: string;
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
  year_level: string;
  course: string;
}

const Ueplist: React.FC = () => {
  const location = useLocation();
  const { userId, userInfo, student } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [approver, setApprover] = useState<Approver | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');
const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, approversResponse, applicationsResponse, studentsResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/approvers'),
          axios.get('http://localhost:8800/approvedapplications'),
          axios.get('http://localhost:8800/students'),
        ]);

        const users = usersResponse.data;
        const approvers = approversResponse.data;
        const applicationsData = applicationsResponse.data;
        const studentsData = studentsResponse.data;

        setStudents(studentsData);

        const foundUser = users.find((u: User) => u.user_id === userId);
        if (foundUser) {
          setUser(foundUser);

          const foundApprover = approvers.find((appr: Approver) => appr.user_id === userId);
          if (foundApprover) {
            setApprover(foundApprover);
            
          // Attach student names and year levels to applications
const updatedApplications = applicationsData.map((application: Application) => {
  const student = studentsData.find((stud: Student) => stud.stud_id === application.stud_id);
  return { 
    ...application, 
    stud_name: student ? student.stud_name : 'Unknown Student',
    year_level: student ? student.year_level : 'Unknown Year Level',
    course: student ? student.course : 'Unknown Course'
  };
});

setApplications(updatedApplications);
          } else {
            setError('Approver not found.');
          }
        } else {
          setError('User not found.');
        }
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



  const handleSignOut = () => {
    // Reset the userId in the location state
    navigate('/', { state: { userId: null } });
  };

  const filteredApplications = applications.filter(application => 
    application.control_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.stud_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.stud_name && application.stud_name.toLowerCase().includes(searchTerm.toLowerCase())
    // Optional chaining fixes undefined issue
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
          <h2>List of Uniform Exempted Students
          <input
            type="text" 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={handleSearch} 
            className="search-input2"
          />
          </h2>
          <p className="instructions">View and track the students with approved uniform exemption application</p>
        </div>
        <hr className="title-custom-line" />
        {filteredApplications.length > 0 ? (
          <div className="proposals-list">
            <div className="proposal-row header-row2">
              <div className="proposal-cell">Control No.</div>           
              <div className="proposal-cell">Student ID</div>
              <div className="proposal-cell">Student Name</div>
              <div className="proposal-cell">Semester</div>
              <div className="proposal-cell">School Year</div>
              <div className="proposal-cell"></div>
             
             
            </div>
            {filteredApplications.map(application => (
              <div key={application.control_no} className="proposal-row">
                <div className="proposal-cell">{application.control_no}</div>
                <div className="proposal-cell">{application.stud_id}</div>
                <div className="proposal-cell">{application.stud_name}</div>
                <div className="proposal-cell">{application.application_sem}</div>
                <div className="proposal-cell">{application.application_sy}</div>
                <div className="proposal-cell">    {application.application_status === 'Approved' && (
                      <button onClick={() => navigate(`/view-application-pass-osa/${application.control_no}`, {
                         state: { userId, userInfo, student, application } })}>View Pass</button>
                    )}

                </div>
             
              </div>
            ))}
          </div>
        ) : (
          <p>No applications available for approval.</p>
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

export default Ueplist;
