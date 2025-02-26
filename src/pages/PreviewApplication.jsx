import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PreviewInCampus.css';
import logo from '/unc_logo.png';

const PreviewApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { control_no } = useParams();
  const { userId, userInfo, student, approver } = location.state || {};

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/applications`);
        const foundApplication = response.data.find(app => app.control_no === control_no);
        if (foundApplication) {
          setApplication(foundApplication);
        } else {
          setError('Application not found');
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching application:", err);
        setError("Failed to load application details.");
        setLoading(false);
      }
    };

    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/applications_documents`);
        const docs = response.data.filter(doc => doc.control_no === control_no);
        setDocuments(docs);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    fetchApplicationData();
    fetchDocuments();
  }, [control_no]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
                  {userInfo.user_role === 'Student' ? student.stud_name : approver.employee_name}
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
            <a href="#" className="navbar-link">Activities</a>
            <a href="#" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="/osaservices" className="navbar-link">OSA Services</a>
            <a href="#" className="navbar-link">About</a>
          </div>
        </div>
      </div>

      <div className="application-form-content">
        {student && application && (
          <div className="application-form-box">
             <div className="incampus-content preview">
              <table className="previewheader">
                <tr>
                  <td><img src="/unc_logo.png" alt="Logo" className="logo-img" /></td>
                  <td>
                    <h4 className="unc-title">UNIVERSITY OF NUEVA CACERES</h4>
                    <h1 className="incampus-title">Application for Uniform Exemption Pass </h1>
                    <h5 className="osa-title"> Office of Student Affairs </h5>
                    <h5 className="doc"> Document Control No.:
                    UNC-FM-SA-05 </h5>
                  </td>
                  <td>
                    <img src="/osa_logo.png" alt="Logo" className="logo-img_osa" />
                  </td>
                </tr>
              </table>
            </div>

            <br></br>
            <div className="application-form-input-group">
              <label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I,&nbsp;
                <span className="inputName" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {student.stud_name}
                </span>
                &nbsp;a&nbsp;
                <span className="inputYL" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {student.year_level}
                </span>
                &nbsp; student of&nbsp;
                <span className="inputDept" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {student.stud_dept}
                </span>
                &nbsp; currently enrolled and taking up&nbsp;
                <span className="inputCourse" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {student.course}
                </span>
                &nbsp;respectfully request for office approval to grant UNIFORM EXEMPTION PASS this&nbsp;
                <span className="inputSem" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {application.application_sem}
                </span>
                &nbsp;semester, school&nbsp;
                <span className="sntnc1">year</span>&nbsp;
                <span className="inputSY" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {application.application_sy}
                </span>
              </label>
            </div>

            <div className="application-form-input-group2">
              <label>REASON: (PLEASE CHECK)</label>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox2"
                value="Working Student"
                checked={application.application_class === 'Working Student'}
                disabled
                id="checkbox1"
              />
              <label htmlFor="checkbox1" className="custom-checkbox"></label>
              <span>Working student with office or company uniform (Please attach certificate of employment, working schedule and matriculation)</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox2"
                value="Graduate Student"
                checked={application.application_class === 'Graduate Student'}
                disabled
                id="checkbox2"
              />
              <label htmlFor="checkbox2" className="custom-checkbox"></label>
              <span>Graduate/working professionals taking up second undergraduate course (Please attach photocopy of diploma & matriculation form)</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox2"
                value="Member of a religious congregation with prescribed habit or attire"
                checked={application.application_class === 'Member of a religious congregation with prescribed habit or attire'}
                disabled
                id="checkbox3"
              />
              <label htmlFor="checkbox3" className="custom-checkbox"></label>
              <span>Member of a religious congregation with prescribed habit or attire</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox2"
                value="Pregnant Student"
                checked={application.application_class === 'Pregnant Student'}
                disabled
                id="checkbox4"
              />
              <label htmlFor="checkbox4" className="custom-checkbox"></label>
              <span>Pregnant student (Please attach a medical certificate from the University Clinic)</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox2"
                value="Student with physical deformities or handicapped"
                checked={application.application_class === 'Student with physical deformities or handicapped'}
                disabled
                id="checkbox5"
              />
              <label htmlFor="checkbox5" className="custom-checkbox"></label>
              <span>Student with physical deformities or handicapped</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox2"
                value="OJT Student endorsed / certified by the College Dean"
                checked={application.application_class === 'OJT Student endorsed / certified by the College Dean'}
                disabled
                id="checkbox6"
              />
              <label htmlFor="checkbox6" className="custom-checkbox"></label>
              <span>OJT Student endorsed / certified by the College Dean (Please attach a photocopy of matriculation)</span>
            </div>

            <div className="application-form-input-group2">
              <span>I hereby commit myself to strictly follow and abide by the University Dress Code policy as stipulated in the College Student Handbook. Failure on my part to comply with said policy will result to the university revocation of this application without notice.</span>
            </div>

            <div className="application-form-input-group">
              <label>Documents:</label>
              <ul>
                {documents.map(doc => (
                  <li key={doc.docu_key}>
                    <a href={`http://127.0.0.1/uploads/${doc.docu_path}`} target="_blank" rel="noopener noreferrer">
                      {doc.docu_path}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

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
};

export default PreviewApplication;
