import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '/unc_logo.png';

const tabs = ["Activities", "Officers", "Members", "Accreditation History", "Activity Reports"];

interface Organization {
  org_id: string;
  org_name: string;
  org_type: string;
  org_tag: string;
  org_desc: string;
  org_img: string;
  org_header: string;
}

interface Proposal {
  pros_id: string;
  pros_title: string;
  pros_date: string;
  pros_venue: string;
  rationale: string;
  status: string;
  on_revision: number;
  org_id: string;
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

interface Approver {
  employee_id: string;
  user_id: string;
  sy_id: string;
  employee_name: string;
  employee_position: string;
}

interface Report {
  sy_id: string;
  reps_id: string;
  reqdep: string;
  title: string;
  date_submitted: string;
  sy: string; // Add school year field
}

interface Accreditation {
  acc_id: string;
  org_id: string;
  sy_id: string;
  status: string;
  date_approved: string;
}

interface Reaccreditation {
  reacc_id: string;
  orgname: string;
  sy_id: string;
  status: string;
  date_approved: string;
}

const OrgDetailsDSA: React.FC = () => {
  const { org_id } = useParams<{ org_id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [reaccreditations, setReaccreditations] = useState<Reaccreditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Activities");
  const [selectedEventSY, setSelectedEventSY] = useState<string>("SY 2024-2025");
  const [selectedEventType, setSelectedEventType] = useState<string>("Concluded");
  const [selectedMemberSY, setSelectedMemberSY] = useState<string>("SY 2024-2025");
  const [selectedOfficerSY, setSelectedOfficerSY] = useState<string>("SY 2024-2025");
  const [selectedReportSY, setSelectedReportSY] = useState<string>("SY 2024-2025"); // Add state for selected school year
  const [selectedAccreditationSY, setSelectedAccreditationSY] = useState<string>("SY 2024-2025"); // Add state for selected school year
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  const [approver, setApprover] = useState<Approver | null>(null);
  const [userInfo, setUserInfo] = useState<Approver | null>(null);

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        const res = await axios.get("http://localhost:8800/organizations");
        const org = res.data.find((o: Organization) => o.org_id === org_id);
        setOrganization(org || null);

        const proposalsRes = await axios.get("http://localhost:8800/proposals");
        const orgProposals = proposalsRes.data.filter(
          (proposal: Proposal) =>
            proposal.org_id === org_id &&
            proposal.status === "Fully Approved" &&
            proposal.on_revision === 0
        );
        console.log("Fetched Proposals:", orgProposals); // Log fetched proposals
        setProposals(orgProposals);

        const membersRes = await axios.get("http://localhost:8800/members");
        const orgMembers = membersRes.data.filter((member: Member) => member.org_id === org_id);
        setMembers(orgMembers);

        const studentsRes = await axios.get("http://localhost:8800/students");
        setStudents(studentsRes.data);

        const reportsRes = await axios.get("http://localhost:8800/accomplishment/osa");
        const orgReports = reportsRes.data.filter((report: Report) => report.reqdep === org?.org_name);
        setReports(orgReports);

        const accreditationsRes = await axios.get("http://localhost:8800/accreditations");
        setAccreditations(accreditationsRes.data);

        const reaccreditationsRes = await axios.get("http://localhost:8800/reaccreditations");
        setReaccreditations(reaccreditationsRes.data);

        const approversRes = await axios.get("http://localhost:8800/approvers");
        const approver = approversRes.data.find((a: Approver) => a.user_id === userId);
        setApprover(approver || null);
        setUserInfo(approver || null);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching organization details:", err);
        setError("Failed to load organization details.");
        setLoading(false);
      }
    };
    fetchOrgDetails();
  }, [org_id, userId]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateRationale = (rationale: string) => {
    if (!rationale) return '';
    const sentences = rationale.split('. ');
    if (sentences.length > 2) {
      return sentences.slice(0, 2).join('. ') + '...';
    }
    return rationale;
  };

  const isDateInSchoolYear = (date: Date, schoolYear: string) => {
    const [startYear, endYear] = schoolYear.split('-').map(year => parseInt(year.trim(), 10));
    const startDate = new Date(`${startYear}-06-01`);
    const endDate = new Date(`${endYear}-05-31`);
    return date >= startDate && date <= endDate;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Activities":
        const currentDate = new Date();
        const filteredProposals = proposals.filter(proposal => {
          const proposalDate = new Date(proposal.pros_date);
          const isConcluded = proposalDate < currentDate;
          const isUpcoming = proposalDate >= currentDate;
          const matchesType = selectedEventType === "Concluded" ? isConcluded : isUpcoming;
          const isInSchoolYear = isDateInSchoolYear(proposalDate, selectedEventSY);
          console.log("Proposal Date:", proposalDate, "Current Date:", currentDate, "Is Concluded:", isConcluded, "Is Upcoming:", isUpcoming, "Matches Type:", matchesType, "Is In School Year:", isInSchoolYear); // Log date comparison
          return isInSchoolYear && matchesType;
        });
        console.log("Filtered Proposals:", filteredProposals); // Log filtered proposals
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
                {filteredProposals.length} results
              </div>
            </div>
            {filteredProposals.map(proposal => (
              <div key={proposal.pros_id} className="event-item">
                <img src={`/default_event_pic.png`} className="event-thumbnail" />
                <div className="event-details">
                  <div className="event-name">{proposal.pros_title}</div>
                  <div className="event-date">{formatDate(proposal.pros_date)} | {proposal.pros_venue}</div>
                  <div className="event-description">{truncateRationale(proposal.rationale)}</div>
                </div>
                <div className="event-view-button">
                  <Link to={`/event/${proposal.pros_id}`} className="event-view-button-button">View</Link>
                </div>
              </div>
            ))}
          </div>
        );
      case "Officers":
        const filteredOfficers = members.filter(member => member.sy_id === selectedOfficerSY && member.role);
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
                {filteredOfficers.length} results
              </div>
            </div>
            {filteredOfficers.map(officer => {
              const student = students.find(student => student.stud_id === officer.stud_id);
              if (student) {
                return (
                  <div key={officer.member_id} className="officer-item">
                    <img src={`http://127.0.0.1/uploads/${student.stud_img}`} alt={student.stud_name} className="officer-pfp" />
                    <div className="officer-details">
                      <div className="officer-name">{student.stud_name}</div>
                      <div className="officer-position">{officer.role}</div>
                    </div>
                    <div className="event-view-button">
                      <Link to={`/member/${student.stud_id}`} className="event-view-button-button">View</Link>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      case "Members":
        const filteredMembers = members.filter(member => member.sy_id === selectedMemberSY);
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
            {filteredMembers.map(member => {
              const student = students.find(student => student.stud_id === member.stud_id);
              if (student) {
                return (
                  <div key={member.member_id} className="officer-item">
                    <img src={`http://127.0.0.1/uploads/${student.stud_img}`} alt={student.stud_name} className="officer-pfp" />
                    <div className="officer-details">
                      <div className="officer-name">{student.stud_name}</div>
                      <div className="officer-position">{student.stud_id}</div>
                    </div>
                    <div className="event-view-button">
                      <Link to={`/member/${student.stud_id}`} className="event-view-button-button">View</Link>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
        case "Accreditation History":
          const filteredAccreditations = accreditations.filter(accreditation =>
            accreditation.org_id === org_id
          );
          const filteredReaccreditations = reaccreditations.filter(reaccreditation =>
            reaccreditation.orgname === organization?.org_name
          );
          return (
            <div className="accreditation-container">
              <div style={{ height: '5px' }}></div>
              {filteredAccreditations.length > 0 && (
                <div className="proposals-list">
                  <div className="proposal-row header-row">
                    <div className="proposal-cell">School Year</div>
                    <div className="proposal-cell">Date Approved</div>
                    <div className="proposal-cell"></div>
                  </div>
                  {filteredAccreditations.map(accreditation => (
                    <div key={accreditation.acc_id} className="proposal-row">
                      <div className="proposal-cell">{accreditation.sy_id}</div>
                      <div className="proposal-cell">{formatDate(accreditation.date_approved)}</div>
                      <div className="proposal-cell ext">
                        <button
                          onClick={() => {
                            navigate(`/viewaccreditation/${accreditation.acc_id}`, { state: { userId, userInfo } });
                          }}
                        >
                          View Accreditation Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filteredReaccreditations.length > 0 && (
                <div className="proposals-list">
                  <div className="proposal-row header-row">
                    <div className="proposal-cell">School Year</div>
                    <div className="proposal-cell">Date Approved</div>
                    <div className="proposal-cell"></div>
                  </div>
                  {filteredReaccreditations.map(reaccreditation => (
                    <div key={reaccreditation.reacc_id} className="proposal-row">
                      <div className="proposal-cell">{reaccreditation.sy_id}</div>
                      <div className="proposal-cell">{formatDate(reaccreditation.date_approved)}</div>
                      <div className="proposal-cell ext">
                        <button
                          onClick={() => {
                            navigate(`/viewreaccreditation/${reaccreditation.reacc_id}`, { state: { userId, userInfo } });
                          }}
                        >
                          View Reaccreditation Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filteredAccreditations.length === 0 && filteredReaccreditations.length === 0 && (
                <p>No accreditation history available.</p>
              )}
            </div>
          );
          case "Activity Reports":
            const filteredReports = reports.filter(report => report.sy_id === selectedReportSY);
            return (
              <div className="reports-container">
                <div className="sorting-container">
                  <div className="sorting-left">
                    <select value={selectedReportSY} onChange={e => setSelectedReportSY(e.target.value)}>
                      <option value="SY 2023-2024">SY 2023-2024</option>
                      <option value="SY 2024-2025">SY 2024-2025</option>
                    </select>
                  </div>
                  <div className="sorting-right">
                    {filteredReports.length} results
                  </div>
                </div>
                <div style={{ height: '5px' }}></div>
                {filteredReports.length > 0 ? (
                  <div className="proposals-list">
                    <div className="proposal-row header-row">
                      <div className="proposal-cell">Activity Title</div>
                      <div className="proposal-cell">Date Submitted</div>
                      <div className="proposal-cell"></div>
                    </div>
                    {filteredReports.map((report) => (
                      <div key={report.reps_id} className="proposal-row">
                        <div className="proposal-cell">{report.title}</div>
                        <div className="proposal-cell">{formatDate(report.date_submitted)}</div>
                        <div className="proposal-cell ext">
                          <button
                            onClick={() => {
                              navigate(`/approvereportsform/${report.reps_id}`, { state: { userId, userInfo } });
                            }}
                          >
                            View Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No reports available.</p>
                )}
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
            <img className="pfp-1-icon" loading="lazy" alt="" src="/default.png" />
            {approver && (
              <div className="profile-text">
                <div className="user-name">
                  {approver.employee_name}
                </div>
                <button className="sign-out-button" onClick={() => navigate('/', { state: { userId: null } })}>
                  SIGN OUT
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="navbar">
          <div className="navbar-links">
            <Link to="/home" state={{ userId }} className="navbar-link">Home</Link>
            <Link to="/adviser-activities-tab" state={{ userId }} className="navbar-link">Activities</Link>
            <Link to="/adviser-organizations-tab" state={{ userId }} className="navbar-link">Organizations</Link>
            <Link to="/accreditation-tab" state={{ userId }} className="navbar-link">Accreditation</Link>
            <Link to="/osa-services-tab" state={{ userId }} className="navbar-link">OSA Services</Link>
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
      </div>

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

export default OrgDetailsDSA;
