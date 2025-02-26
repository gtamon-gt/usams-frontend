import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import './PreviewInCampus.css';
import logo from '/unc_logo.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 40,
    border: '1px solid #e0e0e0',
    marginLeft: 60,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
  },
  table: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
  },
  tableCol: {
    width: '25%',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: '#e0e0e0',
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 12,
    padding: 8,
  },
  previewmain: {
    padding: '40px 40px 100px 40px',
    fontFamily: 'General Sans, sans-serif',
    border: '1px solid #e0e0e0',
    marginLeft: '22%',
    marginRight: '22%',
  },
  spacer: {
    paddingTop: 160,
  },
  detailsTable: {
    width: '100%',
    marginBottom: 20,
    fontSize: 14,
  },
  detailsTableTh: {
    fontWeight: 600,
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailsTableTbodyTrHover: {
    backgroundColor: '#f5f5f5',
  },
  preview: {
    textAlign: 'center',
    marginBottom: 30,
  },
  spacer1: {
    height: 10,
  },
  formASectionStrong: {
    color: '#333',
    fontWeight: 600,
  },
  programsDetailsH2: {
    color: '#a93644',
  },
  formASectionH2: {
    padding: 12,
    textAlign: 'left',
    border: '1px solid #e0e0e0',
    width: 'fit-content',
    fontSize: 21,
    color: '#a93644',
  },
  budgetsDetailsH2: {
    fontSize: 15,
    color: '#333',
    paddingLeft: 5,
  },
  previewSign: {
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: '#f8b8bf',
    fontWeight: 500,
    borderRadius: 5,
    padding: 5,
  },
  previewheader: {
    width: '100%',
    border: '1px solid #e0e0e0',
  },
  previewheaderTd: {
    border: '1px solid #e0e0e0',
    padding: 10,
    textAlign: 'center',
  },
  previewheaderH4: {
    fontSize: 14,
    margin: 0,
    color: '#213547',
  },
  previewheaderH1: {
    fontSize: 20,
    margin: 0,
  },
  previewheaderH5: {
    fontSize: 14,
    margin: 0,
    fontWeight: 500,
  },
  previewheaderImg: {
    width: 60,
    height: 60,
  },
  logoImgOsa: {
    borderRadius: '100%',
  },
  detailsContainerP: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  detailsContainerPSpan: {
    fontWeight: 600,
  },
  detailsTableThTd: {
    border: '1px solid #e0e0e0',
    padding: 8,
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  },
  previewmainH3: {
    fontSize: 16,
    margin: 0,
    color: '#a93644',
    marginBottom: 12,
    marginTop: 15,
  },
  previewmainH6: {
    fontSize: 15,
    margin: 0,
    color: '#213547',
    marginBottom: 12,
    fontWeight: 600,
  },
  forPDF: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '20vh',
    marginBottom: 60,
  },
  forPDFButton: {
    alignSelf: 'center',
    backgroundColor: '#A72837',
    color: 'white',
    border: 'none',
  },
  forPDFButtonHover: {
    backgroundColor: '#8f222f',
  },
  textBold: {
    fontWeight: 600,
  },
});

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

interface MyDocumentProps {
  proposal: Proposal | null;
  organization: Organization | null;
  adviser: Adviser | null;
  dean: Dean | null;
  programs: Program[];
  budgetSources: BudgetSource[];
  budgetAllocations: BudgetAllocation[];
  participants: Participant[];
  students: Student[];
  committees: Committee[];
}

const PreviewInCampus: React.FC = () => {
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
        const programs = programsRes.data.filter((program: Program) => program.pros_key === pros_key);
        console.log("Fetched programs:", programs);
        setPrograms(programs);

        const budgetSourcesRes = await axios.get(`http://localhost:8800/budgets/`);
        const budgetSources = budgetSourcesRes.data.filter((source: BudgetSource) => source.pros_key === pros_key);
        console.log("Fetched budget sources:", budgetSources);
        setBudgetSources(budgetSources);

        const budgetAllocationsRes = await axios.get(`http://localhost:8800/allocations/`);
        const budgetAllocations = budgetAllocationsRes.data.filter((allocation: BudgetAllocation) => allocation.pros_key === pros_key);
        console.log("Fetched budget allocations:", budgetAllocations);
        setBudgetAllocations(budgetAllocations);

        const participantsRes = await axios.get(`http://localhost:8800/participants/`);
        const participants = participantsRes.data.filter((participant: Participant) => participant.pros_key === pros_key);
        console.log("Fetched participants:", participants);
        setParticipants(participants);

        const studentsRes = await axios.get(`http://localhost:8800/students/`);
        setStudents(studentsRes.data);

        const committeesRes = await axios.get(`http://localhost:8800/committees/`);
        const committees = committeesRes.data.filter((comm: Committee) => comm.pros_key === pros_key);
        console.log("Fetched committees:", committees);
        setCommittees(committees);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching proposal:", err);
        setError("Failed to load proposal details.");
        setLoading(false);
      }
    };

    fetchProposal();
  }, [pros_key]);

  const MyDocument: React.FC<MyDocumentProps> = ({
    proposal,
    organization,
    adviser,
    dean,
    programs,
    budgetSources,
    budgetAllocations,
    participants,
    students,
    committees,
  }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View>
            <Text style={styles.title}>UNIVERSITY OF NUEVA CACERES</Text>
            <Text style={styles.subtitle}>In-Campus Activity Form</Text>
            <Text style={styles.subtitle}>Office of Student Affairs</Text>
            <Text style={styles.subtitle}>Document Control No.: UNC-FM-SA-07</Text>
          </View>
          <Image style={styles.logo} src="/osa_logo.png" />
        </View>
  
        <View style={styles.section}>
          <Text style={styles.text}><Text style={styles.textBold}>Nature of Activity:</Text> {proposal?.pros_nature}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Proponent:</Text> {proposal?.pros_proponent}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Affiliation:</Text> {organization?.org_name}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Adviser:</Text> {adviser?.adv_name}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Dean:</Text> {dean?.dean_name}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Project Title:</Text> {proposal?.pros_title}</Text>
  
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Date of the Implementation</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.pros_date}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Venue</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.pros_venue}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Stakeholder</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{organization?.org_name}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Objectives</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.pros_objectives}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Rationale/ Project Description</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.pros_rationale}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Target Participants:</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.pros_participants}</Text>
              </View>
            </View>
          </View>
  
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Committees</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Members</Text></Text>
              </View>
            </View>
            {committees.length > 0 ? (
              committees.map((comm) => (
                <View style={styles.tableRow} key={comm.comm_key}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{comm.comm_name}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{comm.comm_members}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>No committees found</Text>
                </View>
              </View>
            )}
          </View>
  
          <Text style={styles.subtitle}>Form A - Program of Activity</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Program Name</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Time</Text></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}><Text style={styles.textBold}>Persons Involved</Text></Text>
              </View>
            </View>
            {programs.length > 0 ? (
              programs.map((program) => (
                <View style={styles.tableRow} key={program.prog_key}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{program.prog_title}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{program.prog_start} - {program.prog_end}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{program.prog_persons}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>No programs found</Text>
                </View>
              </View>
            )}
          </View>
  
          <Text style={styles.subtitle}>Form B - Proposed Budget</Text>
          <Text style={styles.subtitle}>Main Source of Funds</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Source</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Particulars</Text>
              </View>
            </View>
            {budgetSources.length > 0 ? (
              budgetSources.map((source) => (
                <View style={styles.tableRow} key={source.budget_key}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{source.budget_source}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{source.budget_particulars}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>No budget sources found</Text>
                </View>
              </View>
            )}
          </View>
  
          <Text style={styles.subtitle}>Budget Allocation / Uses of Funds</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Particulars</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Quantity</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Amount</Text>
              </View>
            </View>
            {budgetAllocations.length > 0 ? (
              budgetAllocations.map((allocation) => (
                <View style={styles.tableRow} key={allocation.allocation_key}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{allocation.allocation_particulars}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{allocation.allocation_quantity}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{allocation.allocation_amount}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>No budget allocations found</Text>
                </View>
              </View>
            )}
          </View>
  
          <Text style={styles.subtitle}>Form C - List of Student Participants</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Name of Student</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Department</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Student Number</Text>
              </View>
            </View>
            {participants.length > 0 ? (
              participants.map((participant) => {
                const student = students.find(stud => stud.stud_id === participant.stud_id);
                return (
                  <View style={styles.tableRow} key={participant.part_id}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{student ? student.stud_name : 'N/A'}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{student ? student.stud_dept : 'N/A'}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{student ? student.stud_id : 'N/A'}</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>No participants found</Text>
                </View>
              </View>
            )}
          </View>
  
          <Text style={styles.subtitle}>Form D - UN SDG Alignment</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Selected SDG</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.selected_sdg} - {SDGs.find(sdg => sdg.sdg_number === proposal?.selected_sdg)?.sdg_name}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Alignment Explanation</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.alignment_explanation}</Text>
              </View>
            </View>
          </View>
  
          <Text style={styles.subtitle}>Form E - Alignment to Program Objectives (Acad) / Organizations Objectives (Non-Acad)</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Objective Title</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Explanation</Text>
              </View>
            </View>
            <View style={styles.tableRow} key="objective1">
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.objective1_title}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.objective1_explanation}</Text>
              </View>
            </View>
            <View style={styles.tableRow} key="objective2">
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.objective2_title}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.objective2_explanation}</Text>
              </View>
            </View>
            <View style={styles.tableRow} key="objective3">
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.objective3_title}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.objective3_explanation}</Text>
              </View>
            </View>
          </View>
  
          <Text style={styles.subtitle}>Form F - Intended Learning Outcomes</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>ILO</Text>
              </View>
            </View>
            <View style={styles.tableRow} key="ilo1">
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.ilo1}</Text>
              </View>
            </View>
            <View style={styles.tableRow} key="ilo2">
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.ilo2}</Text>
              </View>
            </View>
            <View style={styles.tableRow} key="ilo3">
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{proposal?.ilo3}</Text>
              </View>
            </View>
          </View>
  
          <Text style={styles.subtitle}>Form G - House Rules</Text>
          <Text style={styles.text}>{proposal?.house_rules}</Text>
        </View>
      </Page>
    </Document>
  );  

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
            <a href="#" className="navbar-link">Home</a>
            <a href="#" className="navbar-link">Activities</a>
            <a href="/" className="navbar-link">Organizations</a>
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
                <h1 className="incampus-title">In-Campus Activity Form</h1>
                <h5 className="osa-title"> Office of Student Affairs </h5>
                <h5 className="doc"> Document Control No.:
                UNC-FM-SA-07 </h5>
              </td>
              <td>
                <img src="/osa_logo.png" alt="Logo" className="logo-img_osa" />
              </td>
            </tr>
          </table>
        </div>

        <div className="details-container">
          <p><span style={{ fontWeight: 600 }}>Nature of Activity:</span> {proposal?.pros_nature}</p>
          <p><span style={{ fontWeight: 600 }}>Proponent:</span> {proposal?.pros_proponent}</p>
          <p><span style={{ fontWeight: 600 }}>Affiliation:</span> {organization?.org_name}</p>
          <p><span style={{ fontWeight: 600 }}>Adviser:</span> {adviser?.adv_name}</p>
          <p><span style={{ fontWeight: 600 }}>Dean:</span> {dean?.dean_name}</p>
          <br></br>

          <p><span style={{ fontWeight: 600 }}>Project Title:</span> {proposal?.pros_title}</p>

          <table className="details-table">
            <tbody>
              <tr>
                <td><span style={{ fontWeight: 600 }}>Date of the Implementation</span></td>
                <td>{proposal?.pros_date}</td>
              </tr>
              <tr>
                <td><span style={{ fontWeight: 600 }}>Venue</span></td>
                <td>{proposal?.pros_venue}</td>
              </tr>
              <tr>
                <td><span style={{ fontWeight: 600 }}>Stakeholder</span></td>
                <td>{organization?.org_name}</td>
              </tr>
              <tr>
                <td><span style={{ fontWeight: 600 }}>Objectives</span></td>
                <td>{proposal?.pros_objectives}</td>
              </tr>
              <tr>
                <td><span style={{ fontWeight: 600 }}>Rationale/ Project Description</span></td>
                <td>{proposal?.pros_rationale}</td>
              </tr>
              <tr>
                <td><span style={{ fontWeight: 600 }}>Target Participants:</span></td>
                <td>{proposal?.pros_participants}</td>
              </tr>
            </tbody>
          </table>

          <table className="details-table">
            <thead>
              <tr>
                <th style={{ fontWeight: 600 }}>Committees</th>
                <th style={{ fontWeight: 600 }}>Members</th>
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

          <h3>Form A - Program of Activity</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th style={{ fontWeight: 600 }}>Program Name</th>
                <th style={{ fontWeight: 600 }}>Time</th>
                <th style={{ fontWeight: 600 }}>Persons Involved</th>
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

          <h3>Form B - Proposed Budget</h3>
          <h6>Main Source of Funds</h6>
          <table className="details-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Particulars</th>
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

          <h6>Budget Allocation / Uses of Funds</h6>
          <table className="details-table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th>Quantity</th>
                <th>Amount</th>
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

          <h3>Form C - List of Student Participants</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th>Name of Student</th>
                <th>Department</th>
                <th>Student Number</th>
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

          <h3>Form D - UN SDG Alignment</h3>
          <table className="details-table">
            <tbody>
              <tr>
                <td>Selected SDG</td>
                <td>{proposal?.selected_sdg} - {SDGs.find(sdg => sdg.sdg_number === proposal?.selected_sdg)?.sdg_name}</td>
              </tr>
              <tr>
                <td>Alignment Explanation</td>
                <td>{proposal?.alignment_explanation}</td>
              </tr>
            </tbody>
          </table>

          <h3>Form E - Alignment to Program Objectives (Acad) / Organizations Objectives (Non-Acad)</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th>Objective Title</th>
                <th>Explanation</th>
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

          <h3>Form F - Intended Learning Outcomes</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th>ILO</th>
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

          <h3>Form G - House Rules</h3>
          <p>{proposal?.house_rules}</p>
        </div>
      </div>

      <div className="forPDF">
        <PDFDownloadLink
          document={
            <MyDocument
              proposal={proposal}
              organization={organization}
              adviser={adviser}
              dean={dean}
              programs={programs}
              budgetSources={budgetSources}
              budgetAllocations={budgetAllocations}
              participants={participants}
              students={students}
              committees={committees}
            />
          }
          fileName="In-Campus Activity Form.pdf"
        >
          {loading ? 'Loading document...' : 'Download PDF'}
        </PDFDownloadLink>
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

export default PreviewInCampus;