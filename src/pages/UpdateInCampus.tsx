import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import logo from '/unc_logo.png';
import './InCampus.css';
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

interface Proposal {
  pros_key: string;
  org_id: string;
  pros_nature: string;
  pros_proponent: string;
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
  faculty: string | null;
  affiliation: string;
  stakeholder: string;
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
  allocation_quantity: number;
  allocation_amount: number;
}

interface Student {
  stud_id: string;
  org_id: string;
  stud_dept: string;
  stud_name: string;
  stud_img: string;
}

interface Participant {
  participant_id: string;
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

const UpdateInCampus: React.FC = () => {
  const { org_id, pros_key } = useParams<{ org_id: string; pros_key: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [adviser, setAdviser] = useState<Adviser | null>(null);
  const [dean, setDean] = useState<Dean | null>(null);
  const [activeSection, setActiveSection] = useState('ProjectDetails');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userInfo } = location.state || {};
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [allMembersNote, setAllMembersNote] = useState('');
  const [participantChoice, setParticipantChoice] = useState('individual');
  const [isEditingBudgetSource, setIsEditingBudgetSource] = useState(false);
  const [isEditingBudgetAllocation, setIsEditingBudgetAllocation] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const programsForProposal: Program[] | null = null;
  const [userInfoState, setUserInfoState] = useState<Organization | null>(null);

  // Proposals
  const [proposal, setProposal] = useState<Proposal>({
    pros_key: '',
    org_id: org_id as string,
    pros_nature: '',
    pros_proponent: '',
    pros_title: '',
    pros_date: '',
    pros_venue: '',
    pros_stakeholder: '',
    pros_objectives: '',
    pros_rationale: '',
    pros_participants: '',
    selected_sdg: 0,
    alignment_explanation: '',
    objective1_title: '',
    objective1_explanation: '',
    objective2_title: '',
    objective2_explanation: '',
    objective3_title: '',
    objective3_explanation: '',
    ilo1: '',
    ilo2: '',
    ilo3: '',
    house_rules: '',
    faculty: null, // Initialize faculty as null
    affiliation: '',
    stakeholder: '',
  });

  // Committees
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [newCommittee, setNewCommittee] = useState<Committee>({
    comm_key: '',
    comm_name: '',
    comm_members: '',
    pros_key: '',
  });

  // Form A
  const [programs, setPrograms] = useState<Program[]>([]);
  const [newProgram, setNewProgram] = useState<Program>({
    prog_key: '',
    pros_key: '',
    prog_title: '',
    prog_start: '',
    prog_end: '',
    prog_persons: '',
  });

  // Form B
  const [budgetSources, setBudgetSources] = useState<BudgetSource[]>([]);
  const [newBudgetSource, setNewBudgetSource] = useState<BudgetSource>({
    budget_key: '',
    pros_key: '',
    budget_source: '',
    budget_particulars: ''
  });
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([]);
  const [newBudgetAllocation, setNewBudgetAllocation] = useState<BudgetAllocation>({
    allocation_key: '',
    pros_key: '',
    allocation_particulars: '',
    allocation_quantity: 0,
    allocation_amount: 0
  });

  // Form C
  const [students, setStudents] = useState<Student[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Adviser Name State
  const [adviserName, setAdviserName] = useState<string>('');

  const [deanName, setDeanName] = useState<string>('');

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        const orgRes = await axios.get(`http://localhost:8800/organizations/`);
        const org = orgRes.data.find((o: Organization) => o.org_id === org_id);
        setOrganization(org || null);

        if (org) {
          const advRes = await axios.get(`http://localhost:8800/advisers/`);
          const adv = advRes.data.find((a: Adviser) => a.adv_id === org.adv_id);
          setAdviser(adv || null);
          setAdviserName(adv ? adv.adv_name : '');
        }

        if (org) {
          const deanRes = await axios.get(`http://localhost:8800/deans/`);
          const dean = deanRes.data.find((a: Dean) => a.dean_id === org.dean_id);
          setDean(dean || null);
          setDeanName(dean ? dean.dean_name : '');
        }

        const proposalRes = await axios.get(`http://localhost:8800/proposals/${pros_key}`);
        const proposalData = proposalRes.data;
        setProposal(proposalData);

        const programsRes = await axios.get(`http://localhost:8800/programs`);
        const programsForProposal = programsRes.data.filter((p: Program) => p.pros_key === pros_key);
        setPrograms(programsForProposal);

        const budgetSourcesRes = await axios.get(`http://localhost:8800/budgets`);
        const budgetSourcesForProposal = budgetSourcesRes.data.filter((bs: BudgetSource) => bs.pros_key === pros_key);
        setBudgetSources(budgetSourcesForProposal);

        const budgetAllocationsRes = await axios.get(`http://localhost:8800/allocations`);
        const budgetAllocationsForProposal = budgetAllocationsRes.data.filter((ba: BudgetAllocation) => ba.pros_key === pros_key);
        setBudgetAllocations(budgetAllocationsForProposal);

        const committeesRes = await axios.get(`http://localhost:8800/committees`);
        const committeesForProposal = committeesRes.data.filter((c: Committee) => c.pros_key === pros_key);
        setCommittees(committeesForProposal);

        const participantsRes = await axios.get(`http://localhost:8800/participants`);
        const participantsForProposal = participantsRes.data.filter((p: Participant) => p.pros_key === pros_key);
        setParticipants(participantsForProposal);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching proposal details:", err);
        setError("Failed to load proposal details.");
        setLoading(false);
      }
    };

    fetchProposalDetails();
  }, [org_id, pros_key]);

  useEffect(() => {
    if (userId && userInfo) {
      // Directly use userInfo if it's a single object
      setUserInfoState(userInfo);
    }
  }, [userId, userInfo]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProposal(prevProposal => ({
      ...prevProposal,
      [name]: value === '' ? null : value, // Set to null if the input is empty
    }));
  };

  const handleUpdateProposal = async () => {
    const requiredFields = [
      'pros_nature', 'pros_proponent', 'pros_title', 'pros_date', 'pros_venue',
      'pros_objectives', 'pros_rationale', 'pros_participants', 'selected_sdg',
      'alignment_explanation', 'objective1_title', 'objective1_explanation',
      'ilo1', 'house_rules'
    ];

    for (const field of requiredFields) {
      if (!proposal[field as keyof Proposal]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }

    let formData = new FormData();
    Object.keys(proposal).forEach((key) => {
      formData.append(key, proposal[key as keyof Proposal] as string);
    });

    formData.append('programs', JSON.stringify(programs));
    formData.append('budgetSources', JSON.stringify(budgetSources));
    formData.append('budgetAllocations', JSON.stringify(budgetAllocations));
    formData.append('participants', JSON.stringify(participants));
    formData.append('committees', JSON.stringify(committees));

    try {
      const response = await axios.put(`http://localhost:8800/proposals/${pros_key}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Proposal and associated data successfully updated.');
      navigate(`/preview/${pros_key}`, { state: { userId } });
    } catch (err) {
      console.error('Error updating proposal:', err);
      alert('Failed to update proposal.');
    }
  };

  // Form A - Programs
  const handleAddProgram = () => {
    const newProgKey = `prog_${Date.now()}`;
    const updatedProgram = {
      ...newProgram,
      prog_key: newProgKey,
      pros_key: proposal.pros_key,
    };

    setPrograms([...programs, updatedProgram]);
    setNewProgram({
      prog_key: '',
      pros_key: proposal.pros_key,
      prog_title: '',
      prog_start: '',
      prog_end: '',
      prog_persons: '',
    });
  };

  const handleProgramInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProgram({ ...newProgram, [name]: value });
  };

  const handleEditProgram = (prog_key: string) => {
    const programToEdit = programs.find((program) => program.prog_key === prog_key);
    if (programToEdit) {
      setNewProgram({ ...programToEdit });
      setIsEditing(true);
    }
  };

  const handleUpdateProgram = () => {
    const updatedPrograms = programs.map((program) =>
      program.prog_key === newProgram.prog_key ? newProgram : program
    );
    setPrograms(updatedPrograms);
    setIsEditing(false);
    setNewProgram({
      prog_key: '',
      pros_key: proposal.pros_key,
      prog_title: '',
      prog_start: '',
      prog_end: '',
      prog_persons: '',
    });
  };

  const handleDeleteProgram = (prog_key: string) => {
    const updatedPrograms = programs.filter((program) => program.prog_key !== prog_key);
    setPrograms(updatedPrograms);
  };

  // Form B - Budget
  const handleBudgetSourceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBudgetSource(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddBudgetSource = () => {
    const newBudgetKey = `budget_${Date.now()}`;
    const updatedSource = {
      ...newBudgetSource,
      budget_key: newBudgetKey,
      pros_key: proposal.pros_key
    };

    setBudgetSources([...budgetSources, updatedSource]);
    setNewBudgetSource({ budget_key: '', pros_key: proposal.pros_key, budget_source: '', budget_particulars: '' });
  };

  const handleEditBudgetSource = (budget_key: string) => {
    const sourceToEdit = budgetSources.find((source) => source.budget_key === budget_key);
    if (sourceToEdit) {
      setNewBudgetSource(sourceToEdit);
      setBudgetSources(budgetSources.filter((source) => source.budget_key !== budget_key));
    }
  };

  const handleDeleteBudgetSource = (budget_key: string) => {
    setBudgetSources(budgetSources.filter((source) => source.budget_key !== budget_key));
  };

  const handleBudgetAllocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBudgetAllocation(prevState => ({
      ...prevState,
      [name]: name === 'quantity' || name === 'amount' ? Number(value) : value,
    }));
  };

  const handleAddBudgetAllocation = () => {
    const newBudgetAllocationKey = `allocation_${Date.now()}`;
    const updatedAllocation = {
      ...newBudgetAllocation,
      allocation_key: newBudgetAllocationKey,
      pros_key: proposal.pros_key
    };

    setBudgetAllocations([...budgetAllocations, updatedAllocation]);
    setNewBudgetAllocation({ allocation_key: '', pros_key: proposal.pros_key, allocation_particulars: '', allocation_quantity: 0, allocation_amount: 0 });
  };

  const handleEditBudgetAllocation = (allocation_key: string) => {
    const allocationToEdit = budgetAllocations.find((allocation) => allocation.allocation_key === allocation_key);
    if (allocationToEdit) {
      setNewBudgetAllocation(allocationToEdit);
      setBudgetAllocations(budgetAllocations.filter((allocation) => allocation.allocation_key !== allocation_key));
    }
  };

  const handleDeleteBudgetAllocation = (allocation_key: string) => {
    setBudgetAllocations(budgetAllocations.filter((allocation) => allocation.allocation_key !== allocation_key));
  };

  const getTotalAmount = () => {
    return budgetAllocations.reduce((total, allocation) => total + allocation.allocation_amount, 0);
  };

  // Form C - Student Participants
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchInput(value);

    if (value.length > 2) {
      axios.get(`http://localhost:8800/search-students?name=${value}`)
        .then(response => {
          setSearchResults(response.data);
        })
        .catch(error => {
          console.error('Error fetching students:', error);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchInput(student.stud_name);
    setSearchResults([]);
  };

  const handleAddStudent = () => {
    if (selectedStudent) {
      setStudents([...students, selectedStudent]);
      setSelectedStudent(null);
      setSearchInput('');
    }
  };

  const handleEditStudent = (stud_id: string) => {
    const studentToEdit = students.find((student) => student.stud_id === stud_id);
    if (studentToEdit) {
      setSelectedStudent(studentToEdit);
      setStudents(students.filter((student) => student.stud_id !== stud_id));
    }
  };

  const handleDeleteStudent = (stud_id: string) => {
    setStudents(students.filter((student) => student.stud_id !== stud_id));
  };

  const handleAddCommittee = () => {
    setCommittees([...committees, { comm_key: '', comm_name: '', comm_members: '', pros_key: proposal.pros_key }]);
  };

  const handleCommitteeChange = (index: number, field: keyof Committee, value: string) => {
    const updatedCommittees = committees.map((committee, i) =>
      i === index ? { ...committee, [field]: value } : committee
    );
    setCommittees(updatedCommittees);
  };

  const handleDeleteCommittee = (index: number) => {
    const updatedCommittees = committees.filter((_, i) => i !== index);
    setCommittees(updatedCommittees);
  };

  useEffect(() => {
    console.log("Programs state:", programs);
    console.log("BudgetSources state:", budgetSources);
    console.log("BudgetAllocations state:", budgetAllocations);
  }, [programs, budgetSources, budgetAllocations]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
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
            {userInfoState && (
              <>
                <div className="profile-text">
                  <div className="user-name">
                    {userInfoState.org_name}
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
            <a href="/home" className="navbar-link">Home</a>
            <a href="/activities-tab" className="navbar-link">Activities</a>
            <a href="/organizations-tab" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="#" className="navbar-link">OSA Services</a>
          </div>
        </div>
      </div>

      <div className="main-content7">
        <div className="incampus-content">
          <div className="incampus-header">
            <h4 className="unc-title">University of Nueva Caceres | Office of Student Affairs</h4>
            <h1 className="incampus-title">Update In-Campus Activity Form</h1>
            <h4 className="doc-title"> Document Control No.: UNC-FM-SA-07 </h4>
          </div>
          <div className="incampus-buttons">
            <a className="incampus-button-cancel" href="/activities-tab">
              Cancel
            </a>
            <button className="incampus-button-proceed" onClick={handleUpdateProposal}>
              Save
            </button>
          </div>
        </div>
        <hr className="title-custom-line" />

        <div className="proposal-form-container">
          <div className="sidebar">
            <ul>
              <li
                onClick={() => setActiveSection('ProjectDetails')}
                className={activeSection === 'ProjectDetails' ? 'active' : ''}
              >
                Project Details
              </li>
              <li
                onClick={() => setActiveSection('FormA')}
                className={activeSection === 'FormA' ? 'active' : ''}
              >
                Form A - Program of Activity
              </li>
              <li
                onClick={() => setActiveSection('FormB')}
                className={activeSection === 'FormB' ? 'active' : ''}
              >
                Form B - Proposed Budget
              </li>
              <li
                onClick={() => setActiveSection('FormC')}
                className={activeSection === 'FormC' ? 'active' : ''}
              >
                Form C - List of Student Participants
              </li>
              <li
                onClick={() => setActiveSection('FormD')}
                className={activeSection === 'FormD' ? 'active' : ''}
              >
                Form D - UN SDG Alignment
              </li>
              <li
                onClick={() => setActiveSection('FormE')}
                className={activeSection === 'FormE' ? 'active' : ''}
              >
                Form E - Alignment to Program Objectives (Acad)/ Organizations Objectives (Non-Acad)
              </li>
              <li
                onClick={() => setActiveSection('FormF')}
                className={activeSection === 'FormF' ? 'active' : ''}
              >
                Form F - Intended Learning Outcomes
              </li>
              <li
                onClick={() => setActiveSection('FormG')}
                className={activeSection === 'FormG' ? 'active' : ''}
              >
                Form G - House Rules
              </li>
              <li
                onClick={() => setActiveSection('FacultyInCharge')}
                className={activeSection === 'FacultyInCharge' ? 'active' : ''}
              >
                Faculty-in-Charge
              </li>
            </ul>
          </div>
          <div className="form-content">
            {activeSection === 'ProjectDetails' && (
              <div className="section">
                <h2>Project Details</h2>
                <hr className="title-custom-line" />
                <form>
                  <label className="nature-field">
                    <span>Nature of Activity</span>
                    <select
                      name="pros_nature"
                      value={proposal.pros_nature}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Extra-Curricular">Extra-Curricular Activity</option>
                      <option value="Co-Curricular">Co-Curricular Activity</option>
                    </select>
                  </label>

                  <div className="proponent-group">
                    <label>
                      <span>Project Proponent</span>
                      <input
                        name="pros_proponent"
                        value={proposal.pros_proponent}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <span>Affiliation</span>
                      <input
                        name="affiliation"
                        value={proposal.affiliation}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>

                  <div className="approval-group">
                    <label>
                      <span>Adviser</span>
                      <input
                        name="pros_adviser"
                        value={adviserName}
                        onChange={(e) => setAdviserName(e.target.value)}
                      />
                    </label>
                    <label>
                      <span>Dean (not necessary if the activity is extra-curricular)</span>
                      <input
                        name="pros_dean"
                        value={deanName}
                        onChange={(e) => setDeanName(e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="title-field">
                    <span>Project Title</span>
                    <input
                      type="text"
                      name="pros_title"
                      value={proposal.pros_title}
                      onChange={handleInputChange}
                    />
                  </label>

                  <div className="details-group">
                    <label>
                      <span>Date</span>
                      <input
                        type="date"
                        name="pros_date"
                        value={proposal.pros_date}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <span>Venue</span>
                      <input
                        type="text"
                        name="pros_venue"
                        value={proposal.pros_venue}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <span>Stakeholder</span>
                      <input
                        name="pros_stakeholder"
                        value={proposal.stakeholder}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>

                  <label className="objectives-field">
                    <span>Objectives</span>
                    <textarea
                      name="pros_objectives"
                      value={proposal.pros_objectives}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label className="rationale-field">
                    <span>Rationale/ Project Description</span>
                    <textarea
                      name="pros_rationale"
                      value={proposal.pros_rationale}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label className="participants-field">
                    <span>Target Participants</span>
                    <textarea
                      name="pros_participants"
                      value={proposal.pros_participants}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label className="committees-field">
                    <span>Committees</span>
                    <div className="committee-list">
                      {committees.map((committee, index) => (
                        <div key={index} className="committee-item">
                          <input
                            type="text"
                            value={committee.comm_name}
                            onChange={(e) => handleCommitteeChange(index, 'comm_name', e.target.value)}
                            placeholder="Committee Name"
                          />
                          <textarea
                            value={committee.comm_members}
                            onChange={(e) => handleCommitteeChange(index, 'comm_members', e.target.value)}
                            placeholder="Members"
                          />
                          <button type="button" onClick={() => handleDeleteCommittee(index)}>
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={handleAddCommittee}>
                      Add Committee
                    </button>
                  </label>
                </form>
              </div>
            )}
            {activeSection === 'FormA' && (
                <div className="section">
                    <h2 className="form-a-title">Form A - Program of Activity</h2>
                    <hr className="title-custom-line" />

                    <div className="form-and-table-container">
                    <div className="program-form-container">
                        <form>
                        <label>
                            <span>Program Name:</span>
                            <input
                            type="text"
                            name="program_name"
                            value={newProgram.prog_title}
                            onChange={handleProgramInputChange}
                            />
                        </label>

                        <label>
                            <span>Start Time:</span>
                            <input
                            type="time"
                            name="start_time"
                            value={newProgram.prog_start}
                            onChange={handleProgramInputChange}
                            />
                        </label>

                        <label>
                            <span>End Time:</span>
                            <input
                            type="time"
                            name="end_time"
                            value={newProgram.prog_end}
                            onChange={handleProgramInputChange}
                            />
                        </label>

                        <label>
                            <span>Persons Involved:</span>
                            <input
                            type="text"
                            name="persons_involved"
                            value={newProgram.prog_persons}
                            onChange={handleProgramInputChange}
                            />
                        </label>

                        <button className="add-program"
                            type="button"
                            onClick={isEditing ? handleUpdateProgram : handleAddProgram}
                        >
                            {isEditing ? 'Update Program' : 'Add Program'}
                        </button>
                        </form>
                    </div>

                    <div className="programs-table-container">
                        <h3>Added Programs:</h3>
                        <table>
                        <thead>
                            <tr>
                            <th> <span>Program Name</span> </th>
                            <th> <span>Time</span> </th>
                            <th> <span>Persons Involved</span> </th>
                            <th> <span>Actions </span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map((program) => (
                            <tr key={program.prog_key}>
                                <td>{program.prog_title}</td>
                                <td>{program.prog_start} - {program.prog_end}</td>
                                <td>{program.prog_persons}</td>
                                <td>
                                <div className="edit-buttons">
                                    <button className="edit-button" onClick={() => handleEditProgram(program.prog_key)}>
                                    <img src="/edit.svg" alt="Edit" />
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteProgram(program.prog_key)}>
                                    <img src="/delete-red.svg" alt="Delete" />
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                )}

                {activeSection === 'FormB' && (
                <div className="section">
                    <h2 className="form-b-title">Form B - Proposed Budget</h2>
                    <hr className="title-custom-line" />

                    <div className="formb-title"> Main Source of Funds </div>
                    <div className="budget-form-and-table">
                    <div className="budget-form">
                        <form>
                        <label>
                            <span>Source:</span>
                            <input
                            type="text"
                            name="budget_source"
                            value={newBudgetSource.budget_source}
                            onChange={handleBudgetSourceInputChange}
                            />
                        </label>
                        <label>
                            <span> Particulars:</span>
                            <input
                            type="text"
                            name="budget_particulars"
                            value={newBudgetSource.budget_particulars}
                            onChange={handleBudgetSourceInputChange}
                            />
                        </label>
                        <button type="button" onClick={handleAddBudgetSource}>
                            Add Source
                        </button>
                        </form>
                    </div>

                    <div className="budget-table">
                        <h3>Added Source of Funds:</h3>
                        <table>
                        <thead>
                            <tr>
                            <th><span>Source</span></th>
                            <th><span>Particulars</span></th>
                            <th><span>Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetSources.map((source) => (
                            <tr key={source.budget_key}>
                                <td>{source.budget_source}</td>
                                <td>{source.budget_particulars}</td>
                                <td>
                                <div className="edit-buttons">
                                    <button className="edit-button" onClick={() => handleEditBudgetSource(source.budget_key)}>
                                    <img src="/edit.svg" alt="Edit" />
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteBudgetSource(source.budget_key)}>
                                    <img src="/delete-red.svg" alt="Delete" />
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>

                    <hr className="custom-line" />

                    <div className="formb-title"> Budget Allocation / Uses of Funds </div>
                    <div className="budget-form-and-table">
                    <div className="budget-form">
                        <form>
                        <label>
                            <span>Particulars:</span>
                            <input
                            type="text"
                            name="particulars"
                            value={newBudgetAllocation.allocation_particulars}
                            onChange={handleBudgetAllocationInputChange}
                            />
                        </label>
                        <label>
                            <span>Quantity:</span>
                            <input
                            type="number"
                            name="quantity"
                            value={newBudgetAllocation.allocation_quantity}
                            onChange={handleBudgetAllocationInputChange}
                            />
                        </label>
                        <label>
                            <span>Amount:</span>
                            <input
                            type="number"
                            name="amount"
                            value={newBudgetAllocation.allocation_amount}
                            onChange={handleBudgetAllocationInputChange}
                            />
                        </label>
                        <button type="button" onClick={handleAddBudgetAllocation}>
                            Add Item
                        </button>
                        </form>
                    </div>

                    <div className="budget-table two">
                        <h3>Added Budget Allocations:</h3>
                        <table>
                        <thead>
                            <tr>
                            <th><span>Particulars</span></th>
                            <th><span>Quantity</span></th>
                            <th><span>Amount</span></th>
                            <th><span>Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetAllocations.map((allocation) => (
                            <tr key={allocation.allocation_key}>
                                <td>{allocation.allocation_particulars}</td>
                                <td>{allocation.allocation_quantity}</td>
                                <td>{allocation.allocation_amount}</td>
                                <td>
                                <div className="edit-buttons">
                                    <button className="edit-button" onClick={() => handleEditBudgetAllocation(allocation.allocation_key)}>
                                    <img src="/edit.svg" alt="Edit" />
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteBudgetAllocation(allocation.allocation_key)}>
                                    <img src="/delete-red.svg" alt="Delete" />
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>

                        <div className="total-amount">
                        <strong>Total Amount: {getTotalAmount()}</strong>
                        </div>
                    </div>
                    </div>

                </div>
                )}
            {activeSection === 'FormC' && (
              <div className="section form-c-section">
                <h2 className="form-c-title">Form C - List of Student Participants</h2>
                <hr className="title-custom-line" />

                <div className="radio-formc">
                <label>
                  <input
                    type="radio"
                    name="participantChoice"
                    value="individual"
                    checked={participants.length > 0}
                    onChange={() => setAllMembersNote('')}
                  />
                  <span>Input Individual Students</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="participantChoice"
                    value="note"
                    checked={allMembersNote !== ''}
                    onChange={() => setParticipants([])}
                  />
                  <span>Provide a Note (e.g., all members will participate in the event)</span>
                </label>
              </div>

              <br></br>

                <div className="form-and-table-container form-c-container">
                  <div className="student-form-container">
                    <form>
                      {allMembersNote !== '' && (
                        <label>
                          <span>Note:</span>
                          <input
                            type="text"
                            value={allMembersNote}
                            onChange={(e) => setAllMembersNote(e.target.value)}
                          />
                        </label>
                      )}

                      {allMembersNote === '' && (
                        <>
                          <label>
                            <span>Student Name:</span>
                            <input
                              type="text"
                              name="stud_name"
                              value={searchInput}
                              onChange={handleSearchInputChange}
                            />
                            {searchResults.length > 0 && (
                              <ul>
                                {searchResults.map(student => (
                                  <li key={student.stud_id} onClick={() => handleSelectStudent(student)}>
                                    {student.stud_name} ({student.stud_dept})
                                  </li>
                                ))}
                              </ul>
                            )}
                          </label>

                          <button className="add-student" type="button" onClick={handleAddStudent}>
                            Add Student
                          </button>
                        </>
                      )}
                    </form>
                  </div>

                  {allMembersNote === '' && (
                    <div className="students-table-container">
                      <h3>Added Students:</h3>
                      <table>
                        <thead>
                          <tr>
                            <th><span>Student ID</span></th>
                            <th><span>Department</span></th>
                            <th><span>Student Name</span></th>
                            <th><span>Actions</span></th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.stud_id}>
                              <td>{student.stud_id}</td>
                              <td>{student.stud_dept}</td>
                              <td>{student.stud_name}</td>
                              <td>
                                <div className="edit-buttons">
                                  <button className="delete-button" onClick={() => handleDeleteStudent(student.stud_id)}>
                                    <img src="/delete-red.svg" alt="Delete" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeSection === 'FormD' && (
              <div className="section">
                <h2 className="form-d-title">Form D - UN SDG Alignment</h2>
                <hr className="title-custom-line" />

                <div className="form-d-content">
                  <label>
                    <span>Select SDG Aligned</span>
                    <select
                      name="selected_sdg"
                      value={proposal.selected_sdg}
                      onChange={handleInputChange}
                    >
                      <option value="">Select SDG</option>
                      {SDGs.map((sdg) => (
                        <option key={sdg.sdg_number} value={sdg.sdg_number}>
                          {sdg.sdg_number} - {sdg.sdg_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Brief Explanation of Alignment:</span>
                    <textarea
                      name="alignment_explanation"
                      value={proposal.alignment_explanation}
                      onChange={handleInputChange}
                    />
                  </label>

                </div>
              </div>
            )}
            {activeSection === 'FormE' && (
              <div className="section">
                <h2 className="form-e-title">Form E - Alignment to Program Objectives (Acad)/ Organizations Objectives (Non-Acad)</h2>
                <hr className="title-custom-line" />

                <div className="form-e-content">
                  <div className="objective">
                    <label>
                      <span>Program/ Organization Objective No. 1:</span>
                      <input
                        type="text"
                        name="objective1_title"
                        value={proposal.objective1_title}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      <span>Brief Explanation of its Alignment:</span>
                      <textarea
                        name="objective1_explanation"
                        value={proposal.objective1_explanation}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      <span>Program/ Organization Objective No. 2 (Optional):</span>
                      <input
                        type="text"
                        name="objective2_title"
                        value={proposal.objective2_title}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      <span>Brief Explanation of its Alignment (Optional):</span>
                      <textarea
                        name="objective2_explanation"
                        value={proposal.objective2_explanation}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      <span>Program/ Organization Objective No. 3 (Optional):</span>
                      <input
                        type="text"
                        name="objective3_title"
                        value={proposal.objective3_title}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      <span>Brief Explanation of its Alignment (Optional):</span>
                      <textarea
                        name="objective3_explanation"
                        value={proposal.objective3_explanation}
                        onChange={handleInputChange}
                      />
                    </label>

                  </div>
                </div>
              </div>
            )}
            {activeSection === 'FormF' && (
              <div className="section">
                <h2 className="form-f-title">Form F - Intended Learning Outcomes</h2>
                <hr className="title-custom-line" />

                <div className="form-f-content">
                  <label>
                    <span>ILO 1:</span>
                    <textarea
                      name="ilo1"
                      value={proposal.ilo1}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label>
                    <span>ILO 2 (Optional):</span>
                    <textarea
                      name="ilo2"
                      value={proposal.ilo2}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label>
                    <span>ILO 3 (Optional):</span>
                    <textarea
                      name="ilo3"
                      value={proposal.ilo3}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'FormG' && (
              <div className="section">
                <h2 className="form-g-title">Form G - House Rules</h2>
                <hr className="title-custom-line" />

                <div className="form-g-content">
                  <label className="form-g-content">
                    <span>House Rules:</span>
                    <textarea
                      name="house_rules"
                      value={proposal.house_rules}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>
            )}
            {activeSection === 'FacultyInCharge' && (
  <div className="section">
    <h2>Faculty-in-Charge</h2>
    <hr className="title-custom-line" />
    <form>
      <div className="radio-formc">
        <label>
          <input
            type="radio"
            name="facultyChoice"
            value="adviser"
            checked={proposal.faculty === null}
            onChange={() => setProposal(prevProposal => ({ ...prevProposal, faculty: null }))}
          />
          <span>Adviser</span>
        </label>
        <label>
          <input
            type="radio"
            name="facultyChoice"
            value="input"
            checked={proposal.faculty !== null}
            onChange={() => setProposal(prevProposal => ({ ...prevProposal, faculty: '' }))}
          />
          <span>Input Faculty Name</span>
        </label>
      </div>
      {proposal.faculty !== null && (
        <label>
          <span>Faculty Name:</span>
          <input
            type="text"
            name="faculty"
            value={proposal.faculty || ''}
            onChange={handleInputChange}
          />
        </label>
      )}
    </form>
  </div>
)}
          </div>
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

export default UpdateInCampus;