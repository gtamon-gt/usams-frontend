import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './EventDetails.css';
import logo from '/unc_logo.png';

const tabs = ["Documentation", "Reports"];

interface Event {
  event_key: string;
  event_date: string;
  event_name: string;
  event_desc: string;
  event_img: string;
  org_id: string;
  event_type: string;
  eventSY: string;
}

interface DocumentationImage {
  docu_key: string;
  event_key: string;
  image_name: string;
}

const EventDetails: React.FC = () => {
  const { event_key } = useParams<{ event_key: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [documentation, setDocumentation] = useState<DocumentationImage[]>([]);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Documentation");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await axios.get("http://localhost:8800/events");
        const eventDetails = res.data.find((e: Event) => e.event_key === event_key);
        setEvent(eventDetails || null);

        const docuRes = await axios.get("http://localhost:8800/documentation_images");
        const docuImages = docuRes.data.filter((docu: DocumentationImage) => docu.event_key === event_key);
        setDocumentation(docuImages || null);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [event_key]);

  const renderTabContent = () => {
    switch (activeTab) {
        case "Documentation":
          return (
            console.log(documentation),
            <div className="documentation">
              <div className="documentation-gallery">
                {documentation && documentation.length > 0 ? (
                  documentation.map((doc, index) => (
                    <div key={index} className="documentation-item">
                      <img
                        src={`http://127.0.0.1/uploads/${doc.image_name}`}
                        alt={`Documentation ${index + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  <p>No documentation images available.</p>
                )}
              </div>
            </div>
          );
        case "Reports":
            return (
            <div className="reports">
              <h3 className="reports-title"> Financial Report </h3>
              <ul className="cbl-list">
                  <li className="cbl-item">
                      <img src="/file-icon.png" alt="file icon" className="cbl-icon" />
                      <span className="cbl-filename">No Document Attached</span>
                  </li>
              </ul>
              <h3 className="reports-title"> Accomplishment Report </h3>
              <ul className="cbl-list">
                  <li className="cbl-item">
                      <img src="/file-icon.png" alt="file icon" className="cbl-icon" />
                      <span className="cbl-filename">No Document Attached</span>
                  </li>
              </ul>
            </div>
            );
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
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
            <img className="pfp-1-icon" loading="lazy" alt="" src="/pfp.jpg" />
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

      <div className="main-content3">
        <div className="events-details-container">
        <div className="eventImg">
            <img src={`http://127.0.0.1/uploads/${event.event_img}`} alt={event.event_name}/>
          </div>
          <div className="eventDetails">
            <h1 className="event-name">{event.event_name}</h1>
            <p>{event.event_desc}</p>
            <p>{event.event_date}</p>
            <div className="navbar-container-event">
              {tabs.map(tab => (
                <div
                  key={tab}
                  className={`navbar-item ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="event-content">
            {renderTabContent()}
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

export default EventDetails;
