import { useEffect, useState, useRef } from "react";
import './Accreditation.css';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import logo from '/unc_logo.png';
import Papa from 'papaparse';

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

interface Member {
  member_id: string;
  stud_id: string;
  acc_id: string;
  member_email: string;
  member_name: string;
  member_position: string;
  member_contact: string;
}

interface Activity {
  act_id: string;
  acc_id: string;
  act_name: string;
  outcomes: string;
  time: string;
  target_group: string;
  persons: string;
}

interface Accreditation {
  acc_id: string;
  stud_id: string;
  constitution: string;
  orgname: string;
  type: string;
  adv_letter: string;
  appendices: string;
  status: string;
}

const AccreditationForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stud_id } = useParams<{ stud_id: string }>();
  const { userId } = location.state || {};

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [officers, setOfficers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMember = () => {
    setMembers([...members, { member_id: '', stud_id: '', acc_id: '', member_email: '', member_name: '', member_position: '', member_contact: '' }]);
  };

  const addOfficer = () => {
    setOfficers([...officers, { member_id: '', stud_id: '', acc_id: '', member_email: '', member_name: '', member_position: '', member_contact: '' }]);
  };

  const addActivity = () => {
    setActivities([...activities, { act_id: '', acc_id: '', act_name: '', outcomes: '', time: '', target_group: '', persons: '' }]);
  };

  const handleInputChange = (index: number, field: keyof Member, value: string, type: 'members' | 'officers') => {
    const updatedData = type === 'members' ? [...members] : [...officers];
    updatedData[index][field] = value;
    if (type === 'members') {
      setMembers(updatedData);
    } else {
      setOfficers(updatedData);
    }
  };

  const handleActivityInputChange = (index: number, field: keyof Activity, value: string) => {
    const updatedActivities = [...activities];
    updatedActivities[index][field] = value;
    setActivities(updatedActivities);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const removeOfficer = (index: number) => {
    setOfficers(officers.filter((_, i) => i !== index));
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const parsedMembers = results.data as Member[];
          setMembers([...members, ...parsedMembers]);
        },
        error: (err) => {
          console.error('Error parsing CSV:', err);
        }
      });
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, studentsResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/students'),
        ]);

        setUsers(usersResponse.data);
        setStudents(studentsResponse.data);
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
    if (userId && users.length > 0 && students.length > 0) {
      const user = users.find((u) => u.user_id === userId);
      if (user) {
        setUserInfo(user);
        if (user.user_role === 'Student') {
          const student = students.find((s) => s.stud_id === stud_id);
          if (student) {
            setStudent(student);
          }
        }
      }
    }
  }, [userId, users, students, stud_id]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    formData.append('stud_id', student?.stud_id || '');
    formData.append('members', JSON.stringify(members));
    formData.append('officers', JSON.stringify(officers));
    formData.append('activities', JSON.stringify(activities));

    try {
      const response = await axios.post('http://localhost:8800/accreditation/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Accreditation added:', response.data);
      // Handle success, e.g., show a success message or redirect
      alert('Submitted Successfully!')
      navigate(`/accreditation-tab/`, { state: { userId } });
    } catch (error) {
      console.error('Error adding accreditation:', error);
      // Handle error, e.g., show an error message
    }
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
              <div className="profile-text">
                <div className="user-name">
                  {student?.stud_name}
                </div>
                <button className="sign-out-button" onClick={handleSignOut}>
                  SIGN OUT
                </button>
              </div>
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
      <div className="faciform-content">
        <div className="incampus-content">
          <div className="incampus-header">
            <h4 className="unc-title">University of Nueva Caceres</h4>
            <h1 className="incampus-title">Accreditation Application Form</h1>
          </div>
          <div className="incampus-buttons">
            <button className="incampus-button-cancel">Back</button>
            <button className="incampus-button-proceed" type="submit" form="accreditationForm">Submit</button>
          </div>
        </div>
        <hr className="title-custom-line" />
        <div className="main-containerfaciform">
          <form id="accreditationForm" className="accre-form-content-form" onSubmit={handleSubmit}>
          <div className="accre-form-content-grid">
              <div className="accre-form-content-section">
                <label className="accre-form-content-label">Organization Name</label>
                <input type="text" name="orgname" className="accre-form-content-input" placeholder="Organization Name" required />
              </div>
              <div className="accre-form-content-section">
                <label className="accre-form-content-label">Organization Type</label>
                <select name="type" className="accre-form-content-input" required>
                  <option value="">Select</option>
                  <option value="academic">Academic</option>
                  <option value="non-academic">Non-Academic</option>
                </select>
              </div>
            </div>

              <div className="accre-form-content-section">
                <label className="accre-form-content-label">1. Constitutions & By-Laws</label>
                <input type="file" name="constitution" accept="application/pdf" className="accre-form-content-input" required />
              </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">2. List of members and their student numbers</p>
              <table className="accre-form-content-table">
                <thead>
                  <tr>
                    <th>Student Number</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={index}>
                      <td><input type="text" name="member_studno" value={member.stud_id} onChange={(e) => handleInputChange(index, "stud_id", e.target.value, 'members')} className="w-full" required /></td>
                      <td><input type="text" name="member_name" value={member.member_name} onChange={(e) => handleInputChange(index, "member_name", e.target.value, 'members')} className="w-full" required /></td>
                      <td><button type="button" onClick={() => removeMember(index)} className="accre-form-content-remove-btn">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="members-row-buttons">
                <button type="button" onClick={addMember} className="accre-form-content-add-member">Add Member</button>
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleCSVUpload} style={{ display: 'none' }} />
                <button type="button" onClick={handleUploadButtonClick} className="accre-form-content-add-member">Upload CSV</button>
              </div>
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">3. List of Officers</p>
              <table className="accre-form-content-table">
                <thead>
                  <tr>
                    <th>Student Number</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Contact Number</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((officer, index) => (
                    <tr key={index}>
                      <td><input type="text" name="officer_studno" value={officer.stud_id} onChange={(e) => handleInputChange(index, "stud_id", e.target.value, 'officers')} className="w-full" required /></td>
                      <td><input type="text" name="officer_name" value={officer.member_name} onChange={(e) => handleInputChange(index, "member_name", e.target.value, 'officers')} className="w-full" required /></td>
                      <td><input type="text" name="officer_position" value={officer.member_position} onChange={(e) => handleInputChange(index, "member_position", e.target.value, 'officers')} className="w-full" required /></td>
                      <td><input type="text" name="officer_contact" value={officer.member_contact} onChange={(e) => handleInputChange(index, "member_contact", e.target.value, 'officers')} className="w-full" required /></td>
                      <td><input type="text" name="officer_email" value={officer.member_email} onChange={(e) => handleInputChange(index, "member_email", e.target.value, 'officers')} className="w-full" required /></td>
                      <td><button type="button" onClick={() => removeOfficer(index)} className="accre-form-content-remove-btn">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={addOfficer} className="accre-form-content-add-member">Add Officer</button>
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">4. Plan Activities</p>
              <table className="accre-form-content-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Learning Outcomes</th>
                    <th>Target Time</th>
                    <th>Target Group</th>
                    <th>Persons Involved</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td><input type="text" name="act_name" value={activity.act_name} onChange={(e) => handleActivityInputChange(index, "act_name", e.target.value)} className="w-full" required /></td>
                      <td><input type="text" name="outcomes" value={activity.outcomes} onChange={(e) => handleActivityInputChange(index, "outcomes", e.target.value)} className="w-full" required /></td>
                      <td><input type="text" name="time" value={activity.time} onChange={(e) => handleActivityInputChange(index, "time", e.target.value)} className="w-full" required /></td>
                      <td><input type="text" name="target_group" value={activity.target_group} onChange={(e) => handleActivityInputChange(index, "target_group", e.target.value)} className="w-full" required /></td>
                      <td><input type="text" name="persons" value={activity.persons} onChange={(e) => handleActivityInputChange(index, "persons", e.target.value)} className="w-full" required /></td>
                      <td><button type="button" onClick={() => removeActivity(index)} className="accre-form-content-remove-btn">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={addActivity} className="accre-form-content-add-member">Add Activity</button>
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">5. Adviser's Letter of Acceptance</p>
              <input type="file" name="adv_letter" accept="application/pdf" className="accre-form-content-input" required />
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">6. Appendices (Document Containing Organization's Vision, Mission, History of the Organization, and Seal of the Organization)</p>
              <input type="file" name="appendices" accept="application/pdf" className="accre-form-content-input" required />
            </div>
          </form>
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
};

export default AccreditationForm;
