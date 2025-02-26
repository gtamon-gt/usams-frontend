import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import './UpdateOrg.css';
import axios from 'axios';

interface Organization {
  org_id: string;
  org_name: string;
  org_type: string;
  org_tag: string;
  org_desc: string;
  org_img: string;
  org_header: string;
  user_id: string;
}

interface Member {
  member_id: string;
  stud_id: string;
  org_id: string;
  sy_id: string;
  role: string;
}

interface Student {
  stud_key: string;
  stud_id: string;
  org_id: string;
  stud_dept: string;
  stud_type: string;
  stud_name: string;
  stud_position: string;
  stud_sy: string;
  stud_img: string;
}

interface User {
  user_id: string;
  user_role: string;
}

const UpdateOrgMembers: React.FC = () => {
  const { org_id } = useParams<{ org_id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMemberSY, setSelectedMemberSY] = useState<string>("SY 2024-2025");
  const [userInfo, setUserInfo] = useState<Organization | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("Members");

  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [updatedMember, setUpdatedMember] = useState<Member>({
    member_id: "",
    stud_id: "",
    org_id: "",
    sy_id: "",
    role: "",
  });
  const [newMemberImg, setNewMemberImg] = useState<File | null>(null);
  const [memberImgPreview, setMemberImgPreview] = useState<string | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [newMemberDialogOpen, setNewMemberDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Member>({
    member_id: "",
    stud_id: "",
    org_id: org_id as string,
    sy_id: "",
    role: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, organizationsResponse, membersResponse, studentsResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/organizations'),
          axios.get('http://localhost:8800/members'),
          axios.get('http://localhost:8800/students'),
        ]);

        setUsers(usersResponse.data);
        setOrganizations(organizationsResponse.data);
        setMembers(membersResponse.data);
        setStudents(studentsResponse.data);
        console.log('Fetched users:', usersResponse.data);
        console.log('Fetched organizations:', organizationsResponse.data);
        console.log('Fetched members:', membersResponse.data);
        console.log('Fetched students:', studentsResponse.data);
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
    if (userId && users.length > 0 && organizations.length > 0) {
      const user = users.find((u) => u.user_id === userId);
      if (user) {
        console.log('Found user:', user);
        const organization = organizations.find((o) => o.user_id === userId);
        if (organization) {
          console.log('Found organization:', organization);
          setUserInfo(organization);
          setOrganization(organization);
        } else {
          console.log('Organization not found for userId:', userId);
        }
      } else {
        console.log('User not found for userId:', userId);
      }
    }
  }, [userId, users, organizations]);

  const handleDeleteMember = async (member_id: string) => {
    try {
      console.log(`Deleting member with id: ${member_id}`);
      await axios.delete(`http://localhost:8800/members/delete/${member_id}`);
      console.log(`Member deleted: ${member_id}`);
      setMembers(members.filter(member => member.member_id !== member_id));
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("Failed to delete member.");
    }
  };

  const memberHandleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedMember({ ...updatedMember, [name]: value });
  };

  const memberHandleUpdate = async () => {
    const formData = new FormData();
    formData.append("stud_id", updatedMember.stud_id);
    formData.append("org_id", updatedMember.org_id);
    formData.append("sy_id", updatedMember.sy_id);
    formData.append("role", updatedMember.role);

    try {
      const response = await axios.post(`http://localhost:8800/members/edit/${updatedMember.member_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Member details updated successfully");
      setMembers(members.map(member => member.member_id === updatedMember.member_id ? response.data : member));
      memberCloseDialog();
    } catch (err) {
      console.error("Error updating member details:", err);
      alert("Failed to update member details.");
    }
  };

  const memberOpenDialog = (member: Member) => {
    setCurrentMember(member);
    setUpdatedMember(member);
    setMemberDialogOpen(true);
  };

  const memberCloseDialog = () => {
    setMemberDialogOpen(false);
    setCurrentMember(null);
  };

  const handleNewMemberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleNewMemberFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewMemberImg(file);
        setMemberImgPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleNewMemberSubmit = async () => {
    const newMemberKey = `member_${members.length + 1}`;

    const formData = new FormData();
    formData.append("member_id", newMemberKey);
    formData.append("stud_id", newMember.stud_id);
    formData.append("org_id", newMember.org_id);
    formData.append("sy_id", newMember.sy_id);
    formData.append("role", newMember.role);

    if (newMemberImg) {
      formData.append("stud_img", newMemberImg);
    }

    try {
      const response = await axios.post(`http://localhost:8800/members/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("New member added successfully");
      setMembers([...members, response.data]);
      setNewMemberDialogOpen(false);
      setNewMember({
        member_id: "",
        stud_id: "",
        org_id: org_id as string,
        sy_id: "",
        role: "",
      });
      setMemberImgPreview(null);
    } catch (err) {
      console.error("Error adding new member:", err);
      alert("Failed to add new member.");
    }
  };

  const openNewMemberDialog = () => {
    setNewMemberDialogOpen(true);
  };

  const closeNewMemberDialog = () => {
    setNewMemberDialogOpen(false);
    setMemberImgPreview(null);
  };

  const renderMembersTab = () => {
    const filteredMembers = members.filter(member => member.sy_id === selectedMemberSY && member.org_id === org_id);

    return (
      <div className="officers-container">
        <div className="sorting-container">
          <div className="sorting-left">
            <select value={selectedMemberSY} onChange={e => setSelectedMemberSY(e.target.value)}>
              <option value="SY 2024-2025">SY 2024-2025</option>
            </select>
            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              <option value="Members">Members</option>
              <option value="Officers">Officers</option>
            </select>
          </div>
          <div className="sorting-right">
            {filteredMembers.length} results
          </div>
        </div>
        {filteredMembers.map(member => {
        const student = students.find(student => student.stud_id === member.stud_id);
        if (student) {
          if (selectedRole === "Officers" && (!member.role || member.role.trim() === "")) {
            return null;
          }
          return (
            <div key={member.member_id} className="officer-item">
              <img src={`http://127.0.0.1/uploads/${student.stud_img}`} alt={student.stud_name} className="officer-pfp" />
              <div className="officer-details">
                <div className="officer-name">{student.stud_name}</div>
                {selectedRole === "Members" ? (
                  <div className="officer-position">{student.stud_id}</div>
                ) : (
                  <div className="officer-position">{member.role}</div>
                )}
              </div>
              <div className="event-view-button">
                <button className="deleteEvent-button" onClick={() => handleDeleteMember(member.member_id)}>
                  <img src="/delete.png" alt="file icon" className="iconss" />
                  Delete
                </button>
                <button className="editEvent-button" onClick={() => memberOpenDialog(member)}>
                  <img src="/edit.png" alt="file icon" className="iconss" />
                  Edit
                </button>
              </div>
            </div>
          );
        }
        return null;
      })}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!organization) {
    return <div>No organization found.</div>;
  }

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
            <a href="/" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="#" className="navbar-link">OSA Services</a>
          </div>
        </div>
      </div>

      <div className="main-content5">
        <h1 className="update-title">Update Organization Members & Officers</h1>
        <p className="instructions">Update your members' and officers' information.</p>
        <hr className="title-custom-line" />
        {renderMembersTab()}
      </div>

      {memberDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>Update Member</h2>
            <label htmlFor="stud_id">Student ID</label>
            <input type="text" id="stud_id" name="stud_id" value={updatedMember.stud_id} onChange={memberHandleInputChange} />
            <label htmlFor="sy_id">School Year</label>
            <input type="text" id="sy_id" name="sy_id" value={updatedMember.sy_id} onChange={memberHandleInputChange} />
            <label htmlFor="role">Role</label>
            <input type="text" id="role" name="role" value={updatedMember.role} onChange={memberHandleInputChange} />

            <button className="update-button" onClick={memberHandleUpdate}>Update Member</button>
            <button className="cancel-button" onClick={memberCloseDialog}>Cancel</button>
          </div>
        </div>
      )}

      {newMemberDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>Add New Member</h2>
            <label htmlFor="stud_id">Student ID</label>
            <input type="text" id="stud_id" name="stud_id" value={newMember.stud_id} onChange={handleNewMemberInputChange} />
            <label htmlFor="sy_id">School Year</label>
            <input type="text" id="sy_id" name="sy_id" value={newMember.sy_id} onChange={handleNewMemberInputChange} />
            <label htmlFor="role">Role</label>
            <input type="text" id="role" name="role" value={newMember.role} onChange={handleNewMemberInputChange} />

            <label htmlFor="stud_img">Student Image</label>
            <input type="file" id="stud_img" accept="image/*" onChange={handleNewMemberFileChange} />
            {memberImgPreview && <img src={memberImgPreview} alt="Member Preview" />}

            <button onClick={handleNewMemberSubmit}>Add Member</button>
            <button onClick={closeNewMemberDialog}>Cancel</button>
          </div>
        </div>
      )}

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

export default UpdateOrgMembers;