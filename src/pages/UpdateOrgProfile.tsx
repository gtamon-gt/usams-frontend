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

interface User {
  user_id: string;
  user_role: string;
}

const UpdateOrgProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const { org_id } = useParams<{ org_id: string }>();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userInfo, setUserInfo] = useState<Organization | null>(null);
  const [updatedOrganization, setUpdatedOrganization] = useState<Organization>({
    org_id: "",
    org_name: "",
    org_type: "",
    org_tag: "",
    org_desc: "",
    org_img: "",
    org_header: "",
    user_id: "",
  });
  const [newOrgImg, setNewOrgImg] = useState<File | null>(null);
  const [newOrgHeader, setNewOrgHeader] = useState<File | null>(null);
  const [orgImgPreview, setOrgImgPreview] = useState<string | null>(null);
  const [orgHeaderPreview, setOrgHeaderPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, organizationsResponse] = await Promise.all([
          axios.get('http://localhost:8800/users'),
          axios.get('http://localhost:8800/organizations'),
        ]);

        setUsers(usersResponse.data);
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
          setUpdatedOrganization(organization);
        } else {
          console.log('Organization not found for userId:', userId);
        }
      } else {
        console.log('User not found for userId:', userId);
      }
    }
  }, [userId, users, organizations]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedOrganization({ ...updatedOrganization, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (type === "org_img") {
          setNewOrgImg(file);
          setOrgImgPreview(reader.result as string);
          setUpdatedOrganization({ ...updatedOrganization, org_img: file.name });
        } else {
          setNewOrgHeader(file);
          setOrgHeaderPreview(reader.result as string);
          setUpdatedOrganization({ ...updatedOrganization, org_header: file.name });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("org_name", updatedOrganization.org_name);
    formData.append("org_type", updatedOrganization.org_type);
    formData.append("org_tag", updatedOrganization.org_tag);
    formData.append("org_desc", updatedOrganization.org_desc);
    if (newOrgImg) {
      formData.append("org_img", newOrgImg);
    } else {
      formData.append("org_img", updatedOrganization.org_img);
    }
    if (newOrgHeader) {
      formData.append("org_header", newOrgHeader);
    } else {
      formData.append("org_header", updatedOrganization.org_header);
    }

    try {
      const response = await axios.post(`http://localhost:8800/organizations/${org_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Organization details updated successfully");
      setOrganization(response.data);
    } catch (err) {
      console.error("Error updating organization details:", err);
      alert("Failed to update organization details.");
    }
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

      <div className="spacer"></div>

      <div className="main-content5">
        <h1 className="update-title">Update Organization Information</h1>
        <p className="instructions">Update your organization's information.</p>
        <hr className="title-custom-line" />

        <div className="event-item2">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="form-container">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="org_img">Organization Image</label>
                  {orgImgPreview ? (
                    <img src={orgImgPreview} alt="Org Img Preview" className="preview-image" />
                  ) : updatedOrganization.org_img ? (
                    <img src={`http://127.0.0.1/uploads/${updatedOrganization.org_img}`} alt="Org Img" className="preview-image" />
                  ) : null}
                  <input type="file" id="org_img" accept="image/*" onChange={(e) => handleFileChange(e, "org_img")} />
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="org_name">Organization Name</label>
                    <input type="text" id="org_name" name="org_name" value={updatedOrganization.org_name} onChange={handleInputChange} />
                  </div>
                  <div className="form-group-inline">
                    <div className="form-group">
                      <label htmlFor="org_type">Organization Type</label>
                      <input type="text" id="org_type" name="org_type" value={updatedOrganization.org_type} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="org_tag">Organization Tag</label>
                      <input type="text" id="org_tag" name="org_tag" value={updatedOrganization.org_tag} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="org_desc">Organization Description</label>
                  <textarea id="org_desc" name="org_desc" value={updatedOrganization.org_desc} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="org_header">Organization Header</label>
                  {orgHeaderPreview ? (
                    <img src={orgHeaderPreview} alt="Org Header Preview" className="preview-image2" />
                  ) : updatedOrganization.org_header ? (
                    <img src={`http://127.0.0.1/uploads/${updatedOrganization.org_header}`} alt="Org Header" className="preview-image2" />
                  ) : null}
                  <input type="file" id="org_header" accept="image/*" onChange={(e) => handleFileChange(e, "org_header")} />
                </div>
              </div>
              <button className="update-button" onClick={handleUpdate}>Update Basic Information</button>
            </div>
          )}
        </div>
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

export default UpdateOrgProfile;