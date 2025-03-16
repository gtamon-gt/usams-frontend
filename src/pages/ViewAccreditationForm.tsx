import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '/unc_logo.png';
import './Accreditation.css';

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

interface Director {
  dir_id: string;
  dir_name: string;
  sy_id: string;
  user_id: string;
}

const ViewAccreditationForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { acc_id } = useParams<{ acc_id: string }>();
  const { userId, userInfo } = location.state || {};

  const [accreditation, setAccreditation] = useState<Accreditation | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [officers, setOfficers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [director, setDirector] = useState<Director | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accreditationsResponse, membersResponse, activitiesResponse, approversResponse] = await Promise.all([
          axios.get('http://localhost:8800/accreditations'),
          axios.get('http://localhost:8800/members-accred'),
          axios.get('http://localhost:8800/activities'),
          axios.get('http://localhost:8800/approvers'),
        ]);

        const accreditationData = accreditationsResponse.data.find((acc: Accreditation) => acc.acc_id === acc_id);
        const membersData = membersResponse.data.filter((member: Member) => member.acc_id === acc_id);
        const activitiesData = activitiesResponse.data.filter((activity: Activity) => activity.acc_id === acc_id);

        setAccreditation(accreditationData);
        setMembers(membersData.filter((member: Member) => member.member_position == null));
        setOfficers(membersData.filter((member: Member) => member.member_position !== null));
        setActivities(activitiesData);

        const approversData = approversResponse.data;
        const directorData = approversData.find((approver: any) => approver.employee_position === 'OSA Director');
        setDirector({
          dir_id: directorData?.employee_id,
          dir_name: directorData?.employee_name,
          sy_id: directorData?.sy_id,
          user_id: directorData?.user_id,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [acc_id]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
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
            {director && (
              <div className="profile-text">
                <div className="user-name">{director.dir_name}</div>
                <button className="sign-out-button" onClick={handleSignOut}>SIGN OUT</button>
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
            <h1 className="incampus-title"> Accreditation Application Form</h1>
          </div>
        </div>
        <hr className="title-custom-line" />
        <div className="main-containerfaciform">
          <div className="accre-form-content-form">

              <div className="accre-form-content-section">
                <p className="accre-form-content-label2 font-bold-top">Organization Name: {accreditation?.orgname}</p>
                <p className="accre-form-content-label2 font-bold-top">Type: {accreditation?.type}</p>
              </div>


            <div className="accre-form-content-section">
                <label className="accre-form-content-label">1. Constitutions & By-Laws</label>
                <a href={`http://127.0.0.1/uploads/${accreditation?.constitution}`} target="_blank" rel="noopener noreferrer">
                  {accreditation?.constitution}
                </a>
              </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">2. List Members, Permanent Contact Numbers & Student Number</p>
              <table className="accre-form-content-table">
                <thead>
                  <tr>
                    <th>Student Number</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={index}>
                      <td>{member.stud_id}</td>
                      <td>{member.member_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">3. Officers</p>
              <table className="accre-form-content-table">
                <thead>
                  <tr>
                    <th>Student Number</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Contact Number</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((officer, index) => (
                    <tr key={index}>
                      <td>{officer.stud_id}</td>
                      <td>{officer.member_name}</td>
                      <td>{officer.member_position}</td>
                      <td>{officer.member_contact}</td>
                      <td>{officer.member_email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.act_name}</td>
                      <td>{activity.outcomes}</td>
                      <td>{activity.time}</td>
                      <td>{activity.target_group}</td>
                      <td>{activity.persons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">5. Adviser's Letter of Acceptance</p>
              <a href={`http://127.0.0.1/uploads/${accreditation?.adv_letter}`} target="_blank" rel="noopener noreferrer">
                {accreditation?.adv_letter}
              </a>
            </div>

            <div className="accre-form-content-section">
              <p className="accre-form-content-label font-bold">6. Appendices</p>
              <a href={`http://127.0.0.1/uploads/${accreditation?.appendices}`} target="_blank" rel="noopener noreferrer">
                {accreditation?.appendices}
              </a>
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
};

export default ViewAccreditationForm;
