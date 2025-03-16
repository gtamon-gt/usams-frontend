import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrgDetails.css';
import logo from '/unc_logo.png'; 

const tabs = ["Events", "Officers", "Members", "Constitutions & By-Laws", "Apply"];

interface Organization {
  org_id: string;
  org_name: string;
  org_type: string;
  org_tag: string;
  org_desc: string;
  org_img: string;
  org_header: string;
}

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

interface Member {
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

const OrgDetails: React.FC = () => {
  const { org_id } = useParams<{ org_id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Events");
  const [selectedEventSY, setSelectedEventSY] = useState<string>("SY 2023-2024");
  const [selectedEventType, setSelectedEventType] = useState<string>("Concluded");
  const [selectedOfficerSY, setSelectedOfficerSY] = useState<string>("SY 2023-2024");
  const [selectedMemberSY, setSelectedMemberSY] = useState<string>("SY 2023-2024");
  const [selectedSummarySY, setSelectedSummarySY] = useState<string>("SY 2023-2024");
  const navigate = useNavigate();
  const [eventCount, setEventCount] = useState<number>(0);
  const [officerCount, setOfficerCount] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        const res = await axios.get("http://localhost:8800/organizations");
        const org = res.data.find((o: Organization) => o.org_id === org_id);
        setOrganization(org || null);

        const eventRes = await axios.get("http://localhost:8800/events");
        const orgEvents = eventRes.data.filter((event: Event) => event.org_id === org_id);
        setEvents(orgEvents);

        const membersRes = await axios.get("http://localhost:8800/members");
        const orgMembers = membersRes.data.filter((member: Member) => member.org_id === org_id);
        setMembers(orgMembers);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching organization details:", err);
        setError("Failed to load organization details.");
        setLoading(false);
      }
    };
    fetchOrgDetails();
  }, [org_id]);

  useEffect(() => {
    updateCounts();
  }, [selectedSummarySY, events, members]);
  

  const updateCounts = () => {
    setEventCount(events.filter(event => event.eventSY === selectedSummarySY).length);
    setMemberCount(members.filter(member => member.stud_sy === selectedSummarySY).length);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Events":
        const filteredEvents = events.filter(event => 
          event.eventSY === selectedEventSY && event.event_type === selectedEventType
        );
        return (
          <div className="events-container">
            <div className="sorting-container">
              <div className="sorting-left">
                <select value={selectedEventSY} onChange={e => setSelectedEventSY(e.target.value)}>
                  <option value="SY 2023-2024">SY 2023-2024</option>
                  <option value="SY 2024-2025">SY 2024-2025</option>
                </select>
                <select value={selectedEventType} onChange={e => setSelectedEventType(e.target.value)}>
                  <option value="Concluded">Concluded</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <div className="sorting-right">
                {filteredEvents.length} results
              </div>
            </div>
            {filteredEvents.map(event => (
              <div key={event.event_key} className="event-item">
                <img src={`http://127.0.0.1/uploads/${event.event_img}`} alt={event.event_name} className="event-thumbnail" />
                <div className="event-details">
                  <div className="event-name">{event.event_name}</div>
                  <div className="event-date">{event.event_date}</div>
                  <div className="event-description">{event.event_desc}</div>
                </div>
                <div className="event-view-button">
                  <Link to={`/event/${event.event_key}`} className="event-view-button-button">View</Link>
                </div>
              </div>
            ))}
          </div>
        );
      case "Members":
        const filteredMembers = members.filter(member => member.stud_sy === selectedMemberSY);
        return (
          <div className="officers-container">
            <div className="sorting-container">
              <div className="sorting-left">
                <select value={selectedMemberSY} onChange={e => setSelectedMemberSY(e.target.value)}>
                  <option value="SY 2023-2024">SY 2023-2024</option>
                  <option value="SY 2024-2025">SY 2024-2025</option>
                </select>
              </div>
              <div className="sorting-right">
                {filteredMembers.length} results
              </div>
            </div>
            {filteredMembers.map(member => (
              <div key={member.stud_key} className="officer-item">
                <img src={`http://127.0.0.1/uploads/${member.stud_img}`} alt={member.stud_name} className="officer-pfp" />
                <div className="officer-details">
                  <div className="officer-name">{member.stud_name}</div>
                  <div className="officer-position">{member.stud_id}</div>
                </div>
                <div className="event-view-button">
                  <Link to={`/member/${member.stud_id}`} className="event-view-button-button">View</Link>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
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

      <div className="spacer"></div>
  
      <div className="main-content2">
        <div className="org-details-container">
          <div className="org-details-header">
            <img src={`http://127.0.0.1/uploads/${organization.org_header}`} alt={organization.org_name} />
          </div>
          <div className="org-details-content">
            <div className="org-img">
              <img src={`http://127.0.0.1/uploads/${organization.org_img}`} alt={organization.org_name} />
            </div>
            <div className="org-info">
              <div className={`org-type ${organization.org_type === 'Academic' ? 'academic' : 'non-academic'}`}>
                {organization.org_type}
              </div>
              <h1 className="org-name">{organization.org_name}</h1>
              <div className="org-desc">{organization.org_desc}</div>
            </div>
          </div>
          <div className="navbar-container">
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
          <div className="navbar-content">
            {renderTabContent()}
          </div>
        </div>
        {/* <div className="org-expanded">
          <h1 className="org-summary"> Organization Summary </h1>
          <div className="school-year-dropdown">
            <label htmlFor="school-year">School Year:</label>
            <select
              id="school-year"
              value={selectedSummarySY}
              onChange={(e) => {
                setSelectedSummarySY(e.target.value);
                updateCounts(); 
              }}
            >
              <option value="SY 2023-2024">SY 2023-2024</option>
              <option value="SY 2024-2025">SY 2024-2025</option>
            </select>
          </div>
          <div className="line-summary"></div>
          <div className="counts-container">
            <div className="count-item">
            <div className="count-number">{eventCount}</div>
              <div className="count-label">Events</div>
            </div>
            <div className="count-item">
              <div className="count-number">{officerCount}</div>
              <div className="count-label">Officers</div>
            </div>
            <div className="count-item">
              <div className="count-number">{memberCount}</div>
              <div className="count-label">Members</div>
            </div>
          </div>
        </div> */}
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

export default OrgDetails;