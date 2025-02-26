import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import './OutCampusA.css';
import axios from 'axios';

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UpdateOutCampusA: React.FC = () => {
  const { org_id, pros_key } = useParams<{ org_id: string; pros_key: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [adviser, setAdviser] = useState<Adviser | null>(null);
  const [dean, setDean] = useState<Dean | null>(null);
  const [activeSection, setActiveSection] = useState('FormA');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [schedacts, setSchedActs] = useState<SchedActs[]>([]);
  const [actFees, setActFees] = useState<ActFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Proposals
  const [proposal, setProposal] = useState<Proposal>({
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

  // Form C
  const [students, setStudents] = useState<Student[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Adviser Name State
  const [adviserName, setAdviserName] = useState<string>('');

  const [deanName, setDeanName] = useState<string>('');

  // Permit Links State
  const [permitLinks, setPermitLinks] = useState<{ [key: string]: string }>({});
  const [tempPermitLink, setTempPermitLink] = useState<string>('');

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/proposals/${pros_key}`);
        setProposal(response.data);

        const orgRes = await axios.get(`http://localhost:8800/organizations/`);
        const org = orgRes.data.find((o: Organization) => o.org_id === response.data.org_id);
        setOrganization(org || null);

        const advRes = await axios.get(`http://localhost:8800/advisers/`);
        const adv = advRes.data.find((a: Adviser) => a.adv_id === org?.adv_id);
        setAdviser(adv || null);
        setAdviserName(adv ? adv.adv_name : ''); // Set adviser name

        const deanRes = await axios.get(`http://localhost:8800/deans/`);
        const dean = deanRes.data.find((a: Dean) => a.dean_id === org?.dean_id);
        setDean(dean || null);
        setDeanName(dean ? dean.dean_name : ''); // Set dean name

        const participantsRes = await axios.get(`http://localhost:8800/participants/`);
        const parts = participantsRes.data.filter((participant: Participant) => participant.pros_key === pros_key);
        console.log("Fetched participants:", parts);
        setParticipants(parts);

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

    fetchProposalDetails();
  }, [org_id, pros_key]);

  // Proposal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const handleUpdateProposal = async () => {
    const requiredFields = [
      'pros_nature', 'pros_title', 'pros_rationale', 'selected_sdg',
      'alignment_explanation', 'objective1_title', 'objective1_explanation',
      'objective2_title', 'objective2_explanation', 'objective3_title',
      'objective3_explanation', 'ilo1', 'ilo2', 'ilo3',
      'actfee_proposed', 'actfee_expense', 'actfee_collection', 'house_rules'
    ];
  
    for (const field of requiredFields) {
      if (!proposal[field as keyof Proposal]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }
  
    const formData = new FormData();
    Object.keys(proposal).forEach((key) => {
      formData.append(key, proposal[key as keyof Proposal] as string);
    });
  
    formData.append('schedacts', JSON.stringify(schedacts));
    formData.append('actfees', JSON.stringify(actFees));
  
    // Filter participants based on the selected pros_key
    const filteredParticipants = participants.filter(participant => participant.pros_key === proposal.pros_key);
  
    formData.append('participants', JSON.stringify(filteredParticipants.map(participant => ({
      participant_id: participant.stud_id,
      stud_id: participant.stud_id,
      permit: permitLinks[participant.stud_id] || ''
    }))));
  
    try {
      const response = await axios.put(`http://localhost:8800/proposals/outcampus-a/update/${pros_key}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      alert('Proposal successfully updated.');
      navigate(`/out-campus/preview/${pros_key}`);
    } catch (err) {
      console.error('Error updating proposal:', err);
      alert('Failed to update proposal.');
    }
  };  

  // Form A - SchedActs
  const [newSchedAct, setNewSchedAct] = useState<SchedActs>({
    sch_key: '',
    pros_key: '',
    sch_date: '',
    sch_start: '',
    sch_end: '',
    sch_place: ''
  });

  const handleSchedActInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSchedAct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddSchedAct = () => {
    const newSchKey = `sch_${Date.now()}`;
    const updatedSchedAct = {
      ...newSchedAct,
      sch_key: newSchKey,
      pros_key: proposal.pros_key,
    };

    setSchedActs([...schedacts, updatedSchedAct]);
    setNewSchedAct({
      sch_key: '',
      pros_key: proposal.pros_key,
      sch_date: '',
      sch_start: '',
      sch_end: '',
      sch_place: ''
    });
  };

  const handleEditSchedAct = (sch_key: string) => {
    const schedActToEdit = schedacts.find((schedAct) => schedAct.sch_key === sch_key);
    if (schedActToEdit) {
      setNewSchedAct(schedActToEdit);
      setSchedActs(schedacts.filter((schedAct) => schedAct.sch_key !== sch_key));
    }
  };

  const handleUpdateSchedAct = () => {
    const updatedSchedActs = schedacts.map((schedAct) =>
      schedAct.sch_key === newSchedAct.sch_key ? newSchedAct : schedAct
    );
    setSchedActs(updatedSchedActs);
    setNewSchedAct({
      sch_key: '',
      pros_key: proposal.pros_key,
      sch_date: '',
      sch_start: '',
      sch_end: '',
      sch_place: ''
    });
  };

  const handleDeleteSchedAct = (sch_key: string) => {
    setSchedActs(schedacts.filter((schedAct) => schedAct.sch_key !== sch_key));
  };

  // Act Fee Handlers
  const [newActFee, setNewActFee] = useState<ActFee>({
    actfee_key: '',
    pros_key: '',
    actfee_particulars: '',
    actfee_quantity: 0,
    actfee_amount: 0,
  });

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
      pros_key: proposal.pros_key
    };

    setActFees([...actFees, updatedActFee]);
    setNewActFee({ actfee_key: '', pros_key: proposal.pros_key, actfee_particulars: '', actfee_quantity: 0, actfee_amount: 0 });
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

  const getTotalAmount = () => {
    return actFees.reduce((total, actFee) => total + actFee.actfee_amount, 0);
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

  const handleEditStudent = (stud_id: string) => {
    const studentToEdit = students.find((student) => student.stud_id === stud_id);
    const participant = participants.find((participant) => participant.stud_id === stud_id);
    if (studentToEdit && participant) {
      setSelectedStudent(studentToEdit);
      setSearchInput(studentToEdit.stud_name);
      setTempPermitLink(participant.permit || ''); // Set the temporary permit link
    }
  };
  
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchInput(student.stud_name);
    setSearchResults([]);
    const participant = participants.find((participant) => participant.stud_id === student.stud_id);
    setTempPermitLink(participant ? participant.permit : ''); // Set the temporary permit link
  };
  
  const handleAddStudent = () => {
    if (selectedStudent) {
      const existingParticipant = participants.find(participant => participant.stud_id === selectedStudent.stud_id);
      if (existingParticipant) {
        // Update existing participant
        const updatedParticipants = participants.map(participant =>
          participant.stud_id === selectedStudent.stud_id
            ? { ...participant, permit: tempPermitLink }
            : participant
        );
        setParticipants(updatedParticipants);
      } else {
        // Add new participant
        const newParticipant = {
          part_id: `part_${Date.now()}`,
          pros_key: proposal.pros_key, // Ensure the pros_key is set to the current proposal's pros_key
          stud_id: selectedStudent.stud_id,
          permit: tempPermitLink
        };
        setParticipants([...participants, newParticipant]);
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
  
  // In the JSX, update the button text 

  const handleDeleteStudent = (stud_id: string) => {
    // Remove the student from the participants list
    setParticipants(participants.filter((participant) => participant.stud_id !== stud_id));
  
    // Remove the student from the students list
    setStudents(students.filter((student) => student.stud_id !== stud_id));
  
    // Remove the permit link from the permitLinks state
    setPermitLinks(prevState => {
      const { [stud_id]: _, ...rest } = prevState;
      return rest;
    });
  
    // Reset the temporary permit link
    setTempPermitLink('');
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

      <div className="main-content7">
        <div className="incampus-content">
          <div className="incampus-header">
            <h4 className="unc-title">University of Nueva Caceres | Office of Student Affairs</h4>
            <h1 className="incampus-title">Off-Campus Activity Form A</h1>
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
                Form G - House Rules
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
                            value={proposal.pros_nature}
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
                          value={proposal.pros_title}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label className="rationale-field">
                        <span>Rationale</span>
                        <textarea
                          name="pros_rationale"
                          value={proposal.pros_rationale}
                          onChange={handleInputChange}
                        />
                      </label>

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

                      <div className="form-subheading">
                        <h4 className="subheading-form-a"> Alignment to Program Objective (Acad)/ Organizations Objectives (Non-Acad)</h4>
                      </div>

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
                        <span>Program/ Organization Objective No. 2:</span>
                        <input
                          type="text"
                          name="objective2_title"
                          value={proposal.objective2_title}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Brief Explanation of its Alignment:</span>
                        <textarea
                          name="objective2_explanation"
                          value={proposal.objective2_explanation}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Program/ Organization Objective No. 3:</span>
                        <input
                          type="text"
                          name="objective3_title"
                          value={proposal.objective3_title}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>Brief Explanation of its Alignment:</span>
                        <textarea
                          name="objective3_explanation"
                          value={proposal.objective3_explanation}
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
                          value={proposal.ilo1}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>ILO 2:</span>
                        <textarea
                          name="ilo2"
                          value={proposal.ilo2}
                          onChange={handleInputChange}
                        />
                      </label>

                      <label>
                        <span>ILO 3:</span>
                        <textarea
                          name="ilo3"
                          value={proposal.ilo3}
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
                            <td>{formatDate(schedact.sch_date) || 'No Date'}</td>
                            <td>{schedact.sch_start} - {schedact.sch_end}</td>
                            <td>{schedact.sch_place || 'No Persons'}</td>
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
                        value={proposal.actfee_proposed}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <span>Total Collection:</span>
                      <input
                        type="number"
                        name="actfee_collection"
                        value={proposal.actfee_collection}
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
                        value={proposal.actfee_expense}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <span>Remaining Balance:</span>
                      <input
                        type="number"
                        value={proposal.actfee_collection - proposal.actfee_expense}
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
                        {selectedStudent && participants.some(participant => participant.stud_id === selectedStudent.stud_id) ? 'Update Student' : 'Add Student'}
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
                        {participants.map((participant) => {
                        const student = students.find(student => student.stud_id === participant.stud_id);
                        return (
                            <tr key={participant.part_id}>
                            <td>{student ? student.stud_id : 'N/A'}</td>
                            <td>{student ? student.stud_dept : 'N/A'}</td>
                            <td>{student ? student.stud_name : 'N/A'}</td>
                            <td>
                                <a href={participant.permit || ''} target="_blank" rel="noopener noreferrer">
                                {participant.permit || 'No Link'}
                                </a>
                            </td>
                            <td>
                                <div className="edit-buttons">
                                <button className="edit-button" onClick={() => handleEditStudent(participant.stud_id)}>
                                    <img src="/edit.svg" alt="Edit" />
                                </button>
                                <button className="delete-button" onClick={() => handleDeleteStudent(participant.stud_id)}>
                                    <img src="/delete-red.svg" alt="Delete" />
                                </button>
                                </div>
                            </td>
                            </tr>
                        );
                        })}
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
                      value={proposal.house_rules}
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

export default UpdateOutCampusA;