import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '/unc_logo.png'; 
import './UpdateOrg.css';
import axios from 'axios';

const tabs = ["Basic Information", "Events", "Officers", "Members", "Constitutions & By-Laws", "Membership Form"];

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

interface Officer {
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

const UpdateOrg: React.FC = () => {
  const { org_id } = useParams<{ org_id: string }>();
  const { event_key } = useParams<{ event_key: string }>();
  const { stud_key } = useParams<{ stud_key: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Basic Information");
  const [selectedEventSY, setSelectedEventSY] = useState<string>("SY 2023-2024");
  const [selectedEventType, setSelectedEventType] = useState<string>("Concluded");
  const [selectedOfficerSY, setSelectedOfficerSY] = useState<string>("SY 2023-2024");
  const [selectedMemberSY, setSelectedMemberSY] = useState<string>("SY 2023-2024");
  const [updatedOrganization, setUpdatedOrganization] = useState<Organization>({
    org_id: "",
    org_name: "",
    org_type: "",
    org_tag: "",
    org_desc: "",
    org_img: "",
    org_header: "",
  });
  const [newOrgImg, setNewOrgImg] = useState<File | null>(null);
  const [newOrgHeader, setNewOrgHeader] = useState<File | null>(null);
  const [orgImgPreview, setOrgImgPreview] = useState<string | null>(null);
  const [orgHeaderPreview, setOrgHeaderPreview] = useState<string | null>(null);
  const [newEventImg, setNewEventImg] = useState<File | null>(null);
  const [newOfficerImg, setNewOfficerImg] = useState<File | null>(null);
  const [eventImgPreview, setEventImgPreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [updatedEvent, setUpdatedEvent] = useState<Event>({
    event_key: "",
    event_date: "",
    event_name: "",
    event_desc: "",
    event_img: "",
    org_id: "",
    event_type: "",
    eventSY: "",
  });
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    event_key: "",
    event_date: "",
    event_name: "",
    event_desc: "",
    event_img: "",
    org_id: org_id as string,
    event_type: "",
    eventSY: "",
  });
  const [officerDialogOpen, setOfficerDialogOpen] = useState(false);
  const [currentOfficer, setCurrentOfficer] = useState<Officer | null>(null);
  const [officerImgPreview, setOfficerImgPreview] = useState<string | null>(null);
  const [updatedOfficer, setUpdatedOfficer] = useState<Officer>({
    stud_key: "",
    stud_id: "",
    org_id: "",
    stud_dept: "",
    stud_type: "",
    stud_name: "",
    stud_position: "",
    stud_sy: "",
    stud_img: "",
  });
  const [newOfficerDialogOpen, setNewOfficerDialogOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState<Officer>({
    stud_key: "",
    stud_id: "",
    org_id: org_id as string,
    stud_dept: "",
    stud_type: "",
    stud_name: "",
    stud_position: "",
    stud_sy: "",
    stud_img: "",
  });

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        const orgRes = await axios.get(`http://localhost:8800/organizations/`);
        const org = orgRes.data.find((o: Organization) => o.org_id === org_id);
        setOrganization(org || null);

        if (org) {
          setOrganization(org);
          setUpdatedOrganization(org); 
        } else {
          setError("Organization not found.");
        }

        const studRes = await axios.get('http://localhost:8800/students/');
        setStudents(studRes.data || []);

        const eventRes = await axios.get("http://localhost:8800/events");
        const orgEvents = eventRes.data.filter((event: Event) => event.org_id === org_id);
        setEvents(orgEvents);

        if (orgEvents) {
          setCurrentEvent(orgEvents);
          setUpdatedEvent(orgEvents); 
        } else {
          setError("Event not found.");
        }

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

const eventHandleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setUpdatedEvent({ ...updatedEvent, [name]: value });
};

const eventHandleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
        setNewEventImg(file);
        setEventImgPreview(reader.result as string);
        setUpdatedEvent({ ...updatedEvent, event_img: file.name });
    };

    reader.readAsDataURL(file);
  }
};

const eventHandleUpdate = async () => {
  const formData = new FormData();
  formData.append("event_date", updatedEvent.event_date);
  formData.append("event_name", updatedEvent.event_name);
  formData.append("event_desc", updatedEvent.event_desc);
  formData.append("event_type", updatedEvent.event_type);
  formData.append("eventSY", updatedEvent.eventSY);
  if (newEventImg) {
    formData.append("event_img", newEventImg);
  } else {
    formData.append("event_img", updatedEvent.event_img);
  }

  try {
    const response = await axios.post(`http://localhost:8800/events/edit/${updatedEvent.event_key}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    alert("Event details updated successfully");
    setEvents(events.map(event => event.event_key === updatedEvent.event_key ? response.data : event));
    closeDialog();
  } catch (err) {
    console.error("Error updating event details:", err);
    alert("Failed to update event details.");
  }
};

  const openDialog = (event: Event) => {
    setCurrentEvent(event);
    setUpdatedEvent(event); 
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentEvent(null);
  };

  const handleNewEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleNewEventFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewEventImg(file);
        setEventImgPreview(reader.result as string);
        setNewEvent({ ...newEvent, event_img: file.name });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleNewEventSubmit = async () => {
    const newEventKey = `event_${events.length + 1}`;

    const formData = new FormData();
    formData.append("event_key", newEventKey);
    formData.append("event_date", newEvent.event_date);
    formData.append("event_name", newEvent.event_name);
    formData.append("event_desc", newEvent.event_desc);
    formData.append("event_type", newEvent.event_type);
    formData.append("eventSY", newEvent.eventSY);
    formData.append("org_id", newEvent.org_id);
    if (newEventImg) {
      formData.append("event_img", newEventImg);
    }

    try {
      const response = await axios.post(`http://localhost:8800/events/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("New event added successfully");
      setEvents([...events, response.data]);
      setNewEventDialogOpen(false);
      setNewEvent({
        event_key: "",
        event_date: "",
        event_name: "",
        event_desc: "",
        event_img: "",
        org_id: org_id as string, 
        event_type: "",
        eventSY: "",
      });
      setEventImgPreview(null);
    } catch (err) {
      console.error("Error adding new event:", err);
      alert("Failed to add new event.");
    }
  };

  const openNewEventDialog = () => {
    setNewEventDialogOpen(true);
  };

  const closeNewEventDialog = () => {
    setNewEventDialogOpen(false);
    setEventImgPreview(null);
  };

  const handleDeleteEvent = async (event_key: string) => {
    try {
        console.log(`Deleting event with key: ${event_key}`);
        await axios.delete(`http://localhost:8800/events/delete/${event_key}`);
        console.log(`Event deleted: ${event_key}`);
        setEvents(events.filter(event => event.event_key !== event_key));
    } catch (err) {
        console.error("Error deleting event:", err);
        alert("Failed to delete event.");
    }
};

const officerHandleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setUpdatedOfficer({ ...updatedOfficer, [name]: value });
};

const officerHandleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
        setNewOfficerImg(file);
        setOfficerImgPreview(reader.result as string);
        setUpdatedOfficer({ ...updatedOfficer, stud_img: file.name });
    };

    reader.readAsDataURL(file);
  }
};

const officerHandleUpdate = async () => {
  const formData = new FormData();
  formData.append("stud_id", updatedOfficer.stud_id);
  formData.append("stud_dept", updatedOfficer.stud_dept);
  formData.append("stud_type", updatedOfficer.stud_type);
  formData.append("stud_name", updatedOfficer.stud_name);
  formData.append("stud_position", updatedOfficer.stud_position);
  formData.append("stud_sy", updatedOfficer.stud_sy);

  if (newOfficerImg) {
    formData.append("stud_img", newOfficerImg);
  } else {
    formData.append("stud_img", updatedOfficer.stud_img);
  }

  try {
    const response = await axios.post(`http://localhost:8800/officers/edit/${updatedOfficer.stud_key}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    alert("Event details updated successfully");
    setOfficers(officers.map(officer => officer.stud_key === updatedOfficer.stud_key ? response.data : officer));
    officerCloseDialog(); 
  } catch (err) {
    console.error("Error updating event details:", err);
    alert("Failed to update event details.");
  }
};

  const officerOpenDialog = (officer: Officer) => {
    setCurrentOfficer(officer);
    setUpdatedOfficer(officer); 
    setOfficerDialogOpen(true);
  };


  const officerCloseDialog = () => {
    setOfficerDialogOpen(false);
    setCurrentOfficer(null);
  };

  const handleNewOfficerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOfficer({ ...newOfficer, [name]: value });
  };

  const handleNewOfficerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewOfficerImg(file);
        setOfficerImgPreview(reader.result as string);
        setNewOfficer({ ...newOfficer, stud_img: file.name });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleNewOfficerSubmit = async () => {
    const newOfficerKey = `stud_${students.length + 1}`;

    const formData = new FormData();
    formData.append("stud_key", newOfficerKey);
    formData.append("stud_id", newOfficer.stud_id);
    formData.append("stud_dept", newOfficer.stud_dept);
    formData.append("stud_type", newOfficer.stud_type);
    formData.append("stud_name", newOfficer.stud_name);
    formData.append("stud_position", newOfficer.stud_position);
    formData.append("stud_sy", newOfficer.stud_sy);
    formData.append("org_id", newOfficer.org_id);
    if (newOfficerImg) {
      formData.append("stud_img", newOfficerImg);
    }

    try {
      const response = await axios.post(`http://localhost:8800/officers/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("New event added successfully");
      setOfficers([...officers, response.data]);
      setNewOfficerDialogOpen(false);
      setNewOfficer({
        stud_key: "",
        stud_id: "",
        stud_dept: "",
        stud_type: "",
        stud_name: "",
        stud_position: "",
        org_id: org_id as string, 
        stud_sy: "",
        stud_img: "",
      });
      setOfficerImgPreview(null);
    } catch (err) {
      console.error("Error adding new officer:", err);
      alert("Failed to add new officer.");
    }
  };

  const openNewOfficerDialog = () => {
    setNewOfficerDialogOpen(true);
  };

  const closeNewOfficerDialog = () => {
    setNewOfficerDialogOpen(false);
    setOfficerImgPreview(null);
  };

  const handleDeleteOfficer = async (stud_key: string) => {
    try {
        console.log(`Deleting officer with key: ${stud_key}`);
        await axios.delete(`http://localhost:8800/officers/delete/${stud_key}`);
        console.log(`Officer deleted: ${stud_key}`);
        setOfficers(officers.filter(officer => officer.stud_key !== stud_key));
    } catch (err) {
        console.error("Error deleting officer:", err);
        alert("Failed to delete officer.");
    }
};

const handleDeleteMember = async (stud_key: string) => {
  try {
      console.log(`Deleting member with key: ${stud_key}`);
      await axios.delete(`http://localhost:8800/officers/delete/${stud_key}`);
      console.log(`Member deleted: ${stud_key}`);
      setMembers(members.filter(member => member.stud_key !== stud_key));
  } catch (err) {
      console.error("Error deleting member:", err);
      alert("Failed to delete member.");
  }
};

  const renderTabContent = () => {
    switch (activeTab) {
      case "Basic Information":
        return (
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
        );
        case "Events":
          const filteredEvents = events.filter(event => 
            event.eventSY === selectedEventSY && event.event_type === selectedEventType
          );
          return (
            <div className="events-container2">
              <div className="sorting-container3">
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
                    <button className="addEvent-button" onClick={() => openNewEventDialog()}>
                      <img src="/add.png" alt="file icon" className="iconss" />
                      Add Event</button>
                </div>
              </div>
              {filteredEvents.map(event => (
                <div key={event.event_key} className="event-item3">
                  <img src={`http://127.0.0.1/uploads/${event.event_img}`} alt={event.event_name} className="event-thumbnail" />
                  <div className="event-details">
                  <div className="event-name">{event.event_name}</div>
                  <div className="event-date">{event.event_date}</div>
                  <div className="event-description">{event.event_desc}</div>
                </div>
                <div className="event-view-button">
                  <button className="updateEvent-button" onClick={() => openDialog(event)}>
                  <img src="/edit.png" alt="file icon" className="iconss" />
                  Edit</button>
                  <button className="deleteEvent-button" onClick={() => handleDeleteEvent(event.event_key)}>
                  <img src="/delete.png" alt="file icon" className="iconss" />
                  Delete</button>
                  </div>
                </div>
              ))}
              {/* Dialog Box */}
              {dialogOpen && (
                <div className="dialog-overlay">
                  <div className="dialog-content">
                    <h2>Update Event</h2>
                    <label htmlFor="event_name">Event Name</label>
                    <input type="text" id="event_name" name="event_name" value={updatedEvent.event_name} onChange={eventHandleInputChange} />
                    <label htmlFor="event_date">Event Date</label>
                    <input type="text" id="event_date" name="event_date" value={updatedEvent.event_date} onChange={eventHandleInputChange} />
                    <label htmlFor="event_desc">Event Description</label>
                    <textarea id="event_desc" name="event_desc" value={updatedEvent.event_desc} onChange={eventHandleInputChange} />
                    <label htmlFor="event_img">Event Image</label>
                    <input type="file" id="event_img" accept="image/*" onChange={(e) => eventHandleFileChange(e, "event_img")} />
                    {eventImgPreview ? (
                      <img src={eventImgPreview} alt="Event Img Preview" className="preview-image-event" />
                    ) : updatedEvent.event_img ? (
                      <img src={`http://127.0.0.1/uploads/${updatedEvent.event_img}`} alt="Event Img" className="preview-image-event" />
                    ) : null}
                    <label htmlFor="event_type">Event Type</label>
                    <input type="text" id="event_type" name="event_type" value={updatedEvent.event_type} onChange={eventHandleInputChange} />
                    <label htmlFor="eventSY">School Year</label>
                    <input type="text" id="eventSY" name="eventSY" value={updatedEvent.eventSY} onChange={eventHandleInputChange} />

                    <button className="update-button" onClick={eventHandleUpdate}>Update Event</button>
                    <button className="cancel-button" onClick={closeDialog}>Cancel</button>
                  </div>
                </div>
              )}
            {newEventDialogOpen && (
              <div className="dialog-overlay">
                  <div className="dialog-content">
                    <h3>Add New Event</h3>
                    <div> <label htmlFor="new_event_name">Name:</label>
                      <input type="text" id="new_event_name" name="event_name" value={newEvent.event_name} onChange={handleNewEventInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="new_event_date">Date:</label>
                      <input
                        type="date"
                        id="new_event_date"
                        name="event_date"
                        value={newEvent.event_date}
                        onChange={handleNewEventInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="new_event_desc">Description:</label>
                      <textarea
                        id="new_event_desc"
                        name="event_desc"
                        value={newEvent.event_desc}
                        onChange={handleNewEventInputChange}
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="new_event_img">Image:</label>
                      <input
                        type="file"
                        id="new_event_img"
                        name="event_img"
                        onChange={handleNewEventFileChange}
                      />
                      {eventImgPreview && <img src={eventImgPreview} alt="Event Preview" />}
                    </div>
                    <div>
                      <label htmlFor="new_event_type">Type:</label>
                      <input
                        type="text"
                        id="new_event_type"
                        name="event_type"
                        value={newEvent.event_type}
                        onChange={handleNewEventInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="new_eventSY">School Year:</label>
                      <input
                        type="text"
                        id="new_eventSY"
                        name="eventSY"
                        value={newEvent.eventSY}
                        onChange={handleNewEventInputChange}
                      />
                    </div>
                    <button onClick={handleNewEventSubmit}>Add Event</button>
                    <button onClick={closeNewEventDialog}>Cancel</button>
                  </div>
                </div>
                )}
            </div>
          );
        case "Officers":
          const filteredOfficers = officers.filter(officer => officer.stud_sy === selectedOfficerSY);
          
          return (
            <div className="officers-container">
              <div className="sorting-container">
                <div className="sorting-left">
                  <select value={selectedOfficerSY} onChange={e => setSelectedOfficerSY(e.target.value)}>
                    <option value="SY 2023-2024">SY 2023-2024</option>
                    <option value="SY 2024-2025">SY 2024-2025</option>
                  </select>
                </div>
                <div className="sorting-right">
                  <button className="addOfficer-button" onClick={() => openNewOfficerDialog()}>
                  <img src="/add.png" alt="file icon" className="iconss" />
                  Add Officer</button>                </div>
              </div>
              {filteredOfficers.map(officer => (
                <div key={officer.stud_key} className="officer-item">
                  <img src={`http://127.0.0.1/uploads/${officer.stud_img}`} alt={officer.stud_name} className="officer-pfp" />
                  <div className="officer-details">
                    <div className="officer-name">{officer.stud_name}</div>
                    <div className="officer-position">{officer.stud_position}</div>
                  </div>
                  <div className="event-view-button">
                    <button className="editOfficer-button" onClick={() => officerOpenDialog(officer)}>
                      <img src="/edit.png" alt="file icon" className="iconss" />
                      Edit</button>
                    <button className="deleteOfficer-button" onClick={() => handleDeleteOfficer(officer.stud_key)}>
                      <img src="/delete.png" alt="file icon" className="iconss" />
                      Delete</button>
                  </div>
                </div>
              ))}
             {officerDialogOpen && (
              <div className="dialog-overlay">
                  <div className="dialog-content">
                    <h2>Update Officer</h2>
                    <label htmlFor="stud_id">Student ID</label>
                    <input type="text" id="stud_id" name="stud_id" value={updatedOfficer.stud_id} onChange={officerHandleInputChange} />
                    <label htmlFor="stud_name">Student Name</label>
                    <input type="text" id="stud_name" name="stud_name" value={updatedOfficer.stud_name} onChange={officerHandleInputChange} />
                    <label htmlFor="stud_dept">Student Dept</label>
                    <input type="text" id="stud_dept" name="stud_dept" value={updatedOfficer.stud_dept} onChange={officerHandleInputChange} />
                    <label htmlFor="stud_type">Student Type</label>
                    <input type="text" id="stud_type" name="stud_type" value={updatedOfficer.stud_type} onChange={officerHandleInputChange} />
                    <label htmlFor="stud_position">Position</label>
                    <input type="text" id="stud_position" name="stud_position" value={updatedOfficer.stud_position} onChange={officerHandleInputChange} />
                    <label htmlFor="stud_sy">School Year</label>
                    <input type="text" id="stud_sy" name="stud_sy" value={updatedOfficer.stud_sy} onChange={officerHandleInputChange} />

                    <label htmlFor="stud_img">Student Image</label>
                    <input type="file" id="stud_img" accept="image/*" onChange={(e) => officerHandleFileChange(e, "stud_img")} />
                    {officerImgPreview ? (
                      <img src={officerImgPreview} alt="Officer Img Preview" className="preview-image-event" />
                    ) : updatedOfficer.stud_img ? (
                      <img src={`http://127.0.0.1/uploads/${updatedOfficer.stud_img}`} alt="Officer Img" className="preview-image-event" />
                    ) : null}

                    <button className="update-button" onClick={officerHandleUpdate}>Update Officer</button>
                    <button className="cancel-button" onClick={officerCloseDialog}>Cancel</button>
                  </div>
                </div>
                )}
              {newOfficerDialogOpen && (
              <div className="dialog-overlay">
                  <div className="dialog-content">
                    <h2>Add New Officer</h2>
                    <label htmlFor="stud_id">Student ID</label>
                    <input type="text" id="stud_id" name="stud_id" value={newOfficer.stud_id} onChange={handleNewOfficerInputChange} />
                    <label htmlFor="stud_name">Student Name</label>
                    <input type="text" id="stud_name" name="stud_name" value={newOfficer.stud_name} onChange={handleNewOfficerInputChange} />
                    <label htmlFor="stud_dept">Student Dept</label>
                    <input type="text" id="stud_dept" name="stud_dept" value={newOfficer.stud_dept} onChange={handleNewOfficerInputChange} />
                    <label htmlFor="stud_type">Student Type</label>
                    <input type="text" id="stud_type" name="stud_type" value={newOfficer.stud_type} onChange={handleNewOfficerInputChange} />
                    <label htmlFor="stud_position">Position</label>
                    <input type="text" id="stud_position" name="stud_position" value={newOfficer.stud_position} onChange={handleNewOfficerInputChange} />
                    <label htmlFor="stud_sy">School Year</label>
                    <input type="text" id="stud_sy" name="stud_sy" value={newOfficer.stud_sy} onChange={handleNewOfficerInputChange} />

                    <label htmlFor="stud_img">Student Image</label>
                    <input type="file" id="stud_img" accept="image/*" onChange={handleNewOfficerFileChange} />
                    {officerImgPreview && <img src={officerImgPreview} alt="Event Preview" />}

                    <button onClick={handleNewOfficerSubmit}>Add Officer</button>
                    <button onClick={closeNewOfficerDialog}>Cancel</button>
                  </div>
                </div>
                )}
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
                    <button className="deleteEvent-button" onClick={() => handleDeleteMember(member.stud_key)}>
                    <img src="/delete.png" alt="file icon" className="iconss" />
                    Delete</button>
                  </div>
                </div>
              ))}
            </div>
          );
        case "Constitutions & By-Laws":
          return (
            <div className="constitutions-container">
              
            </div>
          );
        case "Apply":
          return (
            <div className="apply-container">
              
            </div>
          );
      default:
        return null;
    }
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
            <a href="#" className="navbar-link">Home</a>
            <a href="#" className="navbar-link">Activities</a>
            <a href="/" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="#" className="navbar-link">OSA Services</a>
          </div>
        </div>
      </div>
      
      <div className="main-content5">
        <h1 className="update-title">Update Organization Information</h1>
        <div className="navbar-container-event2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active-tab" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="event-item2">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            renderTabContent()
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

export default UpdateOrg;