import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import logo from '/unc_logo.png';
import './ViewSubmittedProposals.css';
import axios from 'axios';

interface Accreditation {
  acc_id: string;
  stud_id: string;
  constitution: string;
  orgname: string;
  type: string;
  adv_letter: string;
  appendices: string;
  status: string;
  date_submitted: Date;
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

interface Comment {
  comment_key: string;
  acc_id: string;
  comment_content: string;
  date: Date;
}

const ManageAccreditationApplication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stud_id } = useParams<{ stud_id: string }>();
  const { userId } = location.state || {};

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});

  const [users, setUsers] = useState<User[]>([]);

  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get(`http://localhost:8800/users`);
        setUsers(usersRes.data);

        const studentsRes = await axios.get(`http://localhost:8800/students`);
        setStudents(studentsRes.data);

        const accreditationsRes = await axios.get(`http://localhost:8800/accreditations`);
        setAccreditations(accreditationsRes.data);

        setLoading(false);

        const commentsRes = await axios.get('http://localhost:8800/comments-accreditation');
        const commentsData = commentsRes.data;
        const commentsMap: { [key: string]: Comment[] } = {};
        accreditations.forEach((accreditation: Accreditation) => {
          commentsMap[accreditation.acc_id] = commentsData.filter((comment: Comment) => comment.acc_id === accreditation.acc_id);
        });
        setComments(commentsMap);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [student]);

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

  const handleDeleteAccreditation = async (acc_id: string) => {
    try {
      await axios.delete(`http://localhost:8800/accreditations/${acc_id}`);
      setAccreditations(accreditations.filter(acc => acc.acc_id !== acc_id));
      alert('Accreditation application successfully deleted.');
    } catch (err) {
      console.error('Error deleting accreditation application:', err);
      alert('Failed to delete accreditation application.');
    }
  };

  const toggleComments = (acc_id: string) => {
    setShowComments(prevState => ({
      ...prevState,
      [acc_id]: !prevState[acc_id]
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

  const filteredAccreditations = accreditations.filter(acc => acc.stud_id === stud_id);

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
                    {student?.stud_name}
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
          <h2>Submitted Accreditation Applications</h2>
          <p className="instructions">View and manage the accreditation applications submitted by students.</p>
        </div>
        <hr className="title-custom-line" />
        {filteredAccreditations.length > 0 ? (
          <div className="proposals-list">
            <div className="proposal-row header-row">
              <div className="proposal-cell">Date Submitted</div>
              <div className="proposal-cell">Organization Name</div>
              <div className="proposal-cell">Type</div>
              <div className="proposal-cell">Status</div>
              <div className="proposal-cell">Actions</div>
            </div>
            {filteredAccreditations.map(accreditation => (
              <React.Fragment key={accreditation.acc_id}>
                <div className="proposal-row">
                  <div className="proposal-cell">
                    {new Date(accreditation.date_submitted).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="proposal-cell">{accreditation.orgname}</div>
                  <div className="proposal-cell">{accreditation.type}</div>
                  <div className="proposal-cell">{accreditation.status}</div>
                  <div className="proposal-cell ext">
                    <button onClick={() => navigate(`/viewaccreditationform/${accreditation.acc_id}`, { state: { userId, userInfo, student } })}>View</button>
                    <button onClick={() => navigate(`/update-accreditation/${accreditation.acc_id}`, { state: { userId, userInfo, student } })}>Update</button>
                    <button onClick={() => handleDeleteAccreditation(accreditation.acc_id)}>Delete</button>
                    <button onClick={() => toggleComments(accreditation.acc_id)}>
                      {showComments[accreditation.acc_id] ? 'Hide Comments' : 'Show Comments'}
                    </button>
                    {accreditation.status === 'Approved' && (
                      <button onClick={() => navigate(`/view-accreditation-pass/${accreditation.acc_id}`, { state: { userId, userInfo, student, accreditation } })}>View Pass</button>
                    )}
                  </div>
                  {showComments[accreditation.acc_id] && (
                    <tr>
                      <td colSpan={5}>
                        <div className="comments-section">
                          {comments[accreditation.acc_id] && comments[accreditation.acc_id].length > 0 ? (
                            comments[accreditation.acc_id].map((comment) => (
                              <div key={comment.comment_key} className="comment-item">
                                <p><strong>{comment.comment_content}</strong></p>
                                <p><small>{new Date(comment.date).toLocaleString()}</small></p>
                              </div>
                            ))
                          ) : (
                            <p>No comments available.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>No accreditation applications available for management.</p>
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

export default ManageAccreditationApplication;