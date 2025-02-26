import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ApplicationForm.css';
import logo from '/unc_logo.png';

const ApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userInfo, student } = location.state || {};

  const [applications, setApplications] = useState({
    stud_id: student?.stud_id || '',
    application_sem: '',
    application_sy: '',
    application_class: '',
    documents: null,
    control_no: '',
  });

  const [existingControlNos, setExistingControlNos] = useState([]);

  const generateControlNo = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `1-${randomNumber}`;
  };

  const generateUniqueControlNo = () => {
    let controlNo = generateControlNo();
    while (existingControlNos.find(existingNo => existingNo === controlNo)) {
      controlNo = generateControlNo();
    }
    setApplications((prev) => ({ ...prev, control_no: controlNo }));
  };

  useEffect(() => {
    const fetchExistingControlNos = async () => {
      try {
        const response = await axios.get('http://localhost:8800/applications');
        setExistingControlNos(response.data.map(app => app.control_no));
        generateUniqueControlNo();
      } catch (err) {
        console.error(err);
      }
    };

    fetchExistingControlNos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApplications((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? value : '') : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setApplications((prev) => ({ ...prev, documents: e.target.files }));
    }
  };

  const handleTouch = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('stud_id', applications.stud_id);
    formData.append('application_sem', applications.application_sem);
    formData.append('application_sy', applications.application_sy);
    formData.append('application_class', applications.application_class);
    formData.append('control_no', applications.control_no);

    if (applications.documents) {
      Array.from(applications.documents).forEach(file => {
        formData.append('documents', file);
      });
    }

    console.log('Form Data:', formData); // Log the form data being sent

    try {
      await axios.post('http://localhost:8800/appformsubmit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/uniform-exemption/${student?.stud_id}`, { state: { userId } });
      alert('Submitted Successfully!')
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  return (
    <div className="main-wrapper">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-text-section">
            <img src={logo} alt="Logo" className="logo-img" />
            <div className="text-section">
              <div className="one-text-section" value="text1" >UNIVERSITY STUDENT AFFAIRS</div>
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
            <a href="#" className="navbar-link">Activities</a>
            <a href="#" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="/osaservices" className="navbar-link">OSA Services</a>
            <a href="#" className="navbar-link">About</a>
          </div>
        </div>
      </div>

      <div className="application-form-content">
        {student && (
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
                I,
                <input
                  type="text"
                  className="inputName"
                  value={student.stud_name}
                  onChange={handleChange}
                  name="stud_name"
                  style={{ display: 'inline', width: 'auto', margin: '0 5px' }}
                />
                (Name), a
                <input
                  type="text"
                  className="inputYL"
                  value={student.year_level}
                  onChange={handleChange}
                  name="stud_dept"
                  style={{ display: 'inline', width: '50px', margin: '0 5px' }}
                />
                (Year Level) student of
                <input
                  type="text"
                  className="inputDept"
                  value={student.stud_dept}
                  onChange={handleChange}
                  name="stud_dept"
                  style={{ display: 'inline', width: 'auto', margin: '0 5px' }}
                />
                (Department), currently enrolled and taking up
                <input
                  type="text"
                  className="inputCourse"
                  value={student.course}
                  onChange={handleChange}
                  name="stud_course"
                  style={{ display: 'inline', width: '300px', margin: '0 5px' }}
                />
                respectfully request for office approval to grant UNIFORM EXEMPTION PASS this
                <input
                  type="text"
                  className="inputSem"
                  value={applications.application_sem}
                  onChange={handleChange}
                  name="application_sem"
                  placeholder="Semester"
                  style={{ display: 'inline', width: '90px', margin: '0 5px' }}
                />
                semester, school
                <span className="sntnc1"> year </span>
                <input
                  type="text"
                  className="inputSY"
                  value={applications.application_sy}
                  onChange={handleChange}
                  name="application_sy"
                  placeholder="School Year"
                  style={{ display: 'inline', width: 'auto', margin: '0 5px' }}
                />
              </label>
            </div>

            <div className="application-form-input-group2">
              <label>REASON: (PLEASE CHECK)</label>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox"
                value="Working Student"
                onChange={handleChange}
                name="application_class"
              />
              <span>Working student with office or company uniform (Please attach certificate of employment, working schedule and matriculation)</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox"
                value="Graduate Student"
                onChange={handleChange}
                name="application_class"
              />
              <span>Graduate/working professionals taking up second undergraduate course (Please attach photocopy of diploma & matriculation form)</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox"
                value="Member of a religious congregation with prescribed habit or attire"
                onChange={handleChange}
                name="application_class"
              />
              <span>Member of a religious congregation with prescribed habit or attire</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox"
                value="Pregnant Student"
                onChange={handleChange}
                name="application_class"
              />
              <span>Pregnant student (Please attach a medical certificate from the University Clinic)</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox"
                value="Student with physical deformities or handicapped"
                onChange={handleChange}
                name="application_class"
              />
              <span>Student with physical deformities or handicapped</span>
            </div>

            <div className="application-form-input-group3">
              <input
                type="checkbox"
                className="application-form-checkbox"
                value="OJT Student endorsed / certified by the College Dean"
                onChange={handleChange}
                name="application_class"
              />
              <span>OJT Student endorsed / certified by the College Dean (Please attach a photocopy of matriculation)</span>
            </div>

            <div className="application-form-input-group2">
              <span>I hereby commit myself to strictly follow and abide by the University Dress Code policy as stipulated in the College Student Handbook. Failure on my part to comply with said policy will result to the university revocation of this application without notice.</span>
            </div>

            <div className="application-form-input-group">
              <input type="file" className="choosefile" onChange={handleFileChange} multiple />
              {applications.documents && <div className="application-form-file-name">Selected Files: {Array.from(applications.documents).map(file => file.name).join(', ')}</div>}
            </div>

            <button className="application-form-submit-button" onClick={handleTouch}>
              Submit
            </button>
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

export default ApplicationForm;