import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['/pic1.png', '/pic2.jpg', '/pic3.jpg', '/pic4.jpg', '/pic5.jpg', '/pic6.jpg']; // paths to your images in slideshow

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000); // change slide every 3 seconds

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setErrorMessage('');
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form submitted');
      // validate user credentials
      const response = await axios.post('http://localhost:8800/users/login', {
        user_id: username,
        user_password: password,
        user_role: userRole
      });

      if (response.data.success) {
        console.log('User credentials valid');
        const userId = response.data.user_id;

        // Set success message before navigating
        setErrorMessage('Login successful');

        // Add a slight delay before navigating
        setTimeout(() => {
          // Navigate to Home with userId in state
          navigate('/home', { state: { userId, userRole } });
        }, 500); // 500 milliseconds delay

        setTimeout(() => {
          // Navigate based on user role
          switch (userRole) {
            case 'student':
              navigate('/home', { state: { userId, userRole } });
              break;
            case 'organization':
              navigate('/home', { state: { userId, userRole } });
              break;
            case 'adviser':
              navigate('/dashboard-adviser', { state: { userId, userRole } });
              break;
            case 'dean':
              navigate('/dean-approval', { state: { userId } });
              break;
            case 'osa_director':
              navigate('/dashboard-dsa', { state: { userId } });
              break;
            case 'activity_approver':
                navigate('/dsaa-approval', { state: { userId } });
                break;
            case 'facility_approver':
                navigate('/dashboard-gbm', { state: { userId } });
                break;
            case 'security guard':
                navigate('/ueplist-security', { state: { userId } });
                break;
            default:
              throw new Error('Invalid user role');
          }
        }, 500); // 500 milliseconds delay
      } else {
        console.error('Invalid user credentials');
        setErrorMessage('Invalid user credentials');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          setErrorMessage('Invalid user credentials');
        } else {
          console.error('Error during login:', axiosError);
          setErrorMessage('An error occurred during login');
        }
      } else {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setErrorMessage('');
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

      <div className="login-content">
        <div className="slideshow-container">
          <div className="slideshow">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Slide ${index + 1}`}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h3 className="login-title">Login</h3>
            <div className="form-group">
              <label htmlFor="role" className="role">Login As</label>
              <select
                id="role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="organization">Organization</option>
                <option value="adviser">Adviser</option>
                <option value="dean">Dean</option>
                <option value="osa_director">OSA Director</option>
                <option value="activity_approver">Activity Approver</option>
                <option value="facility_approver">Facility Approver</option>
                <option value="security guard">Security Guard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>

      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-box">
            <button className="close-button" onClick={closeAlert}>×</button>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

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
}

export default Login;