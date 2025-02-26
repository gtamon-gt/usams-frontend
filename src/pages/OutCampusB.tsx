import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import './OutCampusA.css';
import axios from 'axios';

interface User {
  user_id: string;
  user_role: string;
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

interface Program {
  prog_key: string;
  pros_key: string;
  program_name: string;
  start_time: string;
  end_time: string;
  persons_involved: string;
}

interface SchedActs {
  sch_key: string;
  pros_key: string;
  sch_date: string;
  sch_start: string;
  sch_end: string;
  sch_place: string;
}

interface BudgetSource {
  source_key: string;
  pros_key: string;
  source: string;
  particulars: string;
}

interface BudgetAllocation {
  allocation_key: string;
  pros_key: string;
  particulars: string;
  quantity: number;
  amount: number;
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

interface Committee {
  comm_key: string;
  comm_name: string;
  comm_members: string;
  pros_key: string;
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

const OutCampusB: React.FC = () => {
  const location = useLocation();
  const { userId, userInfo } = location.state || {};
  const { org_id } = useParams<{ org_id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [adviser, setAdviser] = useState<Adviser | null>(null);
  const [dean, setDean] = useState<Dean | null>(null);
  const [activeSection, setActiveSection] = useState('FormA');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [newProsKey, setNewProsKey] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userInfoState, setUserInfoState] = useState<Organization | null>(null);

  // Proposals
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposal, setNewProposal] = useState<Proposal>({
    pros_key: '',
    org_id: org_id as string,
    pros_nature: '',
    pros_proponent: '',
    pros_dean: '',
    pros_title: '',
    pros_date: '',
    pros_venue: '',
    pros_stakeholder: '',
    pros_objectives: '',
    pros_rationale: '',
    pros_participants: '',
    actfee_proposed: 0,
    actfee_expense: 0,
    actfee_collection: 0,
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
    house_rules: ''
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
    program_name: '',
    start_time: '',
    end_time: '',
    persons_involved: '',
  });

  // Form A
  const [schedacts, setSchedActs] = useState<SchedActs[]>([]);
  const [newSchedAct, setNewSchedAct] = useState<SchedActs>({
    sch_key: '',
    pros_key: '',
    sch_date: '',
    sch_start: '',
    sch_end: '',
    sch_place: '',
  });

  // Form B
  const [budgetSources, setBudgetSources] = useState<BudgetSource[]>([]);
  const [newBudgetSource, setNewBudgetSource] = useState<BudgetSource>({
    source_key: '',
    pros_key: '',
    source: '',
    particulars: ''
  });

  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([]);
  const [newBudgetAllocation, setNewBudgetAllocation] = useState<BudgetAllocation>({
    allocation_key: '',
    pros_key: '',
    particulars: '',
    quantity: 0,
    amount: 0
  });

  // Act Fee
  const [actFees, setActFees] = useState<ActFee[]>([]);
  const [newActFee, setNewActFee] = useState<ActFee>({
    actfee_key: '',
    pros_key: '',
    actfee_particulars: '',
    actfee_quantity: 0,
    actfee_amount: 0,
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
    const fetchData = async () => {
      try {
        const [orgRes, advRes, deanRes, usersRes, proposalRes] = await Promise.all([
          axios.get(`http://localhost:8800/organizations/`),
          axios.get(`http://localhost:8800/advisers/`),
          axios.get(`http://localhost:8800/deans/`),
          axios.get(`http://localhost:8800/users/`),
          axios.get("http://localhost:8800/proposals")
        ]);

        const org = orgRes.data.find((o: Organization) => o.org_id === org_id);
        setOrganization(org || null);
        setOrganizations(orgRes.data);

        if (org) {
          const adv = advRes.data.find((a: Adviser) => a.adv_id === org.adv_id);
          setAdviser(adv || null);
          setAdviserName(adv ? adv.adv_name : ''); // Set adviser name
        }

        if (org) {
          const dean = deanRes.data.find((a: Dean) => a.dean_id === org.dean_id);
          setDean(dean || null);
          setDeanName(dean ? dean.dean_name : ''); // Set adviser name
        }

        setUsers(usersRes.data);
        setProposals(proposalRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [org_id]);

    useEffect(() => {
      if (userId && users.length > 0 && organizations.length > 0) {
        const user = users.find((u) => u.user_id === userId);
        if (user) {
          console.log('Found user:', user);
          const selectedOrganization = organizations.find((o) => o.user_id === userId);
          if (selectedOrganization) {
            console.log('Found organization:', selectedOrganization);
            setUserInfoState(selectedOrganization);
          } else {
            console.log('Organization not found for userId:', userId);
          }
        } else {
          console.log('User not found for userId:', userId);
        }
      }
    }, [userId, users, organizations]);

  // Proposal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProposal({ ...newProposal, [name]: value });
  };

  const handleNewProposal = async () => {
    const requiredFields = [
      'pros_nature', 'pros_title', 'pros_rationale', 'selected_sdg',
      'alignment_explanation', 'objective1_title', 'objective1_explanation',
      'objective2_title', 'objective2_explanation', 'objective3_title',
      'objective3_explanation', 'ilo1', 'ilo2', 'ilo3', 
      'actfee_proposed', 'actfee_expense', 'actfee_collection', 'house_rules'
    ];
  
    for (const field of requiredFields) {
      if (!newProposal[field as keyof Proposal]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }
  
    let newProsKey = `pros_${proposals.length + 1}`;
    const existingProsKeys = new Set(proposals.map((p) => p.pros_key));
    while (existingProsKeys.has(newProsKey)) {
      newProsKey = `pros_${parseInt(newProsKey.split('_')[1]) + 1}`;
    }
  
    const formData = new FormData();
    Object.keys(newProposal).forEach((key) => {
      formData.append(key, newProposal[key as keyof Proposal] as string);
    });
  
    formData.append('pros_key', newProsKey);
    formData.append('schedacts', JSON.stringify(schedacts));
    formData.append('actfees', JSON.stringify(actFees));
    formData.append('participants', JSON.stringify(students.map(student => ({
      participant_id: student.stud_id,
      stud_id: student.stud_id,
      permit: permitLinks[student.stud_id] || ''
    }))));
  
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
  
    try {
      const response = await axios.post(`http://localhost:8800/proposals/outcampus-b/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      alert('Proposal and associated data successfully created.');
      setProposals([...proposals, response.data]);
  
      // Redirect to the preview page
      // navigate(`/preview/${newProsKey}`);
    } catch (err) {
      console.error('Error creating new proposal:', err);
      alert('Failed to create proposal.');
    }
  };

  <div className="sidebar">
    <ul>
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
        Form D - Parent's Permit
      </li>
      <li
        onClick={() => setActiveSection('FormE')}
        className={activeSection === 'FormE' ? 'active' : ''}
      >
        Form E - House Rules
      </li>
    </ul>
  </div>

  // Form A - Programs
  const handleAddProgram = () => {
    const newProgKey = `prog_${Date.now()}`;
    const updatedProgram = {
      ...newProgram,
      prog_key: newProgKey,
      pros_key: newProposal.pros_key,
    };

    setPrograms([...programs, updatedProgram]);
    setNewProgram({
      prog_key: '',
      pros_key: newProposal.pros_key,
      program_name: '',
      start_time: '',
      end_time: '',
      persons_involved: '',
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
      pros_key: newProposal.pros_key,
      program_name: '',
      start_time: '',
      end_time: '',
      persons_involved: '',
    });
  };

  const handleDeleteProgram = (prog_key: string) => {
    const updatedPrograms = programs.filter((program) => program.prog_key !== prog_key);
    setPrograms(updatedPrograms);
  };

  // Sched Acts

  // Form B - SchedActs
  const handleAddSchedAct = () => {
    const newSchKey = `sch_${Date.now()}`;
    const updatedSchedAct = {
      ...newSchedAct,
      sch_key: newSchKey,
      pros_key: newProposal.pros_key,
    };

    setSchedActs([...schedacts, updatedSchedAct]);
    setNewSchedAct({
      sch_key: '',
      pros_key: newProposal.pros_key,
      sch_date: '',
      sch_start: '',
      sch_end: '',
      sch_place: '',
    });
  };

  const handleSchedActInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSchedAct(prevState => ({
      ...prevState,
      [name]: value,
    }));
    console.log(`Updated ${name} to ${value}`); // Debugging log
  };

  const handleEditSchedAct = (sch_key: string) => {
    const schedActToEdit = schedacts.find((schedAct) => schedAct.sch_key === sch_key);
    if (schedActToEdit) {
      setNewSchedAct({ ...schedActToEdit });
      setIsEditing(true);
    }
  };

  const handleUpdateSchedAct = () => {
    const updatedSchedActs = schedacts.map((schedAct) =>
      schedAct.sch_key === newSchedAct.sch_key ? newSchedAct : schedAct
    );
    setSchedActs(updatedSchedActs);
    setIsEditing(false);
    setNewSchedAct({
      sch_key: '',
      pros_key: newProposal.pros_key,
      sch_date: '',
      sch_start: '',
      sch_end: '',
      sch_place: '',
    });
  };

  const handleDeleteSchedAct = (sch_key: string) => {
    const updatedSchedActs = schedacts.filter((schedAct) => schedAct.sch_key !== sch_key);
    setSchedActs(updatedSchedActs);
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
    const newSourceKey = `source_${Date.now()}`;
    const updatedSource = {
      ...newBudgetSource,
      source_key: newSourceKey,
      pros_key: newProposal.pros_key
    };

    setBudgetSources([...budgetSources, updatedSource]);
    setNewBudgetSource({ source_key: '', pros_key: newProposal.pros_key, source: '', particulars: '' });
  };

  const handleEditBudgetSource = (source_key: string) => {
    const sourceToEdit = budgetSources.find((source) => source.source_key === source_key);
    if (sourceToEdit) {
      setNewBudgetSource(sourceToEdit);
      setBudgetSources(budgetSources.filter((source) => source.source_key !== source_key));
    }
  };

  const handleDeleteBudgetSource = (source_key: string) => {
    setBudgetSources(budgetSources.filter((source) => source.source_key !== source_key));
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
      pros_key: newProposal.pros_key
    };

    setBudgetAllocations([...budgetAllocations, updatedAllocation]);
    setNewBudgetAllocation({ allocation_key: '', pros_key: newProposal.pros_key, particulars: '', quantity: 0, amount: 0 });
  };

  const handleEditBudgetItem = (allocation_key: string) => {
    const allocationToEdit = budgetAllocations.find((allocation) => allocation.allocation_key === allocation_key);
    if (allocationToEdit) {
      setNewBudgetAllocation(allocationToEdit);
      setBudgetAllocations(budgetAllocations.filter((allocation) => allocation.allocation_key !== allocation.allocation_key));
    }
  };

  const handleDeleteBudgetItem = (allocation_key: string) => {
    setBudgetAllocations(budgetAllocations.filter((allocation) => allocation.allocation_key !== allocation.allocation_key));
  };

  const getTotalAmount = () => {
    return budgetAllocations.reduce((total, allocation) => total + allocation.amount, 0);
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
    setTempPermitLink(permitLinks[student.stud_id] || ''); // Set the temporary permit link
  };  

  const handleAddStudent = () => {
    if (selectedStudent) {
      const existingStudentIndex = students.findIndex(student => student.stud_id === selectedStudent.stud_id);
      if (existingStudentIndex !== -1) {
        // Update existing student
        const updatedStudents = students.map((student, index) =>
          index === existingStudentIndex ? selectedStudent : student
        );
        setStudents(updatedStudents);
      } else {
        // Add new student
        setStudents([...students, selectedStudent]);
      }
      setSelectedStudent(null);
      setSearchInput('');
      setPermitLinks(prevState => ({
        ...prevState,
        [selectedStudent.stud_id]: tempPermitLink
      }));
      setTempPermitLink(''); // Reset the temporary permit link
    }
  };  

  const handleEditStudent = (stud_id: string) => {
    const studentToEdit = students.find((student) => student.stud_id === stud_id);
    if (studentToEdit) {
      setSelectedStudent(studentToEdit);
      setSearchInput(studentToEdit.stud_name);
      setTempPermitLink(permitLinks[stud_id] || ''); // Set the temporary permit link
    }
  };  

  const handleDeleteStudent = (stud_id: string) => {
    setStudents(students.filter((student) => student.stud_id !== stud_id));
    setPermitLinks(prevState => {
      const { [stud_id]: _, ...rest } = prevState;
      return rest;
    });
    setTempPermitLink(''); // Reset the temporary permit link
  };  

  const handleAddCommittee = () => {
    setCommittees([...committees, { comm_key: '', comm_name: '', comm_members: '', pros_key: newProposal.pros_key }]);
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

  // Act Fee Handlers
  const handleActFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewActFee(prevState => ({
      ...prevState,
      [name]: name === 'actfee_quantity' || name === 'actfee_amount' ? Number(value) : value,
    }));
  };

  const handleAddActFee = () => {
    const newActFeeKey = `actfee_${Date.now()}`;
    const updatedActFee = {
      ...newActFee,
      actfee_key: newActFeeKey,
      pros_key: newProposal.pros_key
    };

    setActFees([...actFees, updatedActFee]);
    setNewActFee({ actfee_key: '', pros_key: newProposal.pros_key, actfee_particulars: '', actfee_quantity: 0, actfee_amount: 0 });
  };

  const handleEditActFee = (actfee_key: string) => {
    const actFeeToEdit = actFees.find((actFee) => actFee.actfee_key === actfee_key);
    if (actFeeToEdit) {
      setNewActFee(actFeeToEdit);
      setActFees(actFees.filter((actFee) => actFee.actfee_key !== actfee_key));
    }
  };

  const handleDeleteActFee = (actfee_key: string) => {
    setActFees(actFees.filter((actFee) => actFee.actfee_key !== actfee_key));
  };

  const [permitLinks, setPermitLinks] = useState<{ [key: string]: string }>({});

  const handlePermitChange = (e: React.ChangeEvent<HTMLInputElement>, stud_id: string) => {
    setPermitLinks(prevState => ({
      ...prevState,
      [stud_id]: e.target.value
    }));
  };

  const [tempPermitLink, setTempPermitLink] = useState<string>('');

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
            <Link to="/home" state={{ userId }} className="navbar-link">Home</Link>
            <Link to="/activities-tab" state={{ userId }} className="navbar-link">Activities</Link>
            <Link to="/organizations-tab" state={{ userId }} className="navbar-link">Organizations</Link>
            <Link to="#" state={{ userId }} className="navbar-link">Accreditation</Link>
            <Link to="#" state={{ userId }} className="navbar-link">OSA Services</Link>
          </div>
        </div>
      </div>

      <div className="main-content7">
        <div className="incampus-content">
          <div className="incampus-header">
            <h4 className="unc-title">University of Nueva Caceres | Office of Student Affairs</h4>
            <h1 className="incampus-title">Off-Campus Activity Form B</h1>
            <h4 className="doc-title"> Document Control No.: UNC-FM-SA-11 </h4>
          </div>
          <div className="incampus-buttons">
            <a className="incampus-button-cancel" href="/activities-tab">
              Cancel
            </a>
            <button className="incampus-button-proceed" onClick={handleNewProposal}>
              Save
            </button>
          </div>
        </div>
        <hr className="title-custom-line" />

        <div className="proposal-form-container">
          <div className="sidebar">
            <ul>
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
                onClick={() => setActiveSection('FormG')}
                className={activeSection === 'FormG' ? 'active' : ''}
              >
                Form E - House Rules
              </li>
            </ul>
          </div>
          <div className="form-content">
            {activeSection === 'FormA' && (
              <div className="section">
                <h2 className="form-a-title">Form A - Program of Activity</h2>
                <hr className="title-custom-line" />

                <div className="section">
                    <form>
                      <div className="details-group">
                        <label>
                          <span>Department</span>
                          <input
                            name="pros_dept"
                            value={organization ? organization.org_tag : ''}
                            onChange={handleInputChange}
                          />
                        </label>

                        <label>
                          <span>Organization</span>
                          <input
                            name="pros_org"
                            value={organization ? organization.org_name : ''}
                            onChange={handleInputChange}
                          />
                        </label>

                        <label className="nature-field">
                          <span>Nature of Activity</span>
                          <select
                            name="pros_nature"
                            value={newProposal.pros_nature}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            <option value="Extra-Curricular">Extra-Curricular Activity</option>
                            <option value="Co-Curricular">Co-Curricular Activity</option>
                          </select>
                        </label>
                      </div>

                      <div className="proponent-group">
                        <label>
                          <span>Adviser</span>
                          <input
                            name="pros_adviser"
                            value={adviserName}
                            onChange={(e) => setAdviserName(e.target.value)}
                          />
                        </label>

                        <label>
                          <span>Dean</span>
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
                          value={newProposal.pros_title}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label className="rationale-field">
                        <span>Rationale</span>
                        <textarea
                          name="pros_rationale"
                          value={newProposal.pros_rationale}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Select SDG Aligned</span>
                        <select
                          name="selected_sdg"
                          value={newProposal.selected_sdg}
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
                          value={newProposal.alignment_explanation}
                          onChange={handleInputChange}
                        />
                      </label>

                      <div className="form-subheading">
                        <h4 className="subheading-form-a"> Alignment to Program Objective (Acad)/ Organizations Objectives (Non-Acad)</h4>
                      </div>

                      <label>
                        <span>Program/ Organization Objective No. 1:</span>
                        <input
                          type="text"
                          name="objective1_title"
                          value={newProposal.objective1_title}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Brief Explanation of its Alignment:</span>
                        <textarea
                          name="objective1_explanation"
                          value={newProposal.objective1_explanation}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Program/ Organization Objective No. 2:</span>
                        <input
                          type="text"
                          name="objective2_title"
                          value={newProposal.objective2_title}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Brief Explanation of its Alignment:</span>
                        <textarea
                          name="objective2_explanation"
                          value={newProposal.objective2_explanation}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Program/ Organization Objective No. 3:</span>
                        <input
                          type="text"
                          name="objective3_title"
                          value={newProposal.objective3_title}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Brief Explanation of its Alignment:</span>
                        <textarea
                          name="objective3_explanation"
                          value={newProposal.objective3_explanation}
                          onChange={handleInputChange}
                        />
                      </label>

                      <div className="form-subheading">
                        <h4 className="subheading-form-a"> Intended Learning Objectives</h4>
                      </div>

                      <label>
                        <span>ILO 1:</span>
                        <textarea
                          name="ilo1"
                          value={newProposal.ilo1}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>ILO 2:</span>
                        <textarea
                          name="ilo2"
                          value={newProposal.ilo2}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>ILO 3:</span>
                        <textarea
                          name="ilo3"
                          value={newProposal.ilo3}
                          onChange={handleInputChange}
                        />
                      </label>
                    </form>
                  </div>

                  <br></br>

                  <div className="form-subheading">
                        <h4 className="subheading-form-a"> Schedule of Activities/Itinerary </h4>
                    </div>

                  <br></br>
                  <div className="form-and-table-container">
                    <div className="program-form-container">
                      <form>
                        <label>
                          <span>Date:</span>
                          <input
                            type="date"
                            name="sch_date"
                            value={newSchedAct.sch_date}
                            onChange={handleSchedActInputChange}
                          />
                        </label>

                        <label>
                          <span>Start Time:</span>
                          <input
                            type="time"
                            name="sch_start"
                            value={newSchedAct.sch_start}
                            onChange={handleSchedActInputChange}
                          />
                        </label>

                        <label>
                          <span>End Time:</span>
                          <input
                            type="time"
                            name="sch_end"
                            value={newSchedAct.sch_end}
                            onChange={handleSchedActInputChange}
                          />
                        </label>

                        <label>
                          <span>Place:</span>
                          <input
                            type="text"
                            name="sch_place"
                            value={newSchedAct.sch_place}
                            onChange={handleSchedActInputChange}
                          />
                        </label>

                        <button className="add-program" type="button" onClick={isEditing ? handleUpdateSchedAct : handleAddSchedAct}>
                          {isEditing ? 'Update Activity' : 'Add Activity'}
                        </button>
                      </form>
                    </div>

                    <div className="programs-table-container">
                      <h3>Added Activities:</h3>
                      <table>
                        <thead>
                          <tr>
                            <th><span>Date</span></th>
                            <th><span>Time</span></th>
                            <th><span>Place</span></th>
                            <th><span>Actions</span></th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedacts.map((schedact) => (
                            <tr key={schedact.sch_key}>
                              <td>{schedact.sch_date}</td>
                              <td>{schedact.sch_start} - {schedact.sch_end}</td>
                              <td>{schedact.sch_place}</td>
                              <td>
                                <div className="edit-buttons">
                                  <button className="edit-button" onClick={() => handleEditSchedAct(schedact.sch_key)}>
                                    <img src="/edit.svg" alt="Edit" />
                                  </button>
                                  <button className="delete-button" onClick={() => handleDeleteSchedAct(schedact.sch_key)}>
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

                <div className="section">
                  <div className="proponent-group">
                    <label>
                      <span>Proposed Activity Fee/Contribution per Student:</span>
                      <input
                        type="number"
                        name="actfee_proposed"
                        value={newProposal.actfee_proposed}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <span>Total Collection:</span>
                      <input
                        type="number"
                        name="actfee_collection"
                        value={newProposal.actfee_collection}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <br></br>

                  <div className="proponent-group">
                    <label>
                      <span>Less Expenses:</span>
                      <input
                        type="number"
                        name="actfee_expense"
                        value={newProposal.actfee_expense}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <span>Remaining Balance:</span>
                      <input
                        type="number"
                        value={newProposal.actfee_collection - newProposal.actfee_expense}
                        readOnly
                      />
                    </label>
                  </div>
                </div>
                <br></br>

                <div className="form-subheading">
                      <h4 className="subheading-form-a"> Proposed Budget Breakdown </h4>
                  </div>

                  <br></br>

                  <div className="budget-form-and-table">
                    <div className="budget-form">
                      <form>
                        <label>
                          <span>Particulars:</span>
                          <input
                            type="text"
                            name="actfee_particulars"
                            value={newActFee.actfee_particulars}
                            onChange={handleActFeeInputChange}
                          />
                        </label>
                        <label>
                          <span>Quantity:</span>
                          <input
                            type="number"
                            name="actfee_quantity"
                            value={newActFee.actfee_quantity}
                            onChange={handleActFeeInputChange}
                          />
                        </label>
                        <label>
                          <span>Amount:</span>
                          <input
                            type="number"
                            name="actfee_amount"
                            value={newActFee.actfee_amount}
                            onChange={handleActFeeInputChange}
                          />
                        </label>
                        <button type="button" onClick={handleAddActFee}>
                          Add Act Fee
                        </button>
                      </form>
                    </div>

                    <div className="budget-table">
                      <h3>Added Act Fees:</h3>
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
                          {actFees.map((actFee) => (
                            <tr key={actFee.actfee_key}>
                              <td>{actFee.actfee_particulars}</td>
                              <td>{actFee.actfee_quantity}</td>
                              <td>{actFee.actfee_amount}</td>
                              <td>
                                <div className="edit-buttons">
                                  <button className="edit-button" onClick={() => handleEditActFee(actFee.actfee_key)}>
                                    <img src="/edit.svg" alt="Edit" />
                                  </button>
                                  <button className="delete-button" onClick={() => handleDeleteActFee(actFee.actfee_key)}>
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
              {activeSection === 'FormC' && (
                <div className="section form-c-section">
                  <h2 className="form-c-title">Form C - List of Student Participants</h2>
                  <hr className="title-custom-line" />

                  <div className="form-and-table-container form-c-container">
                    <div className="student-form-container">
                      <form>
                        <label>
                          <span>Select Student by searching student's name</span>
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

                        <label>
                          <span>Permit Link:</span>
                          <input
                            type="text"
                            name="permit"
                            value={tempPermitLink}
                            onChange={(e) => setTempPermitLink(e.target.value)}
                            placeholder="Enter permit link"
                          />
                        </label>

                        <button className="add-student" type="button" onClick={handleAddStudent}>
                          {selectedStudent && students.some(student => student.stud_id === selectedStudent.stud_id) ? 'Update Student' : 'Add Student'}
                        </button>
                      </form>
                    </div>

                    <div className="withpermit">
                      <h3>Added Students:</h3>
                      <table>
                        <thead>
                          <tr>
                            <th><span>Stud ID</span></th>
                            <th><span>Dept</span></th>
                            <th><span>Student Name</span></th>
                            <th><span>Permit Link</span></th>
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
                                <a href={permitLinks[student.stud_id] || ''} target="_blank" rel="noopener noreferrer">
                                  {permitLinks[student.stud_id] || 'No Link'}
                                </a>
                              </td>
                              <td>
                                <div className="edit-buttons">
                                  <button className="edit-button" onClick={() => handleEditStudent(student.stud_id)}>
                                    <img src="/edit.svg" alt="Edit" />
                                  </button>
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
                        value={newProposal.house_rules}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
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

export default OutCampusB;