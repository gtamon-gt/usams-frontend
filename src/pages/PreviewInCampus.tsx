import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import './PreviewInCampus.css';
import logo from '/unc_logo.png';
import ReactDOM from 'react-dom/client';

interface User {
  user_id: string;
  user_role: string;
}

interface Proposal {
  pros_key: string;
  org_id: string;
  pros_nature: string;
  pros_proponent: string;
  pros_dean: string;
  pros_title: string;
  pros_date: string;
  pros_venue: string;
  pros_stakeholder: string;
  pros_objectives: string;
  pros_rationale: string;
  pros_participants: string;
  selected_sdg: number;
  alignment_explanation: string;
  objective1_title: string;
  objective1_explanation: string;
  objective2_title: string;
  objective2_explanation: string;
  objective3_title: string;
  objective3_explanation: string;
  ilo1: string;
  ilo2: string;
  ilo3: string;
  house_rules: string;
  note: string;
  step_at: number | null;
  faculty: string | null;
  affiliation: string;
  stakeholder: string;
  date_adviser?: string | null; // New field
  date_dean?: string | null;    // New field
  date_osa?: string | null;     // New field
  date_dsaa?: string | null;    // New field
}

interface Organization {
  org_id: string;
  org_name: string;
  org_type: string;
  org_tag: string;
  org_desc: string;
  adv_id: string;
  dean_id: string;
  sy_id: string;
  org_img: string;
  org_header: string;
  user_id: string;
}

interface Adviser {
  adv_id: string;
  adv_name: string;
  sy_id: string;
}

interface Dean {
  dean_id: string;
  dean_name: string;
  sy_id: string;
}

interface Program {
  prog_key: string;
  pros_key: string;
  prog_title: string;
  prog_start: string;
  prog_end: string;
  prog_persons: string;
}

interface BudgetSource {
  budget_key: string;
  pros_key: string;
  budget_source: string;
  budget_particulars: string;
}

interface BudgetAllocation {
  allocation_key: string;
  pros_key: string;
  allocation_particulars: string;
  allocation_quantity: string;
  allocation_amount: string;
}

interface Student {
  stud_id: string;
  org_id: string;
  stud_dept: string;
  stud_name: string;
  stud_img: string;
}

interface Participant {
  part_id: string;
  pros_key: string;
  stud_id: string;
}

interface Committee {
  comm_key: string;
  comm_name: string;
  comm_members: string;
  pros_key: string;
}

interface SDG {
  sdg_number: number;
  sdg_name: string;
}

const SDGs: SDG[] = [
  { sdg_number: 1, sdg_name: 'No Poverty' },
  { sdg_number: 2, sdg_name: 'Zero Hunger' },
  { sdg_number: 3, sdg_name: 'Good Health and Well-being' },
  { sdg_number: 4, sdg_name: 'Quality Education' },
  { sdg_number: 5, sdg_name: 'Gender Equality' },
  { sdg_number: 6, sdg_name: 'Clean Water and Sanitation' },
  { sdg_number: 7, sdg_name: 'Affordable and Clean Energy' },
  { sdg_number: 8, sdg_name: 'Decent Work and Economic Growth' },
  { sdg_number: 9, sdg_name: 'Industry, Innovation and Infrastructure' },
  { sdg_number: 10, sdg_name: 'Reduced Inequalities' },
  { sdg_number: 11, sdg_name: 'Sustainable Cities and Communities' },
  { sdg_number: 12, sdg_name: 'Responsible Consumption and Production' },
  { sdg_number: 13, sdg_name: 'Climate Action' },
  { sdg_number: 14, sdg_name: 'Life Below Water' },
  { sdg_number: 15, sdg_name: 'Life On Land' },
  { sdg_number: 16, sdg_name: 'Peace, Justice and Strong Institutions' },
  { sdg_number: 17, sdg_name: 'Partnerships for the Goals' },
];

const PreviewInCampus: React.FC = () => {
  const location = useLocation();
  const { userId, userInfo } = location.state || {};
  const { pros_key } = useParams<{ pros_key: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [adviser, setAdviser] = useState<Adviser | null>(null);
  const [dean, setDean] = useState<Dean | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [budgetSources, setBudgetSources] = useState<BudgetSource[]>([]);
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userInfoState, setUserInfoState] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeSection, setActiveSection] = useState<string>('section1');
  const navigate = useNavigate();
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/proposals/${pros_key}`);
        console.log("Proposal Data:", response.data);
        setProposal(response.data);

        const orgRes = await axios.get(`http://localhost:8800/organizations/`);
        const org = orgRes.data.find((o: Organization) => o.org_id === response.data.org_id);
        console.log("Organization Data:", org);
        setOrganization(org || null);

        const advRes = await axios.get(`http://localhost:8800/advisers/`);
        const adv = advRes.data.find((o: Adviser) => o.adv_id === org?.adv_id);
        console.log("Adviser Data:", adv);
        setAdviser(adv || null);

        const deanRes = await axios.get(`http://localhost:8800/deans/`);
        const dean = deanRes.data.find((o: Dean) => o.dean_id === org?.dean_id);
        console.log("Dean Data:", dean);
        setDean(dean || null);

        const programsRes = await axios.get(`http://localhost:8800/programs/`);
        const programs = programsRes.data.filter((program: Program) => program.pros_key === pros_key);
        console.log("Programs Data:", programs);
        setPrograms(programs);

        const budgetSourcesRes = await axios.get(`http://localhost:8800/budgets/`);
        const budgetSources = budgetSourcesRes.data.filter((source: BudgetSource) => source.pros_key === pros_key);
        console.log("Budget Sources Data:", budgetSources);
        setBudgetSources(budgetSources);

        const budgetAllocationsRes = await axios.get(`http://localhost:8800/allocations/`);
        const budgetAllocations = budgetAllocationsRes.data.filter((allocation: BudgetAllocation) => allocation.pros_key === pros_key);
        console.log("Budget Allocations Data:", budgetAllocations);
        setBudgetAllocations(budgetAllocations);

        const participantsRes = await axios.get(`http://localhost:8800/participants/`);
        const participants = participantsRes.data.filter((participant: Participant) => participant.pros_key === pros_key);
        console.log("Participants Data:", participants);
        setParticipants(participants);

        const studentsRes = await axios.get(`http://localhost:8800/students/`);
        console.log("Students Data:", studentsRes.data);
        setStudents(studentsRes.data);

        const committeesRes = await axios.get(`http://localhost:8800/committees/`);
        const committees = committeesRes.data.filter((comm: Committee) => comm.pros_key === pros_key);
        console.log("Committees Data:", committees);
        setCommittees(committees);

        const usersRes = await axios.get(`http://localhost:8800/users/`)
        console.log("Users Data:", usersRes.data);
        setUsers(usersRes.data);

        const orgsRes = await axios.get(`http://localhost:8800/organizations/`)
        console.log("Organizations Data:", orgsRes.data);
        setOrganizations(orgsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching proposal:", err);
        setError("Failed to load proposal details.");
        setLoading(false);
      }
    };

    fetchProposal();
  }, [pros_key]);

  useEffect(() => {
    console.log("userId:", userId);
    console.log("users:", users);
    console.log("organizations:", organizations);
    if (userId && users.length > 0) {
      const user = users.find((u) => u.user_id === userId);
      if (user) {
        const selectedOrganization = organizations.find((o) => o.user_id === userId);
        if (selectedOrganization) {
          setUserInfoState(selectedOrganization);
        }
      }
    }
  }, [userId, users, organizations]);

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'letter');
    const page = document.querySelector('.previewmain') as HTMLElement;
    const pageHeight = 279.4; // Letter size height in mm
    let currentHeight = 0;

    if (page) {
      const totalHeight = page.offsetHeight;
      let remainingHeight = totalHeight;

      while (remainingHeight > 0) {
        const canvas = await html2canvas(page, {
          height: Math.min(remainingHeight, pageHeight),
          windowHeight: pageHeight,
          scale: 2,
          y: totalHeight - remainingHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (currentHeight + imgHeight > pageHeight) {
          pdf.addPage();
          currentHeight = 0;
        }

        pdf.addImage(imgData, 'PNG', 0, currentHeight, imgWidth, imgHeight);
        currentHeight += imgHeight;
        remainingHeight -= pageHeight;
      }

      pdf.save('In-Campus Activity Form.pdf');
    }
  };

  const renderSection1 = () => (
    <div id="section1">
      <div className="incampus-content preview">
        <table className="previewheader">
          <tr>
            <td><img src="/unc_logo.png" alt="Logo" className="logo-img" /></td>
            <td>
              <h4 className="unc-title">UNIVERSITY OF NUEVA CACERES</h4>
              <h1 className="incampus-title">In-Campus Activity Form</h1>
              <h5 className="osa-title"> Office of Student Affairs </h5>
              <h5 className="doc"> Document Control No.: UNC-FM-SA-07 </h5>
            </td>
            <td>
              <img src="/osa_logo.png" alt="Logo" className="logo-img_osa" />
            </td>
          </tr>
        </table>
      </div>

      <div className="details-container">
        <br></br>
        <p><span style={{ fontWeight: 500 }}>Nature of Activity:</span> {proposal?.pros_nature}</p>
        <p><span style={{ fontWeight: 500 }}>Proponent:</span> {proposal?.pros_proponent}</p>
        <p><span style={{ fontWeight: 500 }}>Affiliation:</span> {proposal?.affiliation}</p>
        <p><span style={{ fontWeight: 500 }}>Adviser:</span> {adviser?.adv_name}</p>
        <p><span style={{ fontWeight: 500 }}>Dean:</span> {dean?.dean_name}</p>

        <div className="projTitleBreak"></div>
        <p><span style={{ fontWeight: 500 }}>Project Title:</span> {proposal?.pros_title}</p>
        <div className="projTitleBreak"></div>
        <div className="projTitleBreak"></div>

        <table className="details-table main-table">
          <tbody>
            <tr>
              <td><span style={{ fontWeight: 500 }}>Date of the Implementation</span></td>
              <td>{proposal?.pros_date ? new Date(proposal.pros_date).toLocaleDateString() : 'N/A'}</td>
            </tr>
            <tr>
              <td><span style={{ fontWeight: 500 }}>Venue</span></td>
              <td>{proposal?.pros_venue}</td>
            </tr>
            <tr>
              <td><span style={{ fontWeight: 500 }}>Stakeholder</span></td>
              <td>{proposal?.stakeholder}</td>
            </tr>
            <tr>
              <td><span style={{ fontWeight: 500 }}>Objectives</span></td>
              <td>{proposal?.pros_objectives}</td>
            </tr>
            <tr>
              <td><span style={{ fontWeight: 500 }}>Rationale/ Project Description</span></td>
              <td>{proposal?.pros_rationale}</td>
            </tr>
            <tr>
              <td><span style={{ fontWeight: 500 }}>Target Participants:</span></td>
              <td>{proposal?.pros_participants}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="details-container" id="section2">
      <table className="details-table">
        <thead>
          <tr>
            <th style={{ fontWeight: 500 }}>Committees</th>
            <th style={{ fontWeight: 500 }}>Members</th>
          </tr>
        </thead>
        <tbody>
          {committees.length > 0 ? (
            committees.map((comm) => (
              <tr key={comm.comm_key}>
                <td>{comm.comm_name}</td>
                <td>{comm.comm_members}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No committees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSection2_1 = () => (
    <div className="details-container" id="section2_1">
      <p style={{ fontWeight: 500 }}>PROF. KENJIE E. JIMENEA</p>
      <p>Dean, Student and Alumni Affairs</p>
      <p>University of Nueva Caceres</p>
      <br />
      <p>Dear Prof. Jimenea:</p>
      <br />
      <p>Good day! May I humbly request for your approval of our proposed student activity. Attached are the pertinent requirements needed for your consideration. Thank you.</p>
      <br />
      <p>Very truly yours,</p>
      <br />
      <p style={{ fontWeight: 500 }}>{proposal?.pros_proponent}</p>
      <p>Project Proponent</p>
      <br />
      <p style={{ fontWeight: 500 }}>Noted:</p>
      {proposal?.date_adviser && (
        <p style={{ color: '#155724', backgroundColor: '#d4edda', display: 'inline-block', padding: '5px 10px' }}>
          Approved: {new Date(proposal.date_adviser).toLocaleDateString()}
        </p>
      )}
      <br />
      <p style={{ fontWeight: 500 }}>{adviser?.adv_name}</p>
      <p>Adviser, {organization?.org_name}</p>
      <br />
      {proposal?.pros_nature === "Co-Curricular" && (
        <>
          <p style={{ fontWeight: 500 }}>Endorsed by:</p>
          {proposal?.date_dean && (
            <p style={{ color: '#155724', backgroundColor: '#d4edda', display: 'inline-block', padding: '5px 10px' }}>
              Approved: {new Date(proposal.date_dean).toLocaleDateString()}
            </p>
          )}
          <br />
          <p style={{ fontWeight: 500 }}>{dean?.dean_name}</p>
          <p>Dean, {organization?.org_tag}</p>
        </>
      )}
      <br />
      <p style={{ fontWeight: 500 }}>Recommending Approval:</p>
      {proposal?.date_osa && (
        <p style={{ color: '#155724', backgroundColor: '#d4edda', display: 'inline-block', padding: '5px 10px' }}>
          Approved: {new Date(proposal.date_osa).toLocaleDateString()}
        </p>
      )}
      <br />
      <p style={{ fontWeight: 500 }}>GEO-NELL E. RIVERA</p>
      <p>Director for Student Affairs</p>
      <br />
      <p style={{ fontWeight: 500 }}>Approved/Disapproved:</p>
      {proposal?.date_dsaa && (
        <p style={{ color: '#155724', backgroundColor: '#d4edda', display: 'inline-block', padding: '5px 10px' }}>
          Approved: {new Date(proposal.date_dsaa).toLocaleDateString()}
        </p>
      )}
      <br />
      <p style={{ fontWeight: 500 }}>PROF. KENJIE E. JIMENEA</p>
      <p>Dean, Student and Alumni Affairs</p>
      <p>University of Nueva Caceres</p>
    </div>
  );

  const renderSection3 = () => (
    <div className="details-container" id="section3">
      <h3>Form A - Program of Activity</h3>
      <table className="details-table">
        <thead>
          <tr>
            <th style={{ fontWeight: 500 }}>Program Name</th>
            <th style={{ fontWeight: 500 }}>Time</th>
            <th style={{ fontWeight: 500 }}>Persons Involved</th>
          </tr>
        </thead>
        <tbody>
          {programs.length > 0 ? (
            programs.map((program) => (
              <tr key={program.prog_key}>
                <td>{program.prog_title}</td>
                <td>{program.prog_start} - {program.prog_end}</td>
                <td>{program.prog_persons}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No programs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSection4 = () => (
    <div className="details-container" id="section4">
      <h3>Form B - Proposed Budget</h3>
      <h6 style={{ fontWeight: 500 }} >Main Source of Funds</h6>
      <table className="details-table">
        <thead>
          <tr>
            <th style={{ fontWeight: 500 }}>Source</th>
            <th style={{ fontWeight: 500 }}>Particulars</th>
          </tr>
        </thead>
        <tbody>
          {budgetSources.length > 0 ? (
            budgetSources.map((source) => (
              <tr key={source.budget_key}>
                <td>{source.budget_source}</td>
                <td>{source.budget_particulars}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No budget sources found</td>
            </tr>
          )}
        </tbody>
      </table>

      <h6 style={{ fontWeight: 500 }}>Budget Allocation / Uses of Funds</h6>
      <table className="details-table">
        <thead>
          <tr>
            <th style={{ fontWeight: 500 }}>Particulars</th>
            <th style={{ fontWeight: 500 }}>Quantity</th>
            <th style={{ fontWeight: 500 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {budgetAllocations.length > 0 ? (
            budgetAllocations.map((allocation) => (
              <tr key={allocation.allocation_key}>
                <td>{allocation.allocation_particulars}</td>
                <td>{allocation.allocation_quantity}</td>
                <td>{allocation.allocation_amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No budget allocations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSection5 = () => (
    <div className="details-container" id="section5">
      <h3>Form C - List of Student Participants</h3>
      {proposal?.note ? (
        <p>{proposal.note}</p>
      ) : (
        <table className="details-table">
          <thead>
            <tr>
              <th style={{ fontWeight: 500 }}>Name of Student</th>
              <th style={{ fontWeight: 500 }}>Department</th>
              <th style={{ fontWeight: 500 }}>Student Number</th>
            </tr>
          </thead>
          <tbody>
            {participants.length > 0 ? (
              participants.map((participant) => {
                const student = students.find(stud => stud.stud_id === participant.stud_id);
                return (
                  <tr key={participant.part_id}>
                    <td>{student ? student.stud_name : 'N/A'}</td>
                    <td>{student ? student.stud_dept : 'N/A'}</td>
                    <td>{student ? student.stud_id : 'N/A'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3}>No participants found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderSection6 = () => (
    <div className="details-container" id="section6">
      <h3>Form D - UN SDG Alignment</h3>
      <table className="details-table">
        <tbody>
          <tr>
            <td style={{ fontWeight: 500 }}>Selected SDG</td>
            <td>{proposal?.selected_sdg} - {SDGs.find(sdg => sdg.sdg_number === proposal?.selected_sdg)?.sdg_name}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 500 }}>Alignment Explanation</td>
            <td>{proposal?.alignment_explanation}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderSection7 = () => (
    <div className="details-container" id="section7">
      <h3>Form E - Alignment to Program Objectives (Acad) / Organizations Objectives (Non-Acad)</h3>
      <table className="details-table">
        <thead>
          <tr>
            <th style={{ fontWeight: 500 }}>Objective</th>
            <th style={{ fontWeight: 500 }}>Explanation</th>
          </tr>
        </thead>
        <tbody>
          <tr key="objective1">
            <td>{proposal?.objective1_title}</td>
            <td>{proposal?.objective1_explanation}</td>
          </tr>
          <tr key="objective2">
            <td>{proposal?.objective2_title}</td>
            <td>{proposal?.objective2_explanation}</td>
          </tr>
          <tr key="objective3">
            <td>{proposal?.objective3_title}</td>
            <td>{proposal?.objective3_explanation}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderSection8 = () => (
    <div className="details-container" id="section8">
      <h3>Form F - Intended Learning Outcomes</h3>
      <table className="details-table">
        <thead>
          <tr>
            <th style={{ fontWeight: 500 }}>ILO</th>
          </tr>
        </thead>
        <tbody>
          <tr key="ilo1">
            <td>{proposal?.ilo1}</td>
          </tr>
          <tr key="ilo2">
            <td>{proposal?.ilo2}</td>
          </tr>
          <tr key="ilo3">
            <td>{proposal?.ilo3}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderSection9 = () => (
    <div className="details-container" id="section9">
      <h3>Form G - House Rules</h3>
      <p>{proposal?.house_rules}</p>
    </div>
  );

  const renderSection10 = () => (
    <div className="details-container" id="section10">
      <h3>Form E - Letter of Confirmation of Adviser/ Faculty-in-Charge</h3>
      <br />
      <p style={{ fontWeight: 500 }}>PROF. KENJIE E. JIMENEA</p>
      <p>Dean, Student and Alumni Affairs</p>
      <br />
      <p>Dear Prof. Jimenea:</p>
      <br />
      <p>
        This is to confirm my presence during the event of the {organization?.org_name} entitled, "{proposal?.pros_title}" which is scheduled on {proposal?.pros_date ? new Date(proposal.pros_date).toLocaleDateString() : 'N/A'}.
      </p>
      <br />
      <p>
        As the {proposal?.faculty ? 'faculty-in-charge' : 'adviser'} of the said activity, I will be responsible that the objectives of the activity are realized; ensure that the activity is well-organized and well-planned; and guide the students in preparing the webinar.
      </p>
      <br />
      <p>Very truly yours,</p>
      {proposal?.date_adviser && (
        <p style={{ color: '#155724', backgroundColor: '#d4edda', display: 'inline-block', padding: '5px 10px' }}>
          Approved: {new Date(proposal.date_adviser).toLocaleDateString()}
        </p>
      )}
      <br />
      <p style={{ fontWeight: 500 }}>{proposal?.faculty || adviser?.adv_name}</p>
      <p>{proposal?.faculty ? 'Faculty-in-Charge' : `Adviser, ${organization?.org_name}`}</p>
    </div>
  );  

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };

  const handleSubmitToAdviser = async () => {
    try {
      await axios.post(`http://localhost:8800/proposals/incampus/submit`, {
        pros_key: pros_key,
        status: 'Pending Approval of Adviser',
        step_at: 1,
      });
      alert('Submitted to Organization Adviser successfully.');
    } catch (err) {
      console.error('Error submitting to adviser:', err);
      alert('Failed to submit to Organization Adviser.');
    }
  };

  const renderStatusList = () => {
    const maxSteps = proposal?.pros_nature === "Co-Curricular" ? 5 : 4;
    const currentStep = proposal?.step_at ?? 0; // Default to 0 if step_at is undefined
  
    const statusList = [
      { label: 'Approved by Organization Adviser', step: 1, date: proposal?.date_adviser },
      ...(proposal?.pros_nature === "Co-Curricular" ? [{ label: 'Approved by Dean', step: 2, date: proposal?.date_dean }] : []),
      { label: 'Approved by Director for Student Affairs', step: proposal?.pros_nature === "Co-Curricular" ? 3 : 2, date: proposal?.date_osa },
      { label: 'Approved by Dean of Student and Alumni Affairs', step: proposal?.pros_nature === "Co-Curricular" ? 4 : 3, date: proposal?.date_dsaa },
    ];
  
    return (
      <div className="status-list">
        <h4>Status</h4>
        <ul>
          {statusList.map((status) => (
            <li
              key={status.step}
              className={
                status.date ? 'approved' : 'pending' // Mark as 'approved' only if the date is not null
              }
            >
              {status.label}
              {status.date && <span> - Date Approved: {new Date(status.date).toLocaleDateString()}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
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
            {userInfoState && (
              <div className="profile-text">
                <div className="user-name">{userInfoState.org_name}</div>
                <button className="sign-out-button" onClick={handleSignOut}>
                  SIGN OUT
                </button>
              </div>
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
  
      <div className="content-container">
        <div className="sidebar_preview">
          <div className="sidebar-content">
            <ul>
              <li className={activeSection === 'section1' ? 'active' : ''} onClick={() => scrollToSection('section1')}>Project Details</li>
              <li className={activeSection === 'section3' ? 'active' : ''} onClick={() => scrollToSection('section3')}>Program of Activity</li>
              <li className={activeSection === 'section4' ? 'active' : ''} onClick={() => scrollToSection('section4')}>Proposed Budget</li>
              <li className={activeSection === 'section5' ? 'active' : ''} onClick={() => scrollToSection('section5')}>Student Participants</li>
              <li className={activeSection === 'section6' ? 'active' : ''} onClick={() => scrollToSection('section6')}>SDG Alignment</li>
              <li className={activeSection === 'section7' ? 'active' : ''} onClick={() => scrollToSection('section7')}>Program Objectives</li>
              <li className={activeSection === 'section8' ? 'active' : ''} onClick={() => scrollToSection('section8')}>Learning Outcomes</li>
              <li className={activeSection === 'section9' ? 'active' : ''} onClick={() => scrollToSection('section9')}>House Rules</li>
              <li className={activeSection === 'section10' ? 'active' : ''} onClick={() => scrollToSection('section10')}>Confirmation Letter</li>
            </ul>
          </div>
        </div>

        <div className="previewmain">
          {renderSection1()}
          {renderSection2()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection2_1()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection3()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection4()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection5()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection6()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection7()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection8()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection9()}
          <hr style={{ border: '1px solid #e0e0e0', margin: '50px 0' }} />
          {renderSection10()}
        </div>

        <div className="status-list-container">
          {renderStatusList()}
        </div>
      </div>

      <div className="forPDF">
          <button className="download-pdf" onClick={generatePDF}>Download PDF</button>
          {proposal?.step_at === null && (
            <button className="submit-adviser" onClick={handleSubmitToAdviser}>Submit to Organization Adviser</button>
          )}
        </div>
  
      <div ref={pdfPreviewRef} className="pdf-preview"></div>
  
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

export default PreviewInCampus;