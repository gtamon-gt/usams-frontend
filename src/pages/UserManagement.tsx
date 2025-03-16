import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserManagement.css';

interface User {
  user_id: string;
  user_password: string;
  user_role: string;
}

interface Director {
  dir_id: string;
  dir_name: string;
  sy_id: string;
  user_id: string;
}

interface Approver {
  employee_id: string;
  user_id: string;
  sy_id: string;
  employee_name: string;
  employee_position: string;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    user_id: '',
    user_password: '',
    user_role: '',
  });
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [director, setDirector] = useState<Director | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:8800/users');
        setUsers(response.data);
        setFilteredUsers(response.data);

        const approversResponse = await axios.get<Approver[]>('http://localhost:8800/approvers');
        const directorData = approversResponse.data.find(approver => approver.employee_position === 'OSA Director');

        if (directorData) {
          setDirector({
            dir_id: directorData.employee_id,
            dir_name: directorData.employee_name,
            sy_id: directorData.sy_id,
            user_id: directorData.user_id,
          });
        }
      } catch (error) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      (selectedRole === 'All' || user.user_role.replace('_', ' ') === selectedRole) &&
      (user.user_id.includes(searchQuery) || user.user_role.includes(searchQuery))
    );
    setFilteredUsers(filtered);
  }, [selectedRole, searchQuery, users]);

  const handleDeleteUser = async (user_id: string) => {
    try {
      await axios.delete(`http://localhost:8800/users/delete/${user_id}`);
      setUsers(users.filter(user => user.user_id !== user_id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setNewUser(user);
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (currentUser) {
      try {
        await axios.post(`http://localhost:8800/users/edit/${currentUser.user_id}`, newUser);
        setUsers(users.map(user => user.user_id === currentUser.user_id ? newUser : user));
        setEditDialogOpen(false);
      } catch (err) {
        console.error("Error updating user:", err);
        alert("Failed to update user.");
      }
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post<User>('http://localhost:8800/users/add', newUser);
      setUsers([...users, response.data]);
      setAddDialogOpen(false);
      setNewUser({
        user_id: '',
        user_password: '',
        user_role: '',
      });
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user.");
    }
  };

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
            <img src="/unc_logo.png" alt="Logo" className="logo-img" />
            <div className="text-section">
              <div className="one-text-section">UNIVERSITY STUDENT AFFAIRS</div>
              <div className="two-text-section">MANAGEMENT SYSTEM</div>
            </div>
          </div>
          <div className="right-section">
            <div className="ellipse-div" />
            <img className="vector-icon" loading="lazy" alt="" src="/vector.svg" />
            <img className="pfp-1-icon" loading="lazy" alt="" src="/default.png" />
            <div className="profile-text">
              <div className="user-name">{director?.dir_name || 'Admin'}</div>
              <button className="sign-out-button" onClick={handleSignOut}>SIGN OUT</button>
            </div>
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

      <div className="spacer"></div>

      <div className="user-management-main-content">
        <h1 className="user-management-update-title">User Management</h1>
        <p className="user-management-instructions">Manage users and their roles.</p>
        <hr className="user-management-title-custom-line" />
        <div className="user-management-controls">
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="OSA Director">OSA Director</option>
            <option value="Student">Student</option>
            <option value="Organization">Organization</option>
            <option value="Activity Approver">Activity Approver</option>
            <option value="Facility Approver">Facility Approver</option>
            <option value="Adviser">Adviser</option>
            <option value="Dean">Dean</option>
            <option value="Security Guard">Security Guard</option>
          </select>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setAddDialogOpen(true)}>Add User</button>
        </div>
        <div className="user-management-user-list">
          {filteredUsers.map(user => (
            <div key={user.user_id} className="user-management-user-item">
              <div className="user-management-user-details">
                <div className="user-management-user-id">{user.user_id}</div>
                <div className="user-management-user-role">{user.user_role.replace('_', ' ')}</div>
              </div>
              <div className="user-management-user-actions">
                <button className="user-management-editEvent-button" onClick={() => handleEditUser(user)}>Edit</button>
                <button className="user-management-deleteEvent-button" onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editDialogOpen && (
        <div className="user-management-dialog-overlay">
          <div className="user-management-dialog-content">
            <h2>Edit User</h2>
            <label htmlFor="user_id">User ID</label>
            <input type="text" id="user_id" name="user_id" value={newUser.user_id} onChange={e => setNewUser({ ...newUser, user_id: e.target.value })} />
            <label htmlFor="user_password">Password</label>
            <input type="password" id="user_password" name="user_password" value={newUser.user_password} onChange={e => setNewUser({ ...newUser, user_password: e.target.value })} />
            <label htmlFor="user_role">Role</label>
            <select id="user_role" name="user_role" value={newUser.user_role} onChange={e => setNewUser({ ...newUser, user_role: e.target.value })}>
              <option value="OSA_Director">OSA Director</option>
              <option value="Student">Student</option>
              <option value="Organization">Organization</option>
              <option value="Activity_Approver">Activity Approver</option>
              <option value="Facility_Approver">Facility Approver</option>
              <option value="Adviser">Adviser</option>
              <option value="Dean">Dean</option>
              <option value="Security_Guard">Security Guard</option>
            </select>
            <button className="user-management-update-button" onClick={handleUpdateUser}>Update User</button>
            <button className="user-management-cancel-button" onClick={() => setEditDialogOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {addDialogOpen && (
        <div className="user-management-dialog-overlay">
          <div className="user-management-dialog-content">
            <h2>Add User</h2>
            <label htmlFor="user_id">User ID</label>
            <input type="text" id="user_id" name="user_id" value={newUser.user_id} onChange={e => setNewUser({ ...newUser, user_id: e.target.value })} />
            <label htmlFor="user_password">Password</label>
            <input type="password" id="user_password" name="user_password" value={newUser.user_password} onChange={e => setNewUser({ ...newUser, user_password: e.target.value })} />
            <label htmlFor="user_role">Role</label>
            <select id="user_role" name="user_role" value={newUser.user_role} onChange={e => setNewUser({ ...newUser, user_role: e.target.value })}>
              <option value="OSA_Director">OSA Director</option>
              <option value="Student">Student</option>
              <option value="Organization">Organization</option>
              <option value="Activity_Approver">Activity Approver</option>
              <option value="Facility_Approver">Facility Approver</option>
              <option value="Adviser">Adviser</option>
              <option value="Dean">Dean</option>
              <option value="Security_Guard">Security Guard</option>
            </select>
            <button className="user-management-update-button" onClick={handleAddUser}>Add User</button>
            <button className="user-management-cancel-button" onClick={() => setAddDialogOpen(false)}>Cancel</button>
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

export default UserManagement;
