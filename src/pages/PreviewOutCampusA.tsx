import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import './PreviewInCampus.css';
import logo from '/unc_logo.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Ensure pdfMake uses the correct fonts
(pdfMake as any).vfs = pdfFonts;

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
  actfee_proposed: number;
  actfee_expense: number;
  actfee_collection: number;
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
}

interface SchedActs {
  sch_key: string;
  pros_key: string;
  sch_date: string;
  sch_start: string;
  sch_end: string;
  sch_place: string;
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
  permit: string;
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

interface ActFee {
  actfee_key: string;
  pros_key: string;
  actfee_particulars: string;
  actfee_quantity: number;
  actfee_amount: number;
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

const PreviewOutCampusA: React.FC = () => {
  const { pros_key } = useParams<{ pros_key: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [adviser, setAdviser] = useState<Adviser | null>(null);
  const [dean, setDean] = useState<Dean | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [schedacts, setSchedActs] = useState<SchedActs[]>([]);
  const [actFees, setActFees] = useState<ActFee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/proposals/${pros_key}`);
        setProposal(response.data);

        const orgRes = await axios.get(`http://localhost:8800/organizations/`);
        const org = orgRes.data.find((o: Organization) => o.org_id === response.data.org_id);
        setOrganization(org || null);

        const advRes = await axios.get(`http://localhost:8800/advisers/`);
        const adv = advRes.data.find((o: Adviser) => o.adv_id === org?.adv_id);
        setAdviser(adv || null);

        const deanRes = await axios.get(`http://localhost:8800/deans/`);
        const dean = deanRes.data.find((o: Dean) => o.dean_id === org?.dean_id);
        setDean(dean || null);

        const programsRes = await axios.get(`http://localhost:8800/programs/`);

        const participantsRes = await axios.get(`http://localhost:8800/participants/`);
        const participants = participantsRes.data.filter((participant: Participant) => participant.pros_key === pros_key);
        console.log("Fetched participants:", participants);
        setParticipants(participants);

        const schRes = await axios.get(`http://localhost:8800/schedacts/`);
        const schs = schRes.data.filter((sch: SchedActs) => sch.pros_key === pros_key);
        console.log("Fetched sched acts:", schs);
        setSchedActs(schs);

        const actfeeRes = await axios.get(`http://localhost:8800/actfee/`);
        const actfee = actfeeRes.data.filter((sch: ActFee) => sch.pros_key === pros_key);
        console.log("Fetched act fees:", actfee);
        setActFees(actfee);

        const studentsRes = await axios.get(`http://localhost:8800/students/`);
        setStudents(studentsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching proposal:", err);
        setError("Failed to load proposal details.");
        setLoading(false);
      }
    };

    fetchProposal();
  }, [pros_key]);

  const generatePDF = () => {
    const input = document.getElementById('proposal-preview');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 size width in mm
        const pageHeight = 295; // A4 size height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('In-Campus Activity Form.pdf');
      });
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
            <img className="pfp-1-icon" loading="lazy" alt="" src="/pfp.jpg" />
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

      <div id="proposal-preview" className="previewmain">
        <div className="incampus-content preview">
          <table className="previewheader">
            <tr>
              <td><img src="/unc_logo.png" alt="Logo" className="logo-img" /></td>
              <td>
                <h4 className="unc-title">UNIVERSITY OF NUEVA CACERES</h4>
                <h1 className="incampus-title">Off-Campus Activity-A Form</h1>
                <h5 className="osa-title"> Office of Student Affairs </h5>
                <h5 className="doc"> Document Control No.:
                UNC-FM-SA-11 </h5>
              </td>
              <td>
                <img src="/osa_logo.png" alt="Logo" className="logo-img_osa" />
              </td>
            </tr>
          </table>
        </div>

        <div className="details-container">
          <h3>Form A - Program of Activity</h3>
          <p><span style={{ fontWeight: 500 }}>Department:</span> {organization?.org_tag}</p>
          <p><span style={{ fontWeight: 500 }}>Organization:</span> {organization?.org_name}</p>
          <p><span style={{ fontWeight: 500 }}>Nature of Activity:</span> {proposal?.pros_nature}</p>
          <p><span style={{ fontWeight: 500 }}>Adviser:</span> {adviser?.adv_name}</p>
          <p><span style={{ fontWeight: 500 }}>Dean:</span> {dean?.dean_name}</p>

          <table className="details-table">
            <tbody>
                <p><span>Rationale:</span></p>
                <tr>
                    <td>{proposal?.pros_rationale}</td>
                </tr>
            </tbody>
          </table>

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

          <h3>Alignment to Program Objectives (Acad) / Organizations Objectives (Non-Acad)</h3>
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

          <h3>Intended Learning Outcomes</h3>
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

          <h3>Schedule of Activities/Itinerary</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th style={{ fontWeight: 500 }}>Date</th>
                <th style={{ fontWeight: 500 }}>Time</th>
                <th style={{ fontWeight: 500 }}>Place</th>
              </tr>
            </thead>
            <tbody>
              {schedacts.length > 0 ? (
                schedacts.map((sch) => (
                  <tr key={sch.sch_key}>
                    <td>{sch.sch_date}</td>
                    <td>{sch.sch_start} - {sch.sch_end}</td>
                    <td>{sch.sch_place}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No programs found</td>
                </tr>
              )}
            </tbody>
          </table>

          <h3>Form B - Proposed Budget</h3>
          <p><span style={{ fontWeight: 500 }}>Proposed Activity Fee/Contribution per student: </span> Php {proposal?.actfee_proposed}</p>
          <p><span style={{ fontWeight: 500 }}>Proposed Budget: </span></p>
          <p><span style={{ fontWeight: 500 }}>   Total Collection: </span> Php {proposal?.actfee_collection ?? 0}</p>
          <p><span style={{ fontWeight: 500 }}>   Less Expenses: </span> Php {proposal?.actfee_expense ?? 0}</p>
          <p><span style={{ fontWeight: 500 }}>   Remaining Balance: </span> Php {(proposal?.actfee_collection ?? 0) - (proposal?.actfee_expense ?? 0)}</p>

          <h3>Breakdown of Proposed Budget</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th style={{ fontWeight: 500 }}>Particulars</th>
                <th style={{ fontWeight: 500 }}>Quantity</th>
                <th style={{ fontWeight: 500 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {actFees.length > 0 ? (
                actFees.map((actfee) => (
                  <tr key={actfee.actfee_key}>
                    <td>{actfee.actfee_particulars}</td>
                    <td>{actfee.actfee_quantity}</td>
                    <td>{actfee.actfee_amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No activity fees found</td>
                </tr>
              )}
            </tbody>
          </table>

          <h3>Form C - List of Student Participants</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th style={{ fontWeight: 500 }}>Name of Student</th>
                <th style={{ fontWeight: 500 }}>Department</th>
                <th style={{ fontWeight: 500 }}>Student Number</th>
                <th style={{ fontWeight: 500 }}>Notarized Permit</th>
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
                      <td><a href={participant.permit} target="_blank" rel="noopener noreferrer">View Permit</a></td>
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

          <h3>Form G - House Rules</h3>
          <p>{proposal?.house_rules}</p>
        </div>
      </div>

      <div className="forPDF">
        <button onClick={generatePDF}>Download PDF</button>
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

export default PreviewOutCampusA;