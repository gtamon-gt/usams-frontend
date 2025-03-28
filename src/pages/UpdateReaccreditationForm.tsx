import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '/unc_logo.png';
import './accreditation/Accreditation.css';

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
    user_role: string;
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

const UpdateReaccreditationForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { acc_id } = useParams<{ acc_id: string }>();
  const { userId, userInfo, organization } = location.state || {};

  const [accreditation, setAccreditation] = useState<Accreditation | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [officers, setOfficers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for file names
  const [constitutionFileName, setConstitutionFileName] = useState<string>('');
  const [advLetterFileName, setAdvLetterFileName] = useState<string>('');
  const [appendicesFileName, setAppendicesFileName] = useState<string>('');
  const [icesCertFileName, setIcesCertFileName] = useState<string>('');


  const { org_id } = useParams<{ org_id: string }>();
    const [orgId, setOrgId] = useState<Organization | null>(null);

    const [users, setUsers] = useState<User[]>([]);
 const [organizations, setOrganizations] = useState<Organization[]>([]);
//  const [organization, setOrganization] = useState<Organization | null>(null);

  const [fileInputsChanged, setFileInputsChanged] = useState({
    adv_letter: false,
    appendices: false,
    ices_cert: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accreditationsResponse, membersResponse, activitiesResponse] = await Promise.all([
          axios.get('http://localhost:8800/reaccreditations'),
          axios.get('http://localhost:8800/members-reaccred'),
          axios.get('http://localhost:8800/activities_reaccred'),
        ]);

        const accreditationData = accreditationsResponse.data.find((acc: Accreditation) => acc.acc_id === acc_id);
        const membersData = membersResponse.data.filter((member: Member) => member.acc_id === acc_id);
        const activitiesData = activitiesResponse.data.filter((activity: Activity) => activity.acc_id === acc_id);

        setAccreditation(accreditationData);
        setMembers(membersData.filter((member: Member) => member.member_position == null));
        setOfficers(membersData.filter((member: Member) => member.member_position !== null)); // Assuming officers have a position
        setActivities(activitiesData);

        // Set initial file names
        if (accreditationData) {
          setConstitutionFileName(accreditationData.constitution);
          setAdvLetterFileName(accreditationData.adv_letter);
          setAppendicesFileName(accreditationData.appendices);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [acc_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, organizationsResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/organizations'),
        ]);

        setUsers(usersResponse.data);
        setOrganizations(organizationsResponse.data);
        const org = organizationsResponse.data.find((o: Organization) => o.org_id === org_id);
       setOrgId(org || null);
        setOrgId(org ? org.org_id : ''); // Set adviser name
      //  setOrganization(org || null);
        setOrganizations(organizationsResponse.data);

      
        console.log('Fetched users:', usersResponse.data);
        console.log('Fetched organizations:', organizationsResponse.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const removeMember = async (index: number) => {
    const memberId = members[index].member_id;
    if (memberId) {
      try {
        await axios.delete(`http://localhost:8800/members-reaccred/${memberId}`);
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
    setMembers(members.filter((_, i) => i !== index));
  };
  
  const removeOfficer = async (index: number) => {
    const officerId = officers[index].member_id;
    if (officerId) {
      try {
        await axios.delete(`http://localhost:8800/members-reaccred/${officerId}`);
      } catch (error) {
        console.error('Error deleting officer:', error);
      }
    }
    setOfficers(officers.filter((_, i) => i !== index));
  };
  
  const removeActivity = async (index: number) => {
    const activityId = activities[index].act_id;
    if (activityId) {
      try {
        await axios.delete(`http://localhost:8800/activities_reaccred/${activityId}`);
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
    setActivities(activities.filter((_, i) => i !== index));
  };
  

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const formData = new FormData(event.currentTarget as HTMLFormElement);
  
    // Append existing file names if no new files are selected
    if (!fileInputsChanged.adv_letter) {
      formData.append('adv_letter', advLetterFileName);
    }
    if (!fileInputsChanged.appendices) {
      formData.append('appendices', appendicesFileName);
    }
    if (!fileInputsChanged.ices_cert) {
      formData.append('ices_cert', icesCertFileName);
    }
  
    formData.append('orgId', organization?.org_id || '');
    formData.append('members', JSON.stringify(members));
    formData.append('officers', JSON.stringify(officers));
    formData.append('activities', JSON.stringify(activities));
  
    try {
      const response = await axios.post(`http://localhost:8800/reaccreditation/update/${acc_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Accreditation updated:', response.data);
      alert('Updated Successfully!');
      navigate(`/accreditation-tab/`, { state: { userId } });
    } catch (error) {
      console.error('Error updating accreditation:', error);
    }
  };  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFileName: React.Dispatch<React.SetStateAction<string>>, fileType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileInputsChanged((prevState) => ({
        ...prevState,
        [fileType]: true
      }));
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
                  {organization?.org_name}
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
            <Link to={isOrganization ? "/student-activities-tab" : "/activities-tab"} state={{ userId }} className="navbar-link">Activities</Link>
            <Link to={isOrganization ? "/organizationlist" : "/organizations-tab"} state={{ userId }} className="navbar-link">Organizations</Link>
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
            <h1 className="incampus-title">Update Re-Accreditation Application Form</h1>
          </div>
          <div className="incampus-buttons">
            <button className="incampus-button-cancel" onClick={() => navigate(-1)}>Back</button>
            <button className="incampus-button-proceed" type="submit" form="accreditationForm">Submit</button>
          </div>
        </div>
        <hr className="title-custom-line" />
        <div className="main-containerfaciform">
          <form id="accreditationForm" className="accre-form-content-form" onSubmit={handleSubmit}>
            <div className="accre-form-content-grid">
              <div className="accre-form-content-section">
                <label className="accre-form-content-label">Organization Name</label>
                <input type="text" name="orgname" className="accre-form-content-input" placeholder="Organization Name" defaultValue={accreditation?.orgname} required />
              </div>
              <div className="accre-form-content-section">
                <label className="accre-form-content-label">Organization Type</label>
                <input type="text" name="type" className="accre-form-content-input" defaultValue={organization?.org_type} required />
              </div>
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">1. List of Officers</p>
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
              <button type="button" onClick={addMember} className="accre-form-content-add-member">Add Member</button>
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">3. Plan of Activities</p>
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
              <label className="accre-form-content-label">4. Adviser's Letter of Acceptance</label>
              <input type="file" name="adv_letter" accept="application/pdf" className="accre-form-content-input" onChange={(e) => handleFileChange(e, setAdvLetterFileName, 'adv_letter')} />
              {advLetterFileName && <p>Current File: {advLetterFileName}</p>}
            </div>

            <div className="accre-form-content-section">
              <label className="accre-form-content-label">5. Community Extension Service with Certification from the ICES Director</label>
              <input type="file" name="ices_cert" accept="application/pdf" className="accre-form-content-input" onChange={(e) => handleFileChange(e, setIcesCertFileName, 'ices_cert')} />
              {icesCertFileName && <p>Current File: {icesCertFileName}</p>}
            </div>

            <div className="accre-form-content-section">
              <label className="accre-form-content-label">6. Appendices</label>
              <input type="file" name="appendices" accept="application/pdf" className="accre-form-content-input" onChange={(e) => handleFileChange(e, setAppendicesFileName, 'appendices')} />
              {appendicesFileName && <p>Current File: {appendicesFileName}</p>}
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

export default UpdateReaccreditationForm;